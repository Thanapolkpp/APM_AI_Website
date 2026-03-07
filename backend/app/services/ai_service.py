import base64
import requests
import os
import json

# ตั้งค่า URL และชื่อโมเดลที่คุณรันสำเร็จ (100% GPU)
OLLAMA_URL = os.getenv("OLLAMA_API_URL", "http://localhost:11434/api/chat")
# เปลี่ยนชื่อโมเดลเป็นตัวที่คุณเพิ่งสร้าง (genz-ai)
MODEL_NAME = "apm-genz"

def _build_persona(mode: str) -> str:
    # Core Mindset สำหรับ Gen Z ตามที่คุณออกแบบ
    core_mindset = (
        "คุณคือ AI ที่ปรึกษาสำหรับ 'นักศึกษามหาวิทยาลัย' (Gen Z) เข้าใจไลฟ์สไตล์ ความกดดันเรื่องเรียน ความสัมพันธ์ และอนาคต\n"
        "ในการให้คำปรึกษา คุณต้องยึดหลักการ 2 ข้อนี้เสมอ:\n"
        "1) แนวคิดเรื่อง 'ค่าเสียโอกาส' (Opportunity Cost): ทุกการตัดสินใจมีต้นทุน แนะนำให้พวกเขาชั่งน้ำหนักว่าเลือกสิ่งหนึ่ง จะสูญเสียอะไร และสิ่งไหนคุ้มค่าที่สุดในระยะยาว\n"
        "2) 'การปล่อยวาง': สอนให้รู้จักโฟกัสสิ่งที่ควบคุมได้ และปล่อยวางสิ่งที่ควบคุมไม่ได้ ไม่ยึดติดกับสิ่งที่เสียไปแล้ว (Sunk Cost)\n"
    )

    instructions = {
        "bro": "คุณคือเพื่อนชายสายลุย (Bro Mode) คุยแบบเพื่อนสนิท ใช้คำว่า 'เพื่อน/ไอ้ชาย/ว่าไง' ได้ แต่ห้ามลากเสียงหรือยืดคำ ให้คำแนะนำแบบตรงไปตรงมา จริงใจ ดึงสติเก่ง 🧢",
        "girl": "คุณคือเพื่อนสาวสุดคิวท์ (Bestie Mode) เป็นกันเอง น่ารัก สดใส ให้กำลังใจเก่ง แต่มีเหตุผล แฝงข้อคิดข้อเตือนใจแบบเพื่อนห่วงเพื่อน รักษาน้ำใจ แต่ห้ามลากเสียงหรือยืดคำ ✨",
        "nerd": "คุณคือที่ปรึกษาสายวิชาการ (Nerd Mode) วิเคราะห์ทุกอย่างด้วยตรรกะ ข้อมูลแม่นยำ ใช้ทฤษฎีจิตวิทยาและเศรษฐศาสตร์มาอธิบายเรื่องราวต่างๆ อย่างเข้าใจง่าย 🧪",
    }

    persona_mode = instructions.get(
        mode,
        "คุณคือเพื่อนสนิทในวัยมหาวิทยาลัยที่พร้อมช่วยเหลือทุกเรื่อง ไม่ว่าจะเป็นเรื่องการศึกษา หรือเรื่องส่วนตัว"
    )

    format_rules = (
        "\n\n**ข้อกำหนดสำคัญ (ทำตามเคร่งครัด):**\n"
        "- ห้ามลากเสียงหรือยืดคำ เช่น แกรรรรร / น้าาาา / ก้ณณณณ\n"
        "- ให้คำตอบอิงจากตรรกะ เหตุผล แต่สื่อสารด้วยความเห็นอกเห็นใจ (Empathy)\n"
        "- ตอบให้ตรงคำถาม กระชับ ได้ใจความหลัก\n"
        "- ใช้ Markdown: **ตัวหนา**, - Bullet points ในการจัดหน้า\n"
    )

    return f"{core_mindset}\n{persona_mode}\n{format_rules}"

def get_ai_response(prompt: str, mode: str):
    persona = _build_persona(mode)
    final_prompt = f"{persona}\n\nคำถาม: {prompt}"

    payload = {
        "model": MODEL_NAME,
        "messages": [{"role": "user", "content": final_prompt}],
        "stream": False,  # ปรับเป็น False เพื่อให้ใช้ res.json() ได้โดยไม่พัง
        "options": {
            "temperature": 0.4,
            "top_p": 0.9,
            "repeat_penalty": 1.1, # ปรับลดลงเล็กน้อยเพื่อให้ภาษาเป็นธรรมชาติขึ้น
            "num_predict": 1500,
            "stop": ["</END>"]
        },
    }

    res = requests.post(OLLAMA_URL, json=payload, timeout=90)
    res.raise_for_status()
    
    # อ่านข้อมูลแบบปกติ
    data = res.json()
    reply = data.get("message", {}).get("content", "").strip()
    return {"reply": reply}

async def get_ai_response_with_image(prompt: str, mode: str, image_data: bytes | None):
    persona = _build_persona(mode)
    final_prompt = f"{persona}\n\nคำถาม: {prompt}"

    images_b64 = []
    if image_data:
        images_b64 = [base64.b64encode(image_data).decode("utf-8")]

    payload = {
        "model": MODEL_NAME,
        "messages": [
            {
                "role": "user",
                "content": final_prompt,
                "images": images_b64
            }
        ],
        "stream": False, # ปรับเป็น False เพื่อความเสถียร
        "options": {
            "temperature": 0.3,
            "repeat_penalty": 1.1,
            "num_predict": 1500,
            "stop": ["</END>"]
        },
    }

    res = requests.post(OLLAMA_URL, json=payload, timeout=120)
    res.raise_for_status()
    
    data = res.json()
    reply = data.get("message", {}).get("content", "").strip()
    return {"reply": reply}