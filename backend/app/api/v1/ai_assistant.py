from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.utils.db import get_db
from app.utils.security import get_current_user
from app.models.user import User
from app.models.todo import Todo
from app.models.study_sheet import StudySheet
from app.services import ai_service
import json
import re

router = APIRouter()

@router.get("/greeting")
async def get_ai_greeting(
    mode: str = "bro",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    1. AI Greeting: ทักทายตามเวลาและงานที่ค้างอยู่
    """
    # ดึงงานที่ค้างอยู่ 3 งานล่าสุดมาเป็น Context
    pending_tasks = db.query(Todo).filter(
        Todo.user_id == current_user.id, 
        Todo.is_completed == False
    ).order_by(Todo.created_at.desc()).limit(3).all()
    
    task_names = [t.task_text for t in pending_tasks]
    
    prompt = f"ทักทายผู้ใช้ชื่อ {current_user.username} ในโหมด {mode}. "
    if task_names:
        prompt += f"เขามีงานค้างสำคัญคือ: {', '.join(task_names)}. "
    else:
        prompt += "เขาทำงานเสร็จหมดแล้ว เยี่ยมมาก! "
    
    prompt += "ขอประโยคทักทายสั้นๆ 1-2 ประโยคที่เข้ากับบุคลิกโหมดนี้ (ห้ามเวิ่นเว้อ)"

    response = await ai_service.get_ai_response(prompt, mode)
    return response

@router.get("/todo-plan")
async def generate_todo_plan(
    goal: str = Query(..., description="เป้าหมายหลัก เช่น สอบพรุ่งนี้"),
    mode: str = "bro",
    current_user: User = Depends(get_current_user)
):
    """
    2. AI Smart Todo: ช่วยแตกย่อยงานจากเป้าหมายใหญ่
    """
    prompt = f"ผู้ใช้ต้องการ: '{goal}' ช่วยวางแผนย่อยที่ต้องทำจริง 3-5 ข้อให้หน่อย. "
    prompt += "ตอบกลับเป็น JSON array ของ string เท่านั้น เช่น ['ทำข้อ 1', 'ทำข้อ 2']. ห้ามมีคำนำหรือสรุป"
    
    response = await ai_service.get_ai_response(prompt, mode)
    
    try:
        text = response.get("reply", "")
        match = re.search(r'\[.*\]', text, re.DOTALL)
        if match:
            tasks = json.loads(match.group())
            return {"tasks": tasks}
    except Exception:
        pass
        
    return {"tasks": []}

@router.get("/study-sheets/{sheet_id}/quiz")
async def generate_sheet_quiz(
    sheet_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    3. AI Quiz Generator: สร้างข้อสอบจากเนื้อหาในชีท
    """
    sheet = db.query(StudySheet).filter(StudySheet.id == sheet_id).first()
    if not sheet:
        raise HTTPException(status_code=404, detail="ไม่พบชีทนี้")
    
    content = sheet.extracted_text or "ไม่มีเนื้อหาในไฟล์นี้"
    
    prompt = f"สร้างข้อสอบปรนัย (MCQ) 5 ข้อ จากเนื้อหานี้: {content[:3500]}. "
    prompt += "ตอบกลับเป็น JSON array เท่านั้น: [{'question': '...', 'options': ['A','B','C','D'], 'answer': 0}]. answer คือเลข index (0-3)"
    
    response = await ai_service.get_ai_response(prompt, "nerd")
    
    try:
        text = response.get("reply", "")
        match = re.search(r'\[.*\]', text, re.DOTALL)
        if match:
            quiz = json.loads(match.group())
            return {"quiz": quiz}
    except Exception:
        pass
        
    return {"quiz": []}
