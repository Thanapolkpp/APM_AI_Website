from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserProfile, UserUpdate
from app.api.v1.auth import get_current_active_user
import json

router = APIRouter()

@router.get("/me", response_model=UserProfile)
async def get_my_profile(current_user: User = Depends(get_current_active_user)):
    return current_user

@router.patch("/coins")
async def update_user_coins(payload: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    amount = payload.get("amount", 0)
    current_user.coins += amount
    db.commit()
    return {"message": "Coins updated", "new_balance": current_user.coins}

@router.patch("/exp")
async def update_user_exp(payload: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    amount = payload.get("amount", 0)
    current_user.exp += amount
    db.commit()
    return {"message": "EXP updated", "new_exp": current_user.exp}

@router.get("/special-missions")
async def get_special_missions(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    # Calculate progress for special missions dynamically
    # Mission 1: Study for 50 hours
    reading_hours = (current_user.reading_time_minutes or 0) / 60
    m1_progress = min(100, (reading_hours / 50) * 100)
    
    # Mission 2: Complete 10 tasks (todos)
    from app.models.todo import Todo
    completed_tasks = db.query(Todo).filter(Todo.user_id == current_user.id, Todo.is_completed == True).count()
    m2_progress = min(100, (completed_tasks / 10) * 100)
    
    # Mission 3: Own 3 avatars
    # Assuming inventory tracks owned avatars
    from app.models.inventory import Inventory
    owned_avatars = db.query(Inventory).filter(Inventory.user_id == current_user.id, Inventory.item_type == "avatar").count()
    m3_progress = min(100, (owned_avatars / 3) * 100)

    # Mission 4: Own 4 rooms
    owned_rooms = db.query(Inventory).filter(Inventory.user_id == current_user.id, Inventory.item_type == "room").count()
    m4_progress = min(100, (owned_rooms / 4) * 100)

    # Check claimed status
    claimed = []
    if current_user.claimed_missions:
        try:
            claimed = json.loads(current_user.claimed_missions)
        except:
            claimed = []

    missions = [
        {
            "id": 1,
            "title": "Master of Focus",
            "description": "Study for 50 hours total",
            "progress": round(m1_progress, 1),
            "current": round(reading_hours, 1),
            "target": 50,
            "unit": "Hours",
            "reward_coins": 500,
            "reward_exp": 1000,
            "is_claimed": 1 in claimed
        },
        {
            "id": 2,
            "title": "Task Conqueror",
            "description": "Complete 10 private or social tasks",
            "progress": m2_progress,
            "current": completed_tasks,
            "target": 10,
            "unit": "Tasks",
            "reward_coins": 200,
            "reward_exp": 500,
            "is_claimed": 2 in claimed
        },
        {
            "id": 3,
            "title": "Avatar Collector",
            "description": "Unlock 3 different avatars",
            "progress": m3_progress,
            "current": owned_avatars,
            "target": 3,
            "unit": "Avatars",
            "reward_coins": 300,
            "reward_exp": 600,
            "is_claimed": 3 in claimed
        },
        {
            "id": 4,
            "title": "Room Designer",
            "description": "Unlock 4 different backgrounds",
            "progress": m4_progress,
            "current": owned_rooms,
            "target": 4,
            "unit": "Rooms",
            "reward_coins": 400,
            "reward_exp": 800,
            "is_claimed": 4 in claimed
        }
    ]
    return missions

@router.post("/claim-mission/{mission_id}")
async def claim_mission(mission_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    missions = await get_special_missions(db, current_user)
    target_mission = next((m for m in missions if m["id"] == mission_id), None)
    
    if not target_mission:
        raise HTTPException(status_code=404, detail="ไม่พบภารกิจนี้")
    
    if target_mission["is_claimed"]:
        raise HTTPException(status_code=400, detail="คุณรับรางวัลไปแล้วจ้า")
    
    if target_mission["progress"] < 100:
        raise HTTPException(status_code=400, detail="ภารกิจยังไม่สำเร็จจ้า")

    # Grant rewards
    current_user.coins += target_mission["reward_coins"]
    current_user.exp += target_mission["reward_exp"]
    
    # Update claimed list
    claimed_list = []
    if current_user.claimed_missions:
        try:
            claimed_list = json.loads(current_user.claimed_missions)
        except:
            claimed_list = []
            
    if mission_id not in claimed_list:
        claimed_list.append(mission_id)
        current_user.claimed_missions = json.dumps(claimed_list)
    
    db.commit()
    return {"message": f"สำเร็จ! คุณได้รับ {target_mission['reward_coins']} เหรียญ และ {target_mission['reward_exp']} XP", "new_coins": current_user.coins, "new_exp": current_user.exp}

@router.post("/add-reading-time")
async def add_reading_time(payload: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    minutes = payload.get("minutes", 0)
    current_user.reading_time_minutes = (current_user.reading_time_minutes or 0) + minutes
    db.commit()
    return {"message": "Reading time updated", "total_minutes": current_user.reading_time_minutes}

@router.get("/leaderboard")
async def get_leaderboard(db: Session = Depends(get_db)):
    # Returns top users by EXP
    users = db.query(User).order_by(User.exp.desc()).limit(10).all()
    
    leaderboard = []
    for u in users:
        leaderboard.append({
            "username": u.username,
            "exp": u.exp,
            "coins": u.coins,
            "equipped_avatar": u.equipped_avatar
        })
    return leaderboard
