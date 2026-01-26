import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")

if API_KEY:
    genai.configure(api_key=API_KEY)
    
    model = genai.GenerativeModel("gemini-2.5-flash") 
else:
    model = None

def get_ai_response(prompt: str):
    if not model:
        return "System API key is not configured yet."
    
    # ใส่บุคลิก Gen Z เข้าไปตรงนี้ได้เลย
    system_instruction = "ตอบคำถามแบบเพื่อนสนิท Gen Z ที่คอยช่วยเหลือเรื่องเรียน"
    response = model.generate_content(f"{system_instruction} คำถาม: {prompt}")
    return response.text