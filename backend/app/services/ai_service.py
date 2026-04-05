import base64
import requests
import os
import tempfile
from gradio_client import Client, handle_file
from typing import Optional

# ─── Config ──────────────────────────────────────────────────
GRADIO_URL = os.getenv("GRADIO_URL", "https://35fe2c4c7c4e08ee56.gradio.live")
MODEL_NAME = "apm-genz"

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


# ─── Gradio Client ───────────────────────────────────────────
gradio_client_instance = None

def get_gradio_client():
    global gradio_client_instance
    if gradio_client_instance is None:
        try:
            gradio_client_instance = Client(GRADIO_URL)
            print(f"✅ Connected to Gradio: {GRADIO_URL}")
        except Exception as e:
            print(f"❌ Error connecting to Gradio: {e}")
            gradio_client_instance = None
    return gradio_client_instance

def reset_gradio_client(new_url: str = None):
    """เรียกใช้เมื่อ Gradio URL เปลี่ยน"""
    global gradio_client_instance, GRADIO_URL
    if new_url:
        GRADIO_URL = new_url
        os.environ["GRADIO_URL"] = new_url
    gradio_client_instance = None
    print(f"🔄 Reset client — URL ใหม่: {GRADIO_URL}")


# ─── ฟังก์ชันกลาง — ยิง Gradio ──────────────────────────────
def _call_gradio(message: str, mode: str, file_path: Optional[str] = None) -> str:
    """
    ยิง Gradio API
    - api_name : /chat
    - params   : message, file, mode (ใช้ positional เพื่อความชัวร์)
    """
    client = get_gradio_client()
    if client is None:
        raise Exception("ไม่สามารถเชื่อมต่อกับ Gradio ได้")

    # ประกอบ Persona เข้าไปใน prompt
    persona_prompt = _build_persona(mode)
    full_prompt = f"{persona_prompt}\n\n[ข้อความจากผู้ใช้/บริบท]:\n{message}"

    # ✅ ใช้ positional arguments แทน keyword เพื่อกัน error ชื่อ parameter ไม่ตรง
    result = client.predict(
        full_prompt,                                  # message
        handle_file(file_path) if file_path else None,  # file
        mode,                                         # mode
        api_name="/chat"
    )
    return str(result).strip()


# ─── ข้อความธรรมดา ───────────────────────────────────────────
async def get_ai_response(prompt: str, mode: str):
    try:
        reply = _call_gradio(message=prompt, mode=mode)
        return {"reply": reply}
    except Exception as e:
        print(f"❌ get_ai_response Error: {e}")
        return {"reply": f"เกิดข้อผิดพลาด: {str(e)}"}


# ─── รูปภาพ ──────────────────────────────────────────────────
async def get_ai_response_with_image(prompt: str, mode: str, image_data: Optional[bytes]):
    tmp_path = None
    try:
        if image_data:
            with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
                tmp.write(image_data)
                tmp_path = tmp.name

        reply = _call_gradio(message=prompt, mode=mode, file_path=tmp_path)
        return {"reply": reply}

    except Exception as e:
        print(f"❌ Image Error: {e}")
        return {"reply": f"เกิดข้อผิดพลาด (รูปภาพ): {str(e)}"}
    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)


# ─── PDF ─────────────────────────────────────────────────────
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

        final_prompt = f"{prompt}\n\n[เนื้อหาจาก PDF]\n{pdf_text}"
        reply = _call_gradio(message=final_prompt, mode=mode)
        return {"reply": reply}

    except ImportError:
        return {"reply": "กรุณาติดตั้ง pymupdf ก่อน: pip install pymupdf"}
    except Exception as e:
        print(f"❌ PDF Error: {e}")
        return {"reply": f"เกิดข้อผิดพลาด (PDF): {str(e)}"}
    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)


# ─── ฟังก์ชันหลัก — รับทุกอย่าง ─────────────────────────────
async def get_ai_response_with_file(
    prompt: str,
    mode: str,
    image_data: Optional[bytes] = None,
    pdf_data: Optional[bytes] = None,
):
    """
    ฟังก์ชันหลักสำหรับเรียกใช้จาก Backend
    - image_data : bytes ของรูปภาพ (jpg, png, webp)
    - pdf_data   : bytes ของไฟล์ PDF
    - ถ้าไม่มีไฟล์ : ตอบจากข้อความอย่างเดียว
    """
    if image_data:
        return await get_ai_response_with_image(prompt, mode, image_data)
    elif pdf_data:
        return await get_ai_response_with_pdf(prompt, mode, pdf_data)
    else:
        return get_ai_response(prompt, mode)