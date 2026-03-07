from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.utils.db import get_db
from app.utils.security import verify_password, create_access_token
from app.services.auth_service import get_user_by_email, get_user_by_username, create_user
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