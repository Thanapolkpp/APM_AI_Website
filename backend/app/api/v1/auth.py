from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.utils.db import get_db
from app.utils.security import verify_password, create_access_token
from app.services.auth_service import get_user_by_email, create_user
from pydantic import BaseModel, EmailStr

router = APIRouter()

# --- Schema สำหรับรับข้อมูล (Validation) ---
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# --- Endpoints ---

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    # 1. เช็คว่ามี Email นี้ในระบบหรือยัง
    existing_user = get_user_by_email(db, email=user_data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email นี้ถูกใช้งานไปแล้ว")
    
    # 2. สร้าง User ใหม่
    new_user = create_user(db, user_data)
    return {"message": "สมัครสมาชิกสำเร็จ", "user_id": new_user.id}

@router.post("/login")
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    # 1. ค้นหา User จาก Email
    user = get_user_by_email(db, email=login_data.email)
    
    # 2. ตรวจสอบว่ามี User ไหม และรหัสผ่านถูกต้องไหม
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email หรือ Password ไม่ถูกต้อง",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # 3. สร้าง JWT Token ส่งกลับไปให้ Frontend
    access_token = create_access_token(data={"sub": user.email})
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "username": user.username
    }