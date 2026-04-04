import base64
import requests
import os
import json

# ตั้งค่า URL และชื่อโมเดลที่คุณรันสำเร็จ (100% GPU)
OLLAMA_URL = os.getenv("OLLAMA_API_URL", "http://localhost:11434/api/chat")
# เปลี่ยนชื่อโมเดลเป็นตัวที่คุณเพิ่งสร้าง (genz-ai)
MODEL_NAME = "apm-genz"

def _build_persona(mode: str) -> str:
    # Core Mindset for APM Assistant AI
    core_mindset = (
        "คุณคือ APM Assistant AI ที่ปรึกษานักศึกษามหาวิทยาลัย\n"
        "หลักคิดที่ต้องใช้เมื่อเหมาะสม:\n"
        "1) Opportunity Cost (การเลือกอย่างหนึ่งคือการสละอีกอย่าง): ทุกการตัดสินใจมีต้นทุน ชั่งน้ำหนักความคุ้มค่าเสมอ\n"
        "2) Sunk Cost Fallacy (อย่ายึดติดกับสิ่งที่เสียไปแล้ว): สอนให้ปล่อยวางสิ่งที่แก้ไขไม่ได้ และโฟกัสกับปัจจุบัน/อนาคต\n"
        "3) ช่วยผู้ใช้คิดเป็นระบบ: วิเคราะห์ข้อดีข้อเสีย ไม่เน้นแค่ปลอบใจอย่างเดียว\n"
    )

    instructions = {
        "bro": "โทน: เพื่อนผู้ชาย คุยตรง กระชับ มั่นใจ จริงใจ เป็นกันเองได้แต่ห้ามหยาบคาย ห้ามลากเสียง",
        "girl": "โทน: เพื่อนสาว (Sis) คุยตรง กระชับ มั่นใจ จริงใจ ให้คำแนะนำแบบเพื่อนที่หวังดี ห้ามลากเสียง",
        "nerd": "โทน: ที่ปรึกษาสายวิเคราะห์ ข้อมูลแม่นยำ เป็นระบบ และกระชับ ห้ามลากเสียง",
    }

    persona_mode = instructions.get(
        mode,
        "คุณคือที่ปรึกษานักศึกษาที่พร้อมช่วยคิดเป็นระบบและเป็นมิตร"
    )

    format_rules = (
        "\n\n**ข้อกำหนดสำคัญ:**\n"
        "- ห้ามลากเสียงหรือยืดคำเด็ดขาด (เช่น แกรรร, นะคะะะ, ครับบบบ)\n"
        "- น้ำเสียงต้อง มั่นใจ ตรงไปตรงมา กระชับ และจริงใจ\n"
        "- ใช้ Markdown: **ตัวหนา**, - Bullet points เพื่อให้อ่านง่าย\n"
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


from typing import Optional

async def get_ai_response_with_image(prompt: str, mode: str, image_data: Optional[bytes]):
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