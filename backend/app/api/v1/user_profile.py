from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.utils.db import get_db
from app.models.user import User
from app.utils.security import get_current_user as get_current_active_user
import json

router = APIRouter()

@router.get("/me")
async def get_my_profile(current_user: User = Depends(get_current_active_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "coins": current_user.coins,
        "exp": current_user.exp,
        # Default values since columns are missing in DB
        "equipped_avatar": "bro" 
    }

@router.get("/leaderboard")
async def get_leaderboard(db: Session = Depends(get_db)):
    # Query only existing fields to avoid "Unknown column" error
    users = db.query(User).order_by(User.exp.desc()).limit(10).all()
    leaderboard = []
    for u in users:
        leaderboard.append({
            "username": u.username,
            "exp": u.exp,
            "equipped_avatar": "bro" # Default for now
        })
    return leaderboard

# --- Other endpoints simplified to avoid missing columns ---
@router.patch("/coins")
async def update_user_coins(payload: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    amount = payload.get("amount", 0)
    current_user.coins += amount
    db.commit()
    return {"new_balance": current_user.coins}

@router.get("/special-missions")
async def get_special_missions(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    return [] # Simplified
