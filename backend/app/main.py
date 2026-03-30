from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# นำเข้า Router และระบบฐานข้อมูล
from app.api.v1.chatbot import router as chatbot_router 
from app.api.v1.auth import router as auth_router
from app.utils.db import engine, Base
# นำเข้า models ทุกตัวเพื่อให้ SQLAlchemy มองเห็นตารางก่อนสร้าง
from app.models import user, planner

# สั่งสร้างตารางฐานข้อมูลทั้งหมด
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Gen Z AI Study Planner API",
    description="Backend สำหรับระบบจัดตารางเรียนและ Chatbot AI พร้อมระบบผู้ใช้",
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
app.include_router(auth_router, prefix="/api/v1/user", tags=["Users"])

@app.get("/")
def root():
    return {"message": "Server is running! Database is active and ready."}