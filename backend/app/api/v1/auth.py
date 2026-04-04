import secrets
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.utils.db import get_db
from app.utils.security import verify_password, create_access_token, hash_password
from app.services.auth_service import get_user_by_email, get_user_by_username, create_user
from app.models.password_reset_token import PasswordResetToken
from app.services.mail_service import send_reset_password_email
from pydantic import BaseModel, EmailStr
from typing import Optional

router = APIRouter()

# --- Schema สำหรับรับข้อมูล (Validation) ---
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: Optional[str] = None
    username: Optional[str] = None
    password: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

# --- Endpoints ---

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
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
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = None
    # 1. ค้นหา User จาก Email หรือ Username
    if login_data.email:
        user = get_user_by_email(db, email=login_data.email)
    elif login_data.username:
        user = get_user_by_username(db, username=login_data.username)
    
    # 2. ตรวจสอบว่ามี User ไหม และรหัสผ่านถูกต้องไหม
    if not user or not verify_password(login_data.password, user.hashed_password):
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
def forgot_password(body: ForgotPasswordRequest, db: Session = Depends(get_db)):
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
    expires_at = datetime.now() + timedelta(minutes=15)


    reset_token = PasswordResetToken(
        user_id=user.id,
        token=token,
        expires_at=expires_at,
    )
    db.add(reset_token)
    db.commit()

    # ส่ง email
    send_reset_password_email(to_email=user.email, token=token)

    return {"message": "หากอีเมลนี้มีในระบบ เราจะส่งลิงก์รีเซ็ตรหัสผ่านให้"}


@router.post("/reset-password")
def reset_password(body: ResetPasswordRequest, db: Session = Depends(get_db)):
    # หา token ใน DB
    reset_token = db.query(PasswordResetToken).filter(
        PasswordResetToken.token == body.token
    ).first()

    if not reset_token:
        raise HTTPException(status_code=400, detail="ลิงก์ไม่ถูกต้อง")

    # เช็คว่าหมดอายุหรือยัง
    if datetime.now() > reset_token.expires_at:

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