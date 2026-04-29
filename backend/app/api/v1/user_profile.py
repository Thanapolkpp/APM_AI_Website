from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.utils.db import get_db
from app.models.user import User
from app.utils.security import get_current_user as get_current_active_user
from pydantic import BaseModel, field_validator
import json

from app.models.avatar import Avatar
from app.models.user_avatar import UserAvatar

router = APIRouter()

# ── Schema สำหรับ coins update (ป้องกัน arbitrary values) ──
class UpdateCoinsRequest(BaseModel):
    amount: int

    @field_validator("amount")
    @classmethod
    def validate_amount(cls, v):
        # จำกัดให้เพิ่ม/ลดได้ครั้งละไม่เกิน 100 coins
        if abs(v) > 100:
            raise ValueError("จำนวน coins ต้องไม่เกิน 100 ต่อครั้ง")
        return v


@router.get("/me")
async def get_my_profile(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    # Find equipped avatar name
    equipped = db.query(Avatar.name).join(UserAvatar).filter(
        UserAvatar.user_id == current_user.id,
        UserAvatar.is_equipped == True
    ).first()
    
    avatar_name = equipped[0] if equipped else "bro"

    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "coins": current_user.coins,
        "exp": current_user.exp,
        "equipped_avatar": avatar_name
    }

@router.get("/leaderboard")
async def get_leaderboard(db: Session = Depends(get_db)):
    # Join with UserAvatar and Avatar to get the real equipped avatar name for each user
    results = db.query(User, Avatar.name).outerjoin(
        UserAvatar, (UserAvatar.user_id == User.id) & (UserAvatar.is_equipped == True)
    ).outerjoin(
        Avatar, Avatar.id == UserAvatar.avatar_id
    ).order_by(User.exp.desc()).limit(10).all()
    
    leaderboard = []
    for user, avatar_name in results:
        leaderboard.append({
            "username": user.username,
            "exp": user.exp,
            "equipped_avatar": avatar_name if avatar_name else "bro"
        })
    return leaderboard

# --- Other endpoints simplified to avoid missing columns ---
@router.patch("/coins")
async def update_user_coins(payload: UpdateCoinsRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    current_user.coins += payload.amount
    # ป้องกัน coins ติดลบ
    if current_user.coins < 0:
        current_user.coins = 0
    db.commit()
    return {"new_balance": current_user.coins}

@router.get("/special-missions")
async def get_special_missions(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    return [] # Simplified
