# backend/check_models.py
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    print("❌ ไม่เจอ API Key ในไฟล์ .env")
else:
    print(f"✅ เจอ API Key แล้ว: {api_key[:5]}...")
    genai.configure(api_key=api_key)

    print("\n🔍 กำลังค้นหารุ่น AI ที่ใช้ได้...")
    try:
        count = 0
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f"- {m.name}")
                count += 1
        
        if count == 0:
            print("⚠️ ไม่พบโมเดลที่ใช้ Chat ได้เลย (อาจต้องสร้าง API Key ใหม่)")
    except Exception as e:
        print(f"❌ เกิดข้อผิดพลาด: {e}")