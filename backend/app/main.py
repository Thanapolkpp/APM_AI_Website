from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import auth
from app.utils.db import engine, Base

# สร้าง Table ใน MySQL อัตโนมัติ (ถ้ายังไม่มี)
# หมายเหตุ: ในระยะยาวแนะนำให้ใช้ Alembic ในการจัดการ Database Migration
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Gen Z AI Study Planner API",
    description="Backend สำหรับระบบจัดตารางเรียนและ Chatbot คลายเครียด",
    version="1.0.0"
)

# ตั้งค่า CORS เพื่อให้ Frontend (React/Vue/Next.js) เรียกใช้งาน API ได้
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # ในโปรดักชั่นควรระบุ Domain ของ Frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# รวม Router จากไฟล์ auth.py เข้ามา
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])

@app.get("/")
def root():
    return {"message": "Server is running! Gen Z AI Planner API is ready."}