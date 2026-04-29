from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from app.utils.db import get_db
from app.models.user import User
from app.utils.security import get_current_user as get_current_active_user
from pydantic import BaseModel, field_validator
import json
import asyncio

from app.models.avatar import Avatar
from app.models.user_avatar import UserAvatar

router = APIRouter()

# ── Schema สำหรับ coins update (ป้องกัน arbitrary values) ──
class UpdateCoinsRequest(BaseModel):
    amount: int

    @field_validator("amount")
    @classmethod
    def validate_amount(cls, v):
        if abs(v) > 500:
            raise ValueError("จำนวน coins ต้องไม่เกิน 500 ต่อครั้ง")
        return v

class UpdateExpRequest(BaseModel):
    amount: int

    @field_validator("amount")
    @classmethod
    def validate_amount(cls, v):
        if abs(v) > 1000:
            raise ValueError("จำนวน exp ต้องไม่เกิน 1000 ต่อครั้ง")
        return v

class UpdateReadingTimeRequest(BaseModel):
    minutes: int


@router.get("/me")
def get_my_profile(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
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
        "equipped_avatar": avatar_name,
        "has_claimed_test_reward": current_user.has_claimed_test_reward
    }

@router.get("/leaderboard")
def get_leaderboard(db: Session = Depends(get_db)):
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
def update_user_coins(payload: UpdateCoinsRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    current_user.coins += payload.amount
    # ป้องกัน coins ติดลบ
    if current_user.coins < 0:
        current_user.coins = 0
    db.commit()
    return {"new_balance": current_user.coins}

@router.post("/claim-test-reward")
def claim_test_reward(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if current_user.has_claimed_test_reward:
        raise HTTPException(status_code=400, detail="คุณกดรับรางวัลไปแล้วครับเพื่อน 🌷")
    
    current_user.coins += 50
    current_user.exp += 30
    current_user.has_claimed_test_reward = True
    
    db.commit()
    return {"message": "เย้! รับรางวัลสำเร็จแล้วครับ +50 🪙 +30 ✨", "new_coins": current_user.coins, "new_exp": current_user.exp}

@router.patch("/exp")
def update_user_exp(payload: UpdateExpRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    current_user.exp += payload.amount
    if current_user.exp < 0:
        current_user.exp = 0
    db.commit()
    return {"new_exp": current_user.exp}

@router.post("/add-reading-time")
def add_reading_time(payload: UpdateReadingTimeRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    current_user.reading_time_minutes += payload.minutes
    db.commit()
    return {"total_minutes": current_user.reading_time_minutes}

@router.get("/special-missions")
async def get_special_missions(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    # Mock data or real logic
    missions = [
        {
            "id": "reading_30",
            "title": "หนอนหนังสือระดับต้น",
            "target": 30,
            "current": min(current_user.reading_time_minutes, 30),
            "unit": "นาที",
            "progress": min((current_user.reading_time_minutes / 30) * 100, 100),
            "reward_coins": 20,
            "is_claimed": "reading_30" in json.loads(current_user.claimed_missions)
        },
        {
            "id": "missions_5",
            "title": "นักล่าภารกิจ",
            "target": 5,
            "current": min(current_user.missions_done, 5),
            "unit": "ภารกิจ",
            "progress": min((current_user.missions_done / 5) * 100, 100),
            "reward_coins": 50,
            "is_claimed": "missions_5" in json.loads(current_user.claimed_missions)
        }
    ]
    return missions

@router.post("/claim-mission/{mission_id}")
def claim_mission(mission_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    claimed = json.loads(current_user.claimed_missions)
    if mission_id in claimed:
        raise HTTPException(status_code=400, detail="รับรางวัลไปแล้วจ้า")
    
    # Simple check for mission completion
    can_claim = False
    reward = 0
    if mission_id == "reading_30" and current_user.reading_time_minutes >= 30:
        can_claim = True
        reward = 20
    elif mission_id == "missions_5" and current_user.missions_done >= 5:
        can_claim = True
        reward = 50
    
    if not can_claim:
        raise HTTPException(status_code=400, detail="ภารกิจยังไม่สำเร็จนะเพื่อน")
    
    claimed.append(mission_id)
    current_user.claimed_missions = json.dumps(claimed)
    current_user.coins += reward
    db.commit()
    
    return {"message": f"สำเร็จ! ได้รับ {reward} coins 🪙", "new_balance": current_user.coins}
