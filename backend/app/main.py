from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from contextlib import asynccontextmanager
import os
import time
import logging
from fastapi.staticfiles import StaticFiles

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
from app.api.v1.ai_assistant import router as ai_assistant_router
from app.utils.db import engine, Base
# นำเข้า models ทุกตัวเพื่อให้ SQLAlchemy มองเห็นตารางก่อนสร้าง
from app.models import user, avatar, room, user_avatar, user_room
from app.models import study_sheet, todo, chat_history, user_sheet, password_reset_token
from app.models import notification, proof
from app.models import notification, proof
from app.services.ai_service import close_ai_service, init_ai_service
from app.services.storage_service import _get_client as init_storage_service

# ─── Lifespan Handler (Startup & Shutdown) ───
@asynccontextmanager
async def lifespan(app: FastAPI):
    # [STARTUP]
    # 1. สร้าง Folder สำหรับเก็บไฟล์ถ้ายังไม่มี
    UPLOAD_DIRS = ["uploads", "uploads/sheets", "uploads/proofs"]
    for d in UPLOAD_DIRS:
        if not os.path.exists(d):
            os.makedirs(d, exist_ok=True)
    
    # 2. สร้างตารางฐานข้อมูล (ถ้ายังไม่มี)
    Base.metadata.create_all(bind=engine)
    
    # 3. Pre-init AI Service
    await init_ai_service()
    
    # 4. Pre-init Storage Service
    init_storage_service()
    
    yield
    # [SHUTDOWN]
    # ปิด connection pool เมื่อปิด server
    engine.dispose()
    await close_ai_service()

# ─── Logging Configuration ───
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger("app")

# ─── Rate Limiter (ป้องกัน Brute-force / DoS) ───
limiter = Limiter(key_func=get_remote_address, default_limits=["120/minute"])

app = FastAPI(
    title="Gen Z AI Study Planner API",
    description="Backend สำหรับระบบจัดตารางเรียนและ Chatbot AI พร้อมระบบผู้ใช้",
    version="1.2.6",
    lifespan=lifespan
)

# ─── เก็บ limiter ไว้ใน app state ───
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ─── GZip Middleware (บีบอัด response ลด bandwidth 50-80%) ───
app.add_middleware(GZipMiddleware, minimum_size=500)

# ─── Profiling & Security Headers Middleware ───
@app.middleware("http")
async def process_time_and_security(request: Request, call_next):
    start_time = time.time()
    
    # ดำเนินการ request
    try:
        response: Response = await call_next(request)
    except Exception as e:
        logger.error(f"Unhandled Exception: {str(e)}", exc_info=True)
        return Response(
            content="Internal Server Error",
            status_code=500
        )
    
    process_time = time.time() - start_time
    
    # 1. Security Headers
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["X-Process-Time"] = f"{process_time:.4f}s"
    
    # 2. Cache Control Logic
    if request.url.path.startswith("/api/"):
        response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate"
    elif request.url.path.startswith("/uploads/"):
        # อนุญาตให้ cache รูปภาพ/ชีทสรุป ได้ 1 วัน เพื่อประหยัด bandwidth
        response.headers["Cache-Control"] = "public, max-age=86400"
        
    return response

# ─── Static Files Mounting (Consolidated) ───
UPLOAD_DIR = "uploads"

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
app.include_router(ai_assistant_router, prefix="/api/v1/ai-assistant", tags=["AI Assistant"])

@app.get("/")
def root():
    return {"message": "Server is running! Database is active and ready."}