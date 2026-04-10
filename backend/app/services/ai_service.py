import base64
import httpx
import os
import tempfile
from typing import Optional

# ─── Config ──────────────────────────────────────────────────
OLLAMA_URL = os.getenv("OLLAMA_URL", "https://unexplorative-unpalatable-lisha.ngrok-free.dev")
MODEL_NAME = os.getenv("MODEL_NAME", "qwen2.5:7b")

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


# ─── Ollama API Caller (Streaming) ───────────────────────────
async def call_ollama_stream(message: str, mode: str, image_bytes: Optional[bytes] = None):
    """
    Generator สำหรับ Stream ข้อความจาก Ollama
    """
    base_url = OLLAMA_URL.rstrip('/')
    url = f"{base_url}/api/chat"
    persona = _build_persona(mode)
    
    messages = [
        {"role": "system", "content": persona},
        {"role": "user", "content": message}
    ]

    if image_bytes:
        image_b64 = base64.b64encode(image_bytes).decode('utf-8')
        messages[-1]["images"] = [image_b64]

    payload = {
        "model": MODEL_NAME,
        "messages": messages,
        "stream": True,
        "options": {
            "num_ctx": 1024,    # ลดลงเหลือ 1024 เพื่อความไวสูงสุดบน Render
            "num_predict": 300, # จำกัดความยาวให้กระชับ เพื่อลดเวลาคิด
            "temperature": 0.6, # ลดลงนิดหน่อยเพื่อให้คำตอบแม่นยำและไม่เวิ่นเว้อ
            "top_k": 20,
            "top_p": 0.8
        }
    }

    try:
        async with httpx.AsyncClient(follow_redirects=True) as client:
            headers = {"ngrok-skip-browser-warning": "true"}
            async with client.stream("POST", url, json=payload, headers=headers, timeout=180) as response:
                response.raise_for_status()
                async for line in response.aiter_lines():
                    if not line:
                        continue
                    import json
                    try:
                        chunk = json.loads(line)
                        if "message" in chunk:
                            yield chunk["message"]["content"]
                        if chunk.get("done"):
                            break
                    except:
                        continue
    except Exception as e:
        print(f"❌ Ollama Stream Error: {e}")
        yield f" [Error: {str(e)}]"


# ─── Ollama API Caller (Non-Streaming) ───────────────────────
async def _call_ollama(message: str, mode: str, image_bytes: Optional[bytes] = None) -> str:
    base_url = OLLAMA_URL.rstrip('/')
    url = f"{base_url}/api/chat"
    persona = _build_persona(mode)
    
    messages = [
        {"role": "system", "content": persona},
        {"role": "user", "content": message}
    ]

    if image_bytes:
        image_b64 = base64.b64encode(image_bytes).decode('utf-8')
        messages[-1]["images"] = [image_b64]

    payload = {
        "model": MODEL_NAME,
        "messages": messages,
        "stream": False,
        "options": {
            "num_ctx": 1024,
            "num_predict": 300,
            "temperature": 0.6,
            "top_k": 20,
            "top_p": 0.8
        } 
    }

    try:
        async with httpx.AsyncClient(follow_redirects=True) as client:
            headers = {"ngrok-skip-browser-warning": "true"}
            response = await client.post(url, json=payload, headers=headers, timeout=180)
            response.raise_for_status()
            result = response.json()
            return result.get("message", {}).get("content", "").strip()
    except Exception as e:
        print(f"❌ Ollama Error: {e}")
        raise Exception(f"ไม่สามารถติดต่อ Ollama ได้ ({str(e)})")


# ─── Public Functions ─────────────────────────────────────────

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
    tmp_path = None
    try:
        import fitz  # pymupdf
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp.write(pdf_data)
            tmp_path = tmp.name

        doc = fitz.open(tmp_path)
        pdf_text = "".join([page.get_text() for page in doc])
        pdf_text = pdf_text[:8000]
        doc.close()

        final_prompt = f"{prompt}\n\n[เนื้อหาจาก PDF]\n{pdf_text}"
        reply = await _call_ollama(message=final_prompt, mode=mode)
        return {"reply": reply}
    except Exception as e:
        return {"reply": f"เกิดข้อผิดพลาด (PDF): {str(e)}"}
    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)

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