from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

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
from app.models import user, avatar, room, user_avatar, user_room
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

# ─── Rate Limiter (ป้องกัน Brute-force / DoS) ───
limiter = Limiter(key_func=get_remote_address, default_limits=["120/minute"])

app = FastAPI(
    title="Gen Z AI Study Planner API",
    description="Backend สำหรับระบบจัดตารางเรียนและ Chatbot AI พร้อมระบบผู้ใช้",
    version="1.2.0"
)

# ─── เก็บ limiter ไว้ใน app state ───
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ─── GZip Middleware (บีบอัด response ลด bandwidth 50-80%) ───
app.add_middleware(GZipMiddleware, minimum_size=500)

# ─── Security Headers Middleware ───
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response: Response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    # Cache control สำหรับ API responses
    if request.url.path.startswith("/api/"):
        response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate"
        response.headers["Pragma"] = "no-cache"
    return response

# ─── Static Files Mounting (Consolidated) ───
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    os.makedirs(os.path.join(UPLOAD_DIR, "sheets"), exist_ok=True)
    os.makedirs(os.path.join(UPLOAD_DIR, "proofs"), exist_ok=True)

# Mount /uploads จุดเดียวให้เคลียร์
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# ─── CORS Configuration (Production Ready) ───
# อนุญาตเฉพาะ Domain ที่จำเป็น และ Vercel/Render ทั้งหมด
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://apm-ai-website.vercel.app",
        "https://apm-ai-website.onrender.com",
        "http://localhost:5173",
        "http://localhost:3000"
    ],
    # รองรับ Preview branches ของทั้ง Vercel และ Render
    allow_origin_regex=r"https://(apm-ai-website|ai-for-gen-z)-.*-thanapolkpps-projects\.vercel\.app|https://.*\.onrender\.com",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    max_age=600,
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