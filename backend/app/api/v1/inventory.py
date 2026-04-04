from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.utils.db import get_db
from app.utils.security import get_current_user
from app.models.user_avatar import UserAvatar
from app.models.user_room import UserRoom
from app.models.avatar import Avatar
from app.models.room import Room
from app.models.user import User

router = APIRouter()


# ---------- Schemas ----------

class BuyAvatarRequest(BaseModel):
    avatar_id: int

class BuyRoomRequest(BaseModel):
    room_id: int

class EquipAvatarRequest(BaseModel):
    avatar_id: int

class EquipRoomRequest(BaseModel):
    room_id: int


# ---------- Buy ----------

@router.post("/buy-avatar")
def buy_avatar(
    request: BuyAvatarRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # เช็คว่า avatar มีในระบบไหม
    avatar = db.query(Avatar).filter(Avatar.id == request.avatar_id).first()
    if not avatar:
        raise HTTPException(status_code=404, detail="ไม่พบ Avatar นี้")

    # เช็คว่าซื้อไปแล้วหรือยัง
    already_owned = db.query(UserAvatar).filter(
        UserAvatar.user_id == current_user.id,
        UserAvatar.avatar_id == request.avatar_id
    ).first()
    if already_owned:
        raise HTTPException(status_code=400, detail="คุณมี Avatar นี้อยู่แล้ว")

    # เช็คเหรียญพอไหม
    if current_user.coins < avatar.price:
        raise HTTPException(status_code=400, detail=f"เหรียญไม่พอ (มี {current_user.coins}, ต้องการ {avatar.price})")

    # หักเหรียญ
    current_user.coins -= avatar.price

    # เพิ่มเข้า inventory
    new_entry = UserAvatar(user_id=current_user.id, avatar_id=request.avatar_id, is_equipped=False)
    db.add(new_entry)
    db.commit()

    return {
        "message": f"ซื้อ Avatar '{avatar.name}' สำเร็จ",
        "coins_remaining": current_user.coins,
    }


@router.post("/buy-room")
def buy_room(
    request: BuyRoomRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # เช็คว่า room มีในระบบไหม
    room = db.query(Room).filter(Room.id == request.room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="ไม่พบ Room นี้")

    # เช็คว่าซื้อไปแล้วหรือยัง
    already_owned = db.query(UserRoom).filter(
        UserRoom.user_id == current_user.id,
        UserRoom.room_id == request.room_id
    ).first()
    if already_owned:
        raise HTTPException(status_code=400, detail="คุณมี Room นี้อยู่แล้ว")

    # เช็คเหรียญพอไหม
    if current_user.coins < room.price:
        raise HTTPException(status_code=400, detail=f"เหรียญไม่พอ (มี {current_user.coins}, ต้องการ {room.price})")

    # หักเหรียญ
    current_user.coins -= room.price

    # เพิ่มเข้า inventory
    new_entry = UserRoom(user_id=current_user.id, room_id=request.room_id, is_equipped=False)
    db.add(new_entry)
    db.commit()

    return {
        "message": f"ซื้อ Room '{room.name}' สำเร็จ",
        "coins_remaining": current_user.coins,
    }


# ---------- Catalog (all items) ----------

@router.get("/all-avatars")
def get_all_avatars(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    avatars = db.query(Avatar).all()
    return [
        {"id": a.id, "name": a.name, "price": a.price, "model_path": a.model_path}
        for a in avatars
    ]


@router.get("/all-rooms")
def get_all_rooms(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    rooms = db.query(Room).all()
    return [
        {"id": r.id, "name": r.name, "price": r.price, "image_path": r.image_path}
        for r in rooms
    ]


# ---------- Get Inventory ----------

@router.get("/avatars")
def get_my_avatars(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    rows = (
        db.query(UserAvatar, Avatar)
        .join(Avatar, UserAvatar.avatar_id == Avatar.id)
        .filter(UserAvatar.user_id == current_user.id)
        .all()
    )
    return [
        {
            "id": avatar.id,
            "name": avatar.name,
            "price": avatar.price,
            "model_path": avatar.model_path,
            "is_equipped": ua.is_equipped,
        }
        for ua, avatar in rows
    ]


@router.get("/rooms")
def get_my_rooms(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    rows = (
        db.query(UserRoom, Room)
        .join(Room, UserRoom.room_id == Room.id)
        .filter(UserRoom.user_id == current_user.id)
        .all()
    )
    return [
        {
            "id": room.id,
            "name": room.name,
            "price": room.price,
            "image_path": room.image_path,
            "is_equipped": ur.is_equipped,
        }
        for ur, room in rows
    ]


# ---------- Equip ----------

@router.post("/equip-avatar")
def equip_avatar(
    request: EquipAvatarRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ownership = db.query(UserAvatar).filter(
        UserAvatar.user_id == current_user.id,
        UserAvatar.avatar_id == request.avatar_id
    ).first()

    if not ownership:
        raise HTTPException(status_code=403, detail="คุณไม่มี Avatar นี้")

    db.query(UserAvatar).filter(
        UserAvatar.user_id == current_user.id,
        UserAvatar.is_equipped == True
    ).update({"is_equipped": False})

    ownership.is_equipped = True
    db.commit()

    return {"message": "Equip Avatar สำเร็จ", "avatar_id": request.avatar_id}


@router.post("/equip-room")
def equip_room(
    request: EquipRoomRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ownership = db.query(UserRoom).filter(
        UserRoom.user_id == current_user.id,
        UserRoom.room_id == request.room_id
    ).first()

    if not ownership:
        raise HTTPException(status_code=403, detail="คุณไม่มี Room นี้")

    db.query(UserRoom).filter(
        UserRoom.user_id == current_user.id,
        UserRoom.is_equipped == True
    ).update({"is_equipped": False})

    ownership.is_equipped = True
    db.commit()

    return {"message": "Equip Room สำเร็จ", "room_id": request.room_id}
