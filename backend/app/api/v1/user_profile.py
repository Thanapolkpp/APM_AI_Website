from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
import json

from app.utils.db import get_db
from app.utils.security import get_current_user
from app.models.user import User
from app.models.user_avatar import UserAvatar
from app.models.user_room import UserRoom
from app.models.avatar import Avatar
from app.models.room import Room

router = APIRouter()

class AddReadingTimeRequest(BaseModel):
    minutes: int

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "coins": current_user.coins,
        "exp": current_user.exp,
        "reading_time_minutes": current_user.reading_time_minutes,
        "missions_done": current_user.missions_done,
        "chat_modes": current_user.chat_modes_used
    }

@router.post("/add-reading-time")
def add_reading_time(
    req: AddReadingTimeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if req.minutes <= 0:
        return {"message": "Invalid minutes"}
    
    current_user.reading_time_minutes += req.minutes
    current_user.exp += (req.minutes * 2) # แถม EXP ให้ด้วยนาทีละ 2
    db.commit()
    return {"message": f"เพิ่มเวลาอ่าน {req.minutes} นาทีสำเร็จ", "total": current_user.reading_time_minutes}

@router.get("/special-missions")
def get_special_missions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. ภารกิจอ่านหนังสือ (50 ชม = 3000 นาที)
    reading_target = 3000
    reading_progress = min(100, (current_user.reading_time_minutes / reading_target) * 100)
    
    # 2. ภารกิจ Todo (10 งาน)
    todo_target = 10
    todo_progress = min(100, (current_user.missions_done / todo_target) * 100)
    
    # 3. ภารกิจสายแชท (3 โหมด: bro, nerd, girl)
    modes = current_user.chat_modes_used.split(",") if current_user.chat_modes_used else []
    chat_modes = [m for m in modes if m in ["bro", "nerd", "girl"]]
    chat_progress = min(100, (len(chat_modes) / 3) * 100)
    
    # 4. ภารกิจนักสะสม (3 ตัวละคร)
    avatar_count = db.query(UserAvatar).filter(UserAvatar.user_id == current_user.id).count()
    avatar_progress = min(100, (avatar_count / 3) * 100)
    
    # 5. ภารกิจนักแต่งห้อง (4 ฉาก)
    room_count = db.query(UserRoom).filter(UserRoom.user_id == current_user.id).count()
    room_progress = min(100, (room_count / 4) * 100)
    
    # 6. ภารกิจคู่หูที่แมตช์กัน (Nerd + Library หรือตามที่ระบบกำหนด)
    # สมมติ ID ของ Nerd คือ 2 และ Library คือ 2 (ต้องไปเช็คใน DB จริงอีกที)
    # ในที่นี้ขอนับถ้ามีจำนวนห้องและตัวละครอย่างน้อย 1 คู่ที่พรีเมียม
    match_progress = 100 if (avatar_count >= 2 and room_count >= 2) else 50 if (avatar_count >= 1 and room_count >= 1) else 0

    claimed_list = json.loads(current_user.claimed_missions) if current_user.claimed_missions else []

    missions = [
        {
            "id": "reading_50",
            "title": "นักอ่านตัวยง",
            "description": "อ่านหนังสือครบ 50 ชั่วโมง",
            "progress": round(reading_progress, 1),
            "current": current_user.reading_time_minutes,
            "target": reading_target,
            "unit": "นาที",
            "reward_coins": 500,
            "reward_exp": 1000,
            "is_claimed": "reading_50" in claimed_list
        },
        {
            "id": "todos_10",
            "title": "ผู้พิชิตงาน",
            "description": "ทำภารกิจสำเร็จ 10 อย่าง",
            "progress": round(todo_progress, 1),
            "current": current_user.missions_done,
            "target": todo_target,
            "unit": "งาน",
            "reward_coins": 200,
            "reward_exp": 500,
            "is_claimed": "todos_10" in claimed_list
        },
        {
            "id": "chat_master",
            "title": "สายแชทตัวจริง",
            "description": "คุยกับ AI ครบทั้ง 3 โหมด (Bro, Nerd, Girl)",
            "progress": round(chat_progress, 1),
            "current": len(chat_modes),
            "target": 3,
            "unit": "โหมด",
            "reward_coins": 150,
            "reward_exp": 300,
            "is_claimed": "chat_master" in claimed_list
        },
        {
            "id": "avatar_collector",
            "title": "นักสะสมตัวละคร",
            "description": "มีตัวละครในครอบครอง 3 ตัว",
            "progress": round(avatar_progress, 1),
            "current": avatar_count,
            "target": 3,
            "unit": "ตัว",
            "reward_coins": 300,
            "reward_exp": 600,
            "is_claimed": "avatar_collector" in claimed_list
        },
        {
            "id": "room_decorator",
            "title": "นักแต่งห้อง",
            "description": "มีฉากหลังในครอบครอง 4 ฉาก",
            "progress": round(room_progress, 1),
            "current": room_count,
            "target": 4,
            "unit": "ฉาก",
            "reward_coins": 400,
            "reward_exp": 800,
            "is_claimed": "room_decorator" in claimed_list
        },
        {
            "id": "matching_set",
            "title": "คู่หูที่สมบูรณ์แบบ",
            "description": "มีตัวละครและฉากที่แมตช์กัน",
            "progress": match_progress,
            "current": 1 if match_progress == 100 else 0,
            "target": 1,
            "unit": "เซ็ต",
            "reward_coins": 600,
            "reward_exp": 1200,
            "is_claimed": "matching_set" in claimed_list
        }
    ]
    return missions

@router.post("/claim-mission/{mission_id}")
def claim_mission(
    mission_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # ดึงรายการที่เคยรับไปแล้ว
    claimed_list = json.loads(current_user.claimed_missions) if current_user.claimed_missions else []
    
    if mission_id in claimed_list:
        raise HTTPException(status_code=400, detail="คุณรับรางวัลนี้ไปแล้วจ้า")

    # หาภารกิจและเช็ค Progress (จำลอง Logic เดียวกับ get_special_missions)
    missions = get_special_missions(db, current_user)
    target_mission = next((m for m in missions if m["id"] == mission_id), None)

    if not target_mission:
        raise HTTPException(status_code=404, detail="ไม่พบภารกิจนี้")
    
    if target_mission["progress"] < 100:
        raise HTTPException(status_code=400, detail="ภารกิจยังไม่สำเร็จจ้า")

    # ให้รางวัล
    current_user.coins += target_mission["reward_coins"]
    current_user.exp += target_mission["reward_exp"]
    
    # บันทึกว่ารับแล้ว
    claimed_list.append(mission_id)
    current_user.claimed_missions = json.dumps(claimed_list)
    
    db.commit()
    
    return {
        "message": f"ยินดีด้วย! คุณได้รับ {target_mission['reward_coins']} Coins และ {target_mission['reward_exp']} EXP",
        "new_coins": current_user.coins,
        "new_exp": current_user.exp
    }
