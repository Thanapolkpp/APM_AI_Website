from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

# นำเข้า Router และระบบฐานข้อมูล
from app.api.v1.chatbot import router as chatbot_router
from app.api.v1.auth import router as auth_router
from app.api.v1.inventory import router as inventory_router
from app.api.v1.study_sheets import router as study_sheets_router
from app.api.v1.todos import router as todos_router
from app.api.v1.chat import router as chat_router
from app.api.v1.user_profile import router as user_profile_router
from app.utils.db import engine, Base
# นำเข้า models ทุกตัวเพื่อให้ SQLAlchemy มองเห็นตารางก่อนสร้าง
from app.models import user, planner, avatar, room, user_avatar, user_room
from app.models import study_sheet, todo, chat_history, user_sheet, password_reset_token

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

# ตั้งค่าให้เข้าถึงโฟลเดอร์ uploads ได้โดยตรงผ่าน URL
if not os.path.exists("uploads"):
    os.makedirs("uploads")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(auth_router, prefix="/api")
app.include_router(chatbot_router, prefix="/api/v1/ai", tags=["AI Chatbot"])
app.include_router(auth_router, prefix="/api/v1/user", tags=["Users"])
app.include_router(inventory_router, prefix="/api/v1/inventory", tags=["Inventory"])
app.include_router(study_sheets_router, prefix="/api/v1/study-sheets", tags=["Study Sheets"])
app.include_router(todos_router, prefix="/api/v1/todos", tags=["Todos"])
app.include_router(chat_router, prefix="/api/v1/chat", tags=["Chat"])
app.include_router(user_profile_router, prefix="/api/v1/user", tags=["User Profile"])

@app.get("/")
def root():
    return {"message": "Server is running! Database is active and ready."}