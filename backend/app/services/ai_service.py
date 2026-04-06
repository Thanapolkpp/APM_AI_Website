import base64
import httpx
import os
import tempfile
from typing import Optional

# ─── Config ──────────────────────────────────────────────────
# ใช้ OLLAMA_URL จาก env ถ้ามี หรือใช้ localhost:11434 เป็นค่าเริ่มต้น
OLLAMA_URL = os.getenv("OLLAMA_URL", "https://unexplorative-unpalatable-lisha.ngrok-free.dev")
MODEL_NAME = os.getenv("MODEL_NAME", "gemma3:12b") # ตามที่ระบุใน README.md

# ─── Persona ─────────────────────────────────────────────────
def _build_persona(mode: str) -> str:
    core_mindset = (
        "คุณคือ APM Assistant AI ที่ปรึกษานักศึกษามหาวิทยาลัย\n"
        "หลักคิดที่ต้องใช้เมื่อเหมาะสม:\n"
        "1) Opportunity Cost (การเลือกอย่างหนึ่งคือการสละอีกอย่าง): ทุกการตัดสินใจมีต้นทุน ชั่งน้ำหนักความคุ้มค่าเสมอ\n"
        "2) Sunk Cost Fallacy (อย่ายึดติดกับสิ่งที่เสียไปแล้ว): สอนให้ปล่อยวางสิ่งที่แก้ไขไม่ได้ และโฟกัสกับปัจจุบัน/อนาคต\n"
        "3) ช่วยผู้ใช้คิดเป็นระบบ: วิเคราะห์ข้อดีข้อเสีย ไม่เน้นแค่ปลอบใจอย่างเดียว\n"
    )

    instructions = {
        "bro": "โทน: เพื่อนผู้ชาย คุยตรง กระชับ มั่นใจ แทนตัวเองว่า 'เรา' หรือ 'ผม' บังคับลงท้ายด้วย 'ครับ' เสมอ (ห้ามใช้ 'ค่ะ' หรือ 'คะ')",
        "girl": "โทน: เพื่อนสาว (Sis) ตัวแม่ คุยตรง กระชับ ให้คำแนะนำแบบหวังดี แทนตัวเองว่า 'เรา' หรือ 'ฉัน' **บังคับลงท้ายด้วย 'ค่ะ' หรือ 'คะ' เสมอ (ห้ามใช้ 'ครับ' เด็ดขาด)**",
        "nerd": "โทน: ที่ปรึกษาสายวิเคราะห์ ข้อมูลแม่นยำ เป็นระบบ แทนตัวเองว่า 'ผม' **บังคับลงท้ายด้วย 'ครับ' เสมอ**",
    }

    persona_mode = instructions.get(
        mode,
        "คุณคือที่ปรึกษานักศึกษาที่พร้อมช่วยคิดเป็นระบบและเป็นมิตร"
    )

    format_rules = (
        "\n\n**ข้อกำหนดสำคัญที่ต้องทำตามอย่างเคร่งครัด:**\n"
        "- ห้ามลากเสียงหรือยืดคำเด็ดขาด (เช่น แกรรร, นะคะะะ, ครับบบบ)\n"
        "- ตรวจสอบคำลงท้ายให้ถูกต้องตามเพศของโหมด ห้ามหลุดคำลงท้ายของเพศอื่นเด็ดขาด\n"
        "- น้ำเสียงต้อง มั่นใจ ตรงไปตรงมา กระชับ และจริงใจ\n"
        "- ใช้ Markdown: **ตัวหนา**, - Bullet points เพื่อให้อ่านง่าย\n"
    )

    return f"{core_mindset}\n{persona_mode}\n{format_rules}"


# ─── Ollama API Caller ───────────────────────────────────────
async def _call_ollama(message: str, mode: str, image_bytes: Optional[bytes] = None) -> str:
    """
    เรียกใช้ Ollama Chat API ผ่าน httpx (Async)
    """
    # ป้องกันเรื่อง / เกิน (Double Slash)
    base_url = OLLAMA_URL.rstrip('/')
    url = f"{base_url}/api/chat"
    persona = _build_persona(mode)
    
    # เตรียม Messages
    messages = [
        {"role": "system", "content": persona},
        {"role": "user", "content": message}
    ]

    # ถ้ามีรูปภาพ ให้แนบไปใน message ล่าสุด (Base64)
    if image_bytes:
        image_b64 = base64.b64encode(image_bytes).decode('utf-8')
        messages[-1]["images"] = [image_b64]

    payload = {
        "model": MODEL_NAME,
        "messages": messages,
        "stream": False # รับทีเดียวจบ ไม่ต้อง Stream
    }

    try:
        async with httpx.AsyncClient(follow_redirects=True) as client:
            # เพิ่ม header เพื่อข้ามหน้า Ngrok Warning
            headers = {"ngrok-skip-browser-warning": "true"}
            response = await client.post(url, json=payload, headers=headers, timeout=180) # ขยายเป็น 180 วินาที
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
        print(f"❌ get_ai_response Error: {e}")
        return {"reply": f"เกิดข้อผิดพลาด: {str(e)}"}

async def get_ai_response_with_image(prompt: str, mode: str, image_data: Optional[bytes]):
    try:
        reply = await _call_ollama(message=prompt, mode=mode, image_bytes=image_data)
        return {"reply": reply}
    except Exception as e:
        print(f"❌ Image Error: {e}")
        return {"reply": f"เกิดข้อผิดพลาด (รูปภาพ): {str(e)}"}

async def get_ai_response_with_pdf(prompt: str, mode: str, pdf_data: Optional[bytes]):
    tmp_path = None
    try:
        import fitz  # pymupdf

        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp.write(pdf_data)
            tmp_path = tmp.name

        # แปลง PDF → ข้อความ
        doc = fitz.open(tmp_path)
        pdf_text = ""
        for page in doc:
            pdf_text += page.get_text()
        pdf_text = pdf_text[:4000]
        doc.close()

        final_prompt = f"{prompt}\n\n[เนื้อหาจาก PDF]\n{pdf_text}"
        reply = await _call_ollama(message=final_prompt, mode=mode)
        return {"reply": reply}

    except ImportError:
        return {"reply": "กรุณาติดตั้ง pymupdf ก่อน: pip install pymupdf"}
    except Exception as e:
        print(f"❌ PDF Error: {e}")
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
    """
    ฟังก์ชันหลักสำหรับเรียกใช้จาก Backend
    """
    if image_data:
        return await get_ai_response_with_image(prompt, mode, image_data)
    elif pdf_data:
        return await get_ai_response_with_pdf(prompt, mode, pdf_data)
    else:
        return await get_ai_response(prompt, mode)