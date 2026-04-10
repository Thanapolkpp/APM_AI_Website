from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# นำเข้า Router และระบบฐานข้อมูล
from app.api.v1.chatbot import router as chatbot_router
from app.api.v1.auth import router as auth_router
from app.api.v1.inventory import router as inventory_router
from app.api.v1.study_sheets import router as study_sheets_router
from app.api.v1.todos import router as todos_router
from app.api.v1.chat import router as chat_router
from app.api.v1.user_profile import router as user_profile_router
from app.api.v1.notifications import router as notifications_router
from app.api.v1.proofs import router as proofs_router
from app.utils.db import engine, Base
# นำเข้า models ทุกตัวเพื่อให้ SQLAlchemy มองเห็นตารางก่อนสร้าง
from app.models import user, planner, avatar, room, user_avatar, user_room
from app.models import study_sheet, todo, chat_history, user_sheet, password_reset_token
from app.models import notification, proof

# สั่งสร้างตารางฐานข้อมูลทั้งหมด
Base.metadata.create_all(bind=engine)

from fastapi.staticfiles import StaticFiles
import os

# Create uploads directory if not exists
if not os.path.exists("uploads"):
    os.makedirs("uploads")
if not os.path.exists("uploads/sheets"):
    os.makedirs("uploads/sheets")

app = FastAPI(
    title="Gen Z AI Study Planner API",
    description="Backend สำหรับระบบจัดตารางเรียนและ Chatbot AI พร้อมระบบผู้ใช้",
    version="1.1.0"
)

# mount static files
app.mount("/updates", StaticFiles(directory="uploads"), name="uploads")
# หรือจะใช้ path ตรงๆ
if os.path.exists("uploads"):
    app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads_direct")

# ตั้งค่า CORS เพื่อรองรับ Vercel Preview แขนงต่างๆ
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://apm-ai-website.vercel.app", 
        "http://localhost:5173",
        "http://localhost:3000"
    ],
    allow_origin_regex=r"https://apm-ai-website-.*-thanapolkpps-projects\.vercel\.app", # เพิ่ม regex สำหรับ Vercel preview
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# จัดระเบียบ Router (เน้น v1 เป็นหลัก)
app.include_router(auth_router, prefix="/api/v1/user", tags=["Users Authentication"])
app.include_router(chatbot_router, prefix="/api/v1/ai", tags=["AI Chatbot"])
app.include_router(inventory_router, prefix="/api/v1/inventory", tags=["Inventory"])
app.include_router(study_sheets_router, prefix="/api/v1/study-sheets", tags=["Study Sheets"])
app.include_router(todos_router, prefix="/api/v1/todos", tags=["Todos"])
app.include_router(chat_router, prefix="/api/v1/chat", tags=["Chat"])
app.include_router(user_profile_router, prefix="/api/v1/user", tags=["User Profile"])
app.include_router(notifications_router, prefix="/api/v1/notifications", tags=["Notifications"])
app.include_router(proofs_router, prefix="/api/v1/proofs", tags=["Proofs"])

@app.get("/")
def root():
    return {"message": "Server is running! Database is active and ready."}