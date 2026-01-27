from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import auth, chatbot # ดึงทั้ง Auth ของคุณ และ Chatbot ของเพื่อนมา
from app.utils.db import engine, Base
from app.api.v1 import ai

# สร้าง Table ใน MySQL อัตโนมัติ
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Gen Z AI Study Planner API",
    description="Backend สำหรับระบบจัดตารางเรียนและ Chatbot AI",
    version="1.1.0"
)

# ตั้งค่า CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# รวม Router ทั้งหมด (Modular Design)

# 1. ระบบจัดการสมาชิก (Login/Register)
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
# 2. ระบบแชทข้อความปกติ (จากไฟล์ chatbot.py)
app.include_router(chatbot.router, prefix="/api/v1/chat", tags=["Standard Chat"])
# 3. ระบบ AI วิเคราะห์รูปภาพ (จากไฟล์ ai.py ที่รองรับ Gemini 2.0)
app.include_router(ai.router, prefix="/api/v1/vision", tags=["AI Vision Analysis"])
@app.get("/")
def root():
    return {"message": "Server is running! Auth & AI Chatbot are ready."}