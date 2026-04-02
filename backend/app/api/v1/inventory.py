from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.utils.db import get_db
from app.models.user_avatar import UserAvatar
from app.models.user_room import UserRoom

router = APIRouter()


class EquipAvatarRequest(BaseModel):
    user_id: int
    avatar_id: int


class EquipRoomRequest(BaseModel):
    user_id: int
    room_id: int


@router.post("/equip-avatar")
def equip_avatar(request: EquipAvatarRequest, db: Session = Depends(get_db)):
    # ตรวจสอบว่า user เป็นเจ้าของ avatar นี้หรือไม่
    ownership = db.query(UserAvatar).filter(
        UserAvatar.user_id == request.user_id,
        UserAvatar.avatar_id == request.avatar_id
    ).first()

    if not ownership:
        raise HTTPException(status_code=403, detail="You do not own this avatar")

    # ถอด avatar ที่ equipped อยู่ทั้งหมดของ user นี้ก่อน
    db.query(UserAvatar).filter(
        UserAvatar.user_id == request.user_id,
        UserAvatar.is_equipped == True
    ).update({"is_equipped": False})

    # Equip avatar ที่เลือก
    ownership.is_equipped = True
    db.commit()

    return {"message": "Avatar equipped successfully", "avatar_id": request.avatar_id}


@router.post("/equip-room")
def equip_room(request: EquipRoomRequest, db: Session = Depends(get_db)):
    # ตรวจสอบว่า user เป็นเจ้าของ room นี้หรือไม่
    ownership = db.query(UserRoom).filter(
        UserRoom.user_id == request.user_id,
        UserRoom.room_id == request.room_id
    ).first()

    if not ownership:
        raise HTTPException(status_code=403, detail="You do not own this room")

    # ถอด room ที่ equipped อยู่ทั้งหมดของ user นี้ก่อน
    db.query(UserRoom).filter(
        UserRoom.user_id == request.user_id,
        UserRoom.is_equipped == True
    ).update({"is_equipped": False})

    # Equip room ที่เลือก
    ownership.is_equipped = True
    db.commit()

    return {"message": "Room equipped successfully", "room_id": request.room_id}
