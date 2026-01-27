import google.generativeai as genai
from PIL import Image
import io
import os

# ดึง API Key จาก .env
genai.configure(api_key=os.getenv("GENAI_API_KEY"))

# เลือกใช้ Model Gemini 2.0 Flash (รองรับรูปภาพ)
model = genai.GenerativeModel('gemini-2.0-flash-exp')

async def get_ai_response_with_image(prompt: str, image_bytes: bytes = None):
    try:
        if image_bytes:
            # แปลง bytes เป็นรูปภาพที่ AI อ่านได้
            img = Image.open(io.BytesIO(image_bytes))
            # ส่งทั้งข้อความและรูปภาพไปพร้อมกัน
            response = await model.generate_content_async([prompt, img])
        else:
            # ถ้าไม่มีรูป ส่งแค่ข้อความปกติ
            response = await model.generate_content_async(prompt)
            
        return response.text
    except Exception as e:
        return f"เกิดข้อผิดพลาดในการประมวลผล AI: {str(e)}"
# เพิ่มต่อท้ายใน ai_service.py
async def get_ai_response(message: str):
    try:
        response = await model.generate_content_async(message)
        return response.text
    except Exception as e:
        return f"Error: {str(e)}"