import base64
import requests

OLLAMA_URL = "http://localhost:11434/api/chat"
MODEL_NAME = "gemma3:latest"


def _build_persona(mode: str) -> str:
    instructions = {
        "bro": "คุณคือเพื่อนชายสายลุย (Bro Mode) คุยแบบเพื่อนสนิท ใช้คำว่า 'เพื่อน/ว่ะ/ดิ' ได้ แต่ห้ามลากเสียงหรือยืดคำ 🧢",
        "girl": "คุณคือเพื่อนสาวสุดคิวท์ (Bestie Mode) เป็นกันเอง น่ารัก สดใส แต่ห้ามลากเสียงหรือยืดคำ ✨",
        "nerd": "คุณคือที่ปรึกษาผู้รอบรู้ (Nerd Mode) ภาษาสุภาพ ข้อมูลแม่นยำ 🧪",
    }

    persona = instructions.get(
        mode,
        "คุณคือเพื่อนสนิทที่พร้อมช่วยเหลือทุกเรื่อง ไม่ว่าจะเป็นเรื่องการศึกษา หรือเรื่องส่วนตัว",
    )

    format_rules = (
        "\n\n**ข้อกำหนดสำคัญ (ทำตามเคร่งครัด):**\n"
        "1) ห้ามลากเสียง/ยืดคำ เช่น แกรรรรร / น้าาาา / ก้ณณณณ\n"
        "2) ตอบให้ตรงคำถามเท่านั้น ห้ามหลุดไปเรื่องอื่น\n"
        "3) ใช้ Markdown: **ตัวหนา**, - Bullet points, | Table |\n"
    )

    return f"{persona}{format_rules}"


def get_ai_response(prompt: str, mode: str):
    persona = _build_persona(mode)
    final_prompt = f"{persona}\n\nคำถาม: {prompt}"

    payload = {
        "model": MODEL_NAME,
        "messages": [
            {
                "role": "user",
                "content": final_prompt
            }
        ],
        "stream": False,
        "options": {
            "temperature": 0.4,
            "top_p": 0.9,
            "repeat_penalty": 1.25,
            "num_predict": 1500,
            "stop": ["</END>"]

        },
    }

    res = requests.post(OLLAMA_URL, json=payload, timeout=60)
    res.raise_for_status()
    data = res.json()

    # ✅ ollama /api/chat จะคืน message.content
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
                "images": images_b64  # ✅ ตรงนี้คือ Vision
            }
        ],
        "stream": False,
        "options": {
            "temperature": 0.4,
            "top_p": 0.9,
            "repeat_penalty": 1.25,
            "num_predict": 1500,
       "stop": ["</END>"]

        },
    }

    res = requests.post(OLLAMA_URL, json=payload, timeout=60)
    res.raise_for_status()
    data = res.json()

    reply = data.get("message", {}).get("content", "").strip()
    return {"reply": reply}

