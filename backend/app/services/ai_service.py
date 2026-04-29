import base64
import httpx
import os
import json
import tempfile
import asyncio
from typing import Optional
from dotenv import load_dotenv

# โหลด .env ก่อนอ่านค่า (กันกรณี import order ไม่แน่นอน)
load_dotenv()

# ─── Config ──────────────────────────────────────────────────
OLLAMA_URL = os.getenv("OLLAMA_URL", "https://unexplorative-unpalatable-lisha.ngrok-free.dev")
MODEL_NAME = os.getenv("MODEL_NAME", "apm-assistant:latest")

# ─── Google Gemini Fallback Config ───────────────────────────
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")

# ─── Ollama Health Tracking ──────────────────────────────────
# เก็บสถานะ Ollama: ถ้าล่มจะหยุดลองชั่วคราว (circuit breaker)
_ollama_last_fail_time: float = 0
_OLLAMA_COOLDOWN_SECONDS = 60  # หยุดลอง Ollama 60 วินาทีหลัง fail

def _is_ollama_available() -> bool:
    """เช็คว่า Ollama น่าจะใช้ได้ (ไม่ได้ล่มล่าสุด)"""
    import time
    if _ollama_last_fail_time == 0:
        return True
    return (time.time() - _ollama_last_fail_time) > _OLLAMA_COOLDOWN_SECONDS

def _mark_ollama_down():
    """บันทึกว่า Ollama ล่ม"""
    import time
    global _ollama_last_fail_time
    _ollama_last_fail_time = time.time()
    print(f"⚠️ Ollama marked as DOWN — จะสลับไป Google Gemini {_OLLAMA_COOLDOWN_SECONDS} วินาที")

def _mark_ollama_up():
    """บันทึกว่า Ollama กลับมาใช้ได้"""
    global _ollama_last_fail_time
    if _ollama_last_fail_time != 0:
        _ollama_last_fail_time = 0
        print("✅ Ollama กลับมา ONLINE แล้ว")

# ─── Global HTTP Client Pool (ใช้ซ้ำ connection ไม่ต้องสร้างใหม่ทุก request) ───
_http_client: httpx.AsyncClient | None = None

def _get_http_client() -> httpx.AsyncClient:
    """Lazy-init global httpx client ที่มี connection pool"""
    global _http_client
    if _http_client is None or _http_client.is_closed:
        _http_client = httpx.AsyncClient(
            follow_redirects=True,
            timeout=httpx.Timeout(
                connect=10.0,     # timeout สำหรับ connect
                read=180.0,       # timeout สำหรับอ่าน response
                write=30.0,       # timeout สำหรับเขียน request
                pool=30.0,        # timeout สำหรับรอ connection จาก pool
            ),
            limits=httpx.Limits(
                max_connections=20,         # จำนวน connection สูงสุด
                max_keepalive_connections=10,  # keepalive connections
                keepalive_expiry=60,        # หมดอายุ keepalive 60 วินาที
            ),
            headers={"ngrok-skip-browser-warning": "true"},
        )
    return _http_client

async def init_ai_service():
    """Pre-initialize the global HTTP client pool"""
    _get_http_client()

async def close_ai_service():
    """ปิด HTTP client เมื่อ shutdown server"""
    global _http_client
    if _http_client and not _http_client.is_closed:
        await _http_client.aclose()
        _http_client = None


# ─── Google Gemini Client (Lazy Init) ────────────────────────
_gemini_client = None

def _get_gemini_client():
    """Lazy-init Google Gemini client"""
    global _gemini_client
    if _gemini_client is None:
        if not GOOGLE_API_KEY:
            raise RuntimeError("GOOGLE_API_KEY ไม่ได้ตั้งค่า — ไม่สามารถใช้ Gemini fallback ได้")
        from google import genai
        _gemini_client = genai.Client(api_key=GOOGLE_API_KEY)
    return _gemini_client


# ─── Persona ─────────────────────────────────────────────────
def _build_persona(mode: str) -> str:
    core_mindset = (
        "คุณคือ APM Assistant AI ที่ปรึกษานักศึกษามหาวิทยาลัย\n"
        "หลักคิดที่ต้องใช้เมื่อเหมาะสม:\n"
        "1) Opportunity Cost: ทุกการตัดสินใจมีต้นทุน ชั่งน้ำหนักความคุ้มค่าเสมอ\n"
        "2) Sunk Cost Fallacy: อย่ายึดติดกับสิ่งที่เสียไปแล้ว โฟกัสกับปัจจุบัน/อนาคต\n"
        "3) ช่วยผู้ใช้คิดเป็นระบบ: วิเคราะห์ข้อดีข้อเสีย\n"
    )

    instructions = {
        "bro": "โทน: เพื่อนผู้ชาย คุยตรง กระชับ บังคับลงท้ายด้วย 'ครับ' เสมอ",
        "girl": "โทน: เพื่อนสาว (Sis) ตัวแม่ บังคับลงท้ายด้วย 'ค่ะ' หรือ 'คะ' เสมอ",
        "nerd": "โทน: ที่ปรึกษาสายวิเคราะห์ เป็นระบบ แทนตัวเองว่า 'ผม' บังคับลงท้ายด้วย 'ครับ' เสมอ",
    }

    persona_mode = instructions.get(mode, "คุณคือที่ปรึกษานักศึกษาที่พร้อมช่วยคิดเป็นระบบและเป็นมิตร")

    format_rules = (
        "\n\n**ข้อกำหนดสำคัญที่ต้องทำตามอย่างเคร่งครัด:**\n"
        "- ห้ามลากเสียงหรือยืดคำเด็ดขาด\n"
        "- ตรวจสอบคำลงท้ายให้ถูกต้องตามเพศของโหมด\n"
        "- น้ำเสียงต้อง มั่นใจ ตรงไปตรงมา กระชับ และจริงใจ\n"
        "- ใช้ Markdown: **ตัวหนา**, - Bullet points เพื่อให้อ่านง่าย\n"
    )

    return f"{core_mindset}\n{persona_mode}\n{format_rules}"


# ─── Shared Payload Builder (Ollama) ─────────────────────────
def _build_payload(message: str, mode: str, image_bytes: Optional[bytes] = None, stream: bool = False) -> dict:
    """สร้าง payload สำหรับ Ollama API (ลด code duplication)"""
    persona = _build_persona(mode)
    messages = [
        {"role": "system", "content": persona},
        {"role": "user", "content": message}
    ]

    if image_bytes:
        image_b64 = base64.b64encode(image_bytes).decode('utf-8')
        messages[-1]["images"] = [image_b64]

    return {
        "model": MODEL_NAME,
        "messages": messages,
        "stream": stream,
        "options": {
            "num_ctx": 1024,    # ลดลงเหลือ 1024 เพื่อความไวสูงสุดบน Render
            "num_predict": 300, # จำกัดความยาวให้กระชับ เพื่อลดเวลาคิด
            "temperature": 0.6, # ลดลงนิดหน่อยเพื่อให้คำตอบแม่นยำและไม่เวิ่นเว้อ
            "top_k": 20,
            "top_p": 0.8
        }
    }


# ═══════════════════════════════════════════════════════════════
# ░░░  GOOGLE GEMINI — Fallback Engine  ░░░
# ═══════════════════════════════════════════════════════════════

async def _call_gemini(message: str, mode: str, image_bytes: Optional[bytes] = None) -> str:
    """เรียก Google Gemini API เมื่อ Ollama ใช้ไม่ได้"""
    try:
        client = _get_gemini_client()
        persona = _build_persona(mode)
        full_prompt = f"{persona}\n\n{message}"

        # สร้าง contents สำหรับ Gemini
        contents = []

        if image_bytes:
            # Multimodal: ส่งรูปพร้อมข้อความ
            from google.genai import types
            image_part = types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg")
            contents = [image_part, full_prompt]
        else:
            contents = full_prompt

        # เรียกใน thread pool เพราะ google-genai SDK เป็น sync
        response = await asyncio.to_thread(
            client.models.generate_content,
            model=GEMINI_MODEL,
            contents=contents,
            config={
                "temperature": 0.6,
                "max_output_tokens": 500,
                "top_p": 0.8,
                "top_k": 20,
            }
        )

        return response.text.strip() if response.text else ""

    except Exception as e:
        print(f"❌ Gemini Error: {e}")
        raise Exception(f"ไม่สามารถติดต่อ Google Gemini ได้ ({str(e)})")


async def _call_gemini_stream(message: str, mode: str, image_bytes: Optional[bytes] = None):
    """Generator สำหรับ Stream ข้อความจาก Google Gemini"""
    try:
        client = _get_gemini_client()
        persona = _build_persona(mode)
        full_prompt = f"{persona}\n\n{message}"

        contents = []
        if image_bytes:
            from google.genai import types
            image_part = types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg")
            contents = [image_part, full_prompt]
        else:
            contents = full_prompt

        # ใช้ stream API ของ Gemini (sync → run in thread)
        def _stream_sync():
            return client.models.generate_content_stream(
                model=GEMINI_MODEL,
                contents=contents,
                config={
                    "temperature": 0.6,
                    "max_output_tokens": 500,
                    "top_p": 0.8,
                    "top_k": 20,
                }
            )

        stream_response = await asyncio.to_thread(_stream_sync)

        # iterate ผ่าน chunks แบบ real-time
        def _get_iterator():
            return iter(stream_response)
            
        iterator = await asyncio.to_thread(_get_iterator)
        
        while True:
            try:
                chunk = await asyncio.to_thread(next, iterator)
                if chunk.text:
                    yield chunk.text
            except StopIteration:
                break

    except Exception as e:
        print(f"❌ Gemini Stream Error: {e}")
        yield f" [Gemini Error: {str(e)}]"


# ═══════════════════════════════════════════════════════════════
# ░░░  OLLAMA — Primary Engine  ░░░
# ═══════════════════════════════════════════════════════════════

async def call_ollama_stream(message: str, mode: str, image_bytes: Optional[bytes] = None):
    """
    Generator สำหรับ Stream — ลอง Ollama ก่อน, ถ้า fail จะ fallback ไป Gemini
    """

    # ── Circuit Breaker: ถ้า Ollama เพิ่งล่ม ข้ามไปใช้ Gemini เลย ──
    if not _is_ollama_available():
        print("🔄 Ollama cooldown — ใช้ Google Gemini แทน (stream)")
        if GOOGLE_API_KEY:
            async for chunk in _call_gemini_stream(message, mode, image_bytes):
                yield chunk
            return
        else:
            yield " [Error: Ollama ยังไม่พร้อม และไม่มี Google API Key สำรอง]"
            return

    # ── ลอง Ollama ก่อน ──
    base_url = OLLAMA_URL.rstrip('/')
    url = f"{base_url}/api/chat"
    payload = _build_payload(message, mode, image_bytes, stream=True)
    ollama_failed = False

    try:
        client = _get_http_client()
        async with client.stream("POST", url, json=payload, timeout=180) as response:
            response.raise_for_status()
            _mark_ollama_up()
            async for line in response.aiter_lines():
                if not line:
                    continue
                try:
                    chunk = json.loads(line)
                    if "message" in chunk:
                        yield chunk["message"]["content"]
                    if chunk.get("done"):
                        break
                except (json.JSONDecodeError, KeyError):
                    continue
            return  # สำเร็จ — ไม่ต้อง fallback

    except (httpx.ConnectError, httpx.TimeoutException, httpx.HTTPStatusError, ConnectionError, OSError) as e:
        print(f"⚠️ Ollama Stream failed: {e}")
        _mark_ollama_down()
        ollama_failed = True
    except Exception as e:
        print(f"⚠️ Ollama Stream unexpected error: {e}")
        _mark_ollama_down()
        ollama_failed = True

    # ── Fallback: Google Gemini ──
    if ollama_failed and GOOGLE_API_KEY:
        print("🔄 Fallback → Google Gemini (stream)")
        async for chunk in _call_gemini_stream(message, mode, image_bytes):
            yield chunk
    elif ollama_failed:
        yield " [Error: ไม่สามารถติดต่อ Ollama ได้ และไม่มี Google API Key สำรอง]"


async def _call_ollama(message: str, mode: str, image_bytes: Optional[bytes] = None) -> str:
    """
    Non-streaming: ลอง Ollama ก่อน → fallback ไป Gemini ถ้า fail
    """

    # ── Circuit Breaker ──
    if not _is_ollama_available():
        print("🔄 Ollama cooldown — ใช้ Google Gemini แทน")
        if GOOGLE_API_KEY:
            return await _call_gemini(message, mode, image_bytes)
        else:
            raise Exception("Ollama ยังไม่พร้อม และไม่มี Google API Key สำรอง")

    # ── ลอง Ollama ก่อน ──
    base_url = OLLAMA_URL.rstrip('/')
    url = f"{base_url}/api/chat"
    payload = _build_payload(message, mode, image_bytes, stream=False)

    try:
        client = _get_http_client()
        response = await client.post(url, json=payload, timeout=180)
        response.raise_for_status()
        result = response.json()
        _mark_ollama_up()
        return result.get("message", {}).get("content", "").strip()

    except (httpx.ConnectError, httpx.TimeoutException, httpx.HTTPStatusError, ConnectionError, OSError) as e:
        print(f"⚠️ Ollama failed: {e}")
        _mark_ollama_down()

        # ── Fallback: Google Gemini ──
        if GOOGLE_API_KEY:
            print("🔄 Fallback → Google Gemini")
            return await _call_gemini(message, mode, image_bytes)
        else:
            raise Exception(f"ไม่สามารถติดต่อ Ollama ได้ ({str(e)}) และไม่มี Google API Key สำรอง")

    except Exception as e:
        print(f"❌ Ollama unexpected error: {e}")
        _mark_ollama_down()

        if GOOGLE_API_KEY:
            print("🔄 Fallback → Google Gemini")
            return await _call_gemini(message, mode, image_bytes)
        else:
            raise Exception(f"ไม่สามารถติดต่อ Ollama ได้ ({str(e)})")


# ═══════════════════════════════════════════════════════════════
# ░░░  Public Functions  ░░░
# ═══════════════════════════════════════════════════════════════

async def get_ai_response(prompt: str, mode: str):
    try:
        reply = await _call_ollama(message=prompt, mode=mode)
        return {"reply": reply}
    except Exception as e:
        return {"reply": f"เกิดข้อผิดพลาด: {str(e)}"}

async def get_ai_response_with_image(prompt: str, mode: str, image_data: Optional[bytes]):
    try:
        reply = await _call_ollama(message=prompt, mode=mode, image_bytes=image_data)
        return {"reply": reply}
    except Exception as e:
        return {"reply": f"เกิดข้อผิดพลาด (รูปภาพ): {str(e)}"}

async def get_ai_response_with_pdf(prompt: str, mode: str, pdf_data: Optional[bytes]):
    def extract_pdf_text(data):
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp.write(data)
            path = tmp.name
        try:
            import fitz
            doc = fitz.open(path)
            text_parts = []
            current_len = 0
            for page in doc:
                page_text = page.get_text()
                text_parts.append(page_text)
                current_len += len(page_text)
                if current_len >= 8000:
                    break
            text = "".join(text_parts)
            doc.close()
            return text
        finally:
            if os.path.exists(path):
                os.remove(path)

    try:
        raw_text = await asyncio.to_thread(extract_pdf_text, pdf_data)
        pdf_text = raw_text[:8000]

        final_prompt = f"{prompt}\n\n[เนื้อหาจาก PDF]\n{pdf_text}"
        reply = await _call_ollama(message=final_prompt, mode=mode)
        return {"reply": reply}
    except Exception as e:
        return {"reply": f"เกิดข้อผิดพลาด (PDF): {str(e)}"}

async def get_ai_response_with_file(
    prompt: str,
    mode: str,
    image_data: Optional[bytes] = None,
    pdf_data: Optional[bytes] = None,
):
    if image_data:
        return await get_ai_response_with_image(prompt, mode, image_data)
    elif pdf_data:
        return await get_ai_response_with_pdf(prompt, mode, pdf_data)
    else:
        return await get_ai_response(prompt, mode)