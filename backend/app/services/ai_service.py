import requests

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "gemma3:latest"


def get_ai_response(prompt: str, mode: str):
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
        "2) ห้ามพิมพ์คำซ้ำแบบผิดธรรมชาติ เช่น นนะ / นะะะ / ค่าาา\n"
        "3) ตอบให้ตรงคำถามเท่านั้น ห้ามหลุดไปเรื่องอื่น\n"
        "4) ใช้ Markdown: **ตัวหนา**, - Bullet points, | Table |\n"
        "5) ตอบกระชับ อ่านง่าย\n"
        "6) ปิดท้ายด้วย Emoji ให้เข้ากับโหมดเสมอ\n"
    )

    final_prompt = f"{persona}{format_rules}\n\nคำถาม: {prompt}"

    payload = {
        "model": MODEL_NAME,
        "prompt": final_prompt,
        "stream": False,
        "options": {
            "temperature": 0.4,
            "top_p": 0.9,
            "repeat_penalty": 1.25,
            "num_predict": 200,
        },
    }

    res = requests.post(OLLAMA_URL, json=payload, timeout=60)
    res.raise_for_status()
    data = res.json()

    return {
        "mode": mode,
        "response": data.get("response", "").strip(),
    }
