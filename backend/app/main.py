from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# 1. เปลี่ยนการ import เป็นแบบระบุไฟล์โดยตรง (เพื่อเลี่ยงการโหลด auth ที่พ่วง DB มาด้วย)
from app.api.v1.chatbot import router as chatbot_router 
from app.api.v1.auth import router as auth_router

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

app.include_router(auth_router, prefix="/api")
app.include_router(chatbot_router, prefix="/api/v1/ai", tags=["AI Chatbot"])

@app.get("/")
def root():
    return {"message": "Server is running! AI Chatbot and Auth are ready."}

