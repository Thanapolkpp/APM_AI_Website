import secrets
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, status, Request, BackgroundTasks
from sqlalchemy.orm import Session
from app.utils.db import get_db
from app.utils.security import verify_password, create_access_token, hash_password, validate_password_strength
from app.services.auth_service import get_user_by_email, get_user_by_username, create_user
from app.models.password_reset_token import PasswordResetToken
from app.services.mail_service import send_reset_password_email
from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from fastapi.security import OAuth2PasswordRequestForm
from slowapi import Limiter
from slowapi.util import get_remote_address
import asyncio

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

# --- Schema สำหรับรับข้อมูล (Validation) ---
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

    @field_validator("username")
    @classmethod
    def validate_username(cls, v):
        v = v.strip()
        if len(v) < 3 or len(v) > 30:
            raise ValueError("Username ต้องมี 3-30 ตัวอักษร")
        if not v.replace("_", "").replace("-", "").isalnum():
            raise ValueError("Username รองรับเฉพาะ ภาษาอังกฤษ ตัวเลข _ และ - เท่านั้น")
        return v

    @field_validator("password")
    @classmethod
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร")
        return v

class UserLogin(BaseModel):
    email: Optional[str] = None
    username: Optional[str] = None
    password: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

    @field_validator("new_password")
    @classmethod
    def validate_new_password(cls, v):
        if len(v) < 8:
            raise ValueError("รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร")
        return v

# --- Endpoints ---

@router.post("/register", status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
def register(request: Request, user_data: UserCreate, db: Session = Depends(get_db)):
    # 1. เช็คว่ามี Email นี้ในระบบหรือยัง
    existing_user_email = get_user_by_email(db, email=user_data.email)
    if existing_user_email:
        raise HTTPException(status_code=400, detail="Email นี้ถูกใช้งานไปแล้ว")
        
    # เช็คว่ามี Username นี้ในระบบหรือยัง
    existing_user_username = get_user_by_username(db, username=user_data.username)
    if existing_user_username:
        raise HTTPException(status_code=400, detail="Username นี้ถูกใช้งานไปแล้ว")
    
    # 2. สร้าง User ใหม่
    new_user = create_user(db, user_data)
    return {"message": "สมัครสมาชิกสำเร็จ", "user_id": new_user.id}

@router.post("/login")
@limiter.limit("10/minute")
async def login(
    request: Request,
    login_data: Optional[UserLogin] = None, 
    db: Session = Depends(get_db)
):
    user = None
    input_identifier = None
    input_password = None
    
    # เช็คก่อนว่ามี JSON หรือไม่
    try:
        content_type = request.headers.get("Content-Type", "")
        if "application/json" in content_type:
            data = await request.json()
            input_identifier = data.get("email") or data.get("username")
            input_password = data.get("password")
        else:
            # ถ้าเป็นฟอร์ม (Swagger)
            form_data = await request.form()
            input_identifier = form_data.get("username")
            input_password = form_data.get("password")
    except Exception:
        pass

    # จัดการกรณีพิเศษสำหรับ Swagger UI Authorize
    if not input_identifier or not input_password:
        # ลองดึงจาก form_data อีกครั้ง (FastAPI support)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="ข้อมูลล็อกอินไม่ครบถ้วน",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # จำกัดความยาว input ป้องกัน abuse
    if len(input_identifier) > 100 or len(input_password) > 128:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ข้อมูลไม่ถูกต้อง",
        )

    # ค้นหา User โดยเช็คว่าเป็นอีเมลหรือชื่อผู้ใช้
    if "@" in input_identifier:
        user = await asyncio.to_thread(get_user_by_email, db, email=input_identifier)
    else:
        user = await asyncio.to_thread(get_user_by_username, db, username=input_identifier)
    
    # 2. ตรวจสอบว่ามี User ไหม และรหัสผ่านถูกต้องไหม
    is_valid_password = await asyncio.to_thread(verify_password, input_password, user.hashed_password if user else "")
    if not user or not is_valid_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email/Username หรือ Password ไม่ถูกต้อง",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # 3. สร้าง JWT Token ส่งกลับไปให้ Frontend
    access_token = create_access_token(data={"sub": user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "username": user.username,
        "email": user.email
    }



@router.post("/forgot-password")
@limiter.limit("3/minute")
def forgot_password(request: Request, body: ForgotPasswordRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    user = get_user_by_email(db, email=body.email)

    # ไม่บอกว่าหาไม่เจอ กันคน brute force หา email
    if not user:
        return {"message": "หากอีเมลนี้มีในระบบ เราจะส่งลิงก์รีเซ็ตรหัสผ่านให้"}

    # ลบ token เก่าของ user นี้ทิ้งก่อน (ถ้ามี)
    db.query(PasswordResetToken).filter(
        PasswordResetToken.user_id == user.id
    ).delete()

    # สร้าง token ใหม่ หมดอายุใน 15 นาที
    token = secrets.token_urlsafe(32)
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=15)


    reset_token = PasswordResetToken(
        user_id=user.id,
        token=token,
        expires_at=expires_at,
    )
    db.add(reset_token)
    db.commit()

    # ส่ง email แบบ Background Task
    background_tasks.add_task(send_reset_password_email, to_email=user.email, token=token)

    return {"message": "หากอีเมลนี้มีในระบบ เราจะส่งลิงก์รีเซ็ตรหัสผ่านให้"}


@router.post("/reset-password")
@limiter.limit("5/minute")
def reset_password(request: Request, body: ResetPasswordRequest, db: Session = Depends(get_db)):
    # หา token ใน DB
    reset_token = db.query(PasswordResetToken).filter(
        PasswordResetToken.token == body.token
    ).first()

    if not reset_token:
        raise HTTPException(status_code=400, detail="ลิงก์ไม่ถูกต้อง")

    # เช็คว่าหมดอายุหรือยัง
    if datetime.now(timezone.utc) > reset_token.expires_at:

        db.delete(reset_token)
        db.commit()
        raise HTTPException(status_code=400, detail="ลิงก์หมดอายุแล้ว กรุณาขอใหม่อีกครั้ง")

    # อัปเดตรหัสผ่านใหม่
    from app.models.user import User
    user = db.query(User).filter(User.id == reset_token.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="ไม่พบผู้ใช้งาน")

    user.hashed_password = hash_password(body.new_password)

    # ลบ token ทิ้ง ใช้ซ้ำไม่ได้
    db.delete(reset_token)
    db.commit()

    return {"message": "เปลี่ยนรหัสผ่านสำเร็จ กรุณาเข้าสู่ระบบใหม่"}