import os
import google.generativeai as genai  # กลับมาใช้ตัวเดิมเพื่อความเสถียรกับโค้ดที่คุณเขียน
from dotenv import load_dotenv

load_dotenv()

# เช็คชื่อในไฟล์ .env ของคุณด้วยนะว่าใช้ GOOGLE_API_KEY หรือ GEMINI_API_KEY
API_KEY = os.getenv("GEMINI_API_KEY") 

model = None

if API_KEY:
    try:
        genai.configure(api_key=API_KEY)
        # ใช้ชื่อโมเดลที่คุณเช็คมาแล้วว่ามีในโควตา
        model = genai.GenerativeModel("gemini-3-flash-preview")
        print("✅ AI Model Ready!")
    except Exception as e:
        print(f"❌ Configuration Error: {e}")
else:
    print("❌ API_KEY not found in .env")

def get_ai_response(prompt: str, mode: str):
    global model 
    
    if not model:
        return "System API key is not configured yet. แกเช็คไฟล์ .env หรือยัง?"

    instructions = {
        "bro": "คุณคือเพื่อนชายสายลุย (Bro Mode) คุยแบบ 'เพื่อน/ดิว่ะ/ฟีลแบบ/มีอะไรให้ช่วยป่ะวะ' 🧢",
        "girl": "คุณคือเพื่อนสาวสุดคิวท์ (Bestie Mode) คุยแบบ 'ต้าว/แกรรร/นะเอย' ✨",
        "nerd": "คุณคือที่ปรึกษาผู้รอบรู้ (Nerd Mode) ภาษาสุภาพ ข้อมูลแม่นยำ 🧪"
    }

    persona = instructions.get(mode, "คุณคือเพื่อนสนิทที่พร้อมช่วยเหลือทุกเรื่อง")
    format_rules = (
        "\n\n**ข้อกำหนด:** ใช้ Markdown (**ตัวหนา**, - Bullet points, | Table |) "
        "และปิดท้ายด้วย Emoji ที่เข้ากับโหมดเสมอ"
    )

    full_instruction = f"{persona}{format_rules}"
    
    try:
        response = model.generate_content(f"{full_instruction}\n\nคำถาม: {prompt}")
        
        if not response or not response.text:
            return "ขอโทษทีแก สมองขิตชั่วคราว ลองถามใหม่อีกทีนะ"
            
        return response.text
        
    except Exception as e:
        print(f"--- AI Error: {str(e)} ---")
        return f"เกิดข้อผิดพลาด: {str(e)}"