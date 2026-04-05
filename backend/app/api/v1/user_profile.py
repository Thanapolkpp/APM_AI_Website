from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.utils.db import get_db
from app.utils.security import get_current_user
from app.models.user import User

router = APIRouter()


class UpdateCoinsRequest(BaseModel):
    amount: int  # บวก = เพิ่ม, ลบ = หัก


class UpdateExpRequest(BaseModel):
    amount: int  # จำนวน EXP ที่จะเพิ่ม


@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "coins": current_user.coins,
        "exp": current_user.exp,
        "has_claimed_test_reward": current_user.has_claimed_test_reward,
        "is_admin": current_user.is_admin,
    }


@router.post("/claim-test-reward")
def claim_test_reward(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.has_claimed_test_reward:
        raise HTTPException(
            status_code=400,
            detail="คุณได้รับรางวัลนี้ไปแล้วนะเพื่อน!"
        )
    
    current_user.coins += 50
    current_user.exp = (current_user.exp or 0) + 30
    current_user.has_claimed_test_reward = True
    
    db.commit()
    return {
        "message": "รับรางวัลสำเร็จ!",
        "coins": current_user.coins,
        "exp": current_user.exp
    }


@router.patch("/coins")
def update_coins(
    body: UpdateCoinsRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    new_balance = current_user.coins + body.amount
    if new_balance < 0:
        raise HTTPException(
            status_code=400,
            detail=f"เหรียญไม่พอ (มี {current_user.coins} เหรียญ)"
        )
    current_user.coins = new_balance
    db.commit()
    return {"coins": current_user.coins}


@router.patch("/exp")
def update_exp(
    body: UpdateExpRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    current_user.exp = (current_user.exp or 0) + body.amount
    db.commit()
    return {"exp": current_user.exp}
