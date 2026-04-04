from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional

from app.utils.db import get_db
from app.utils.security import get_current_user
from app.models.chat_history import ChatHistory
from app.models.study_sheet import StudySheet
from app.models.user import User
from app.services.ai_service import get_ai_response

router = APIRouter()

HISTORY_CONTEXT_COUNT = 3

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    mode: str
    sheet_ids: List[int] = []
    context_history_id: Optional[int] = None
    conversation_history: Optional[List[ChatMessage]] = None


@router.get("/history")
def get_chat_history(
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    histories = (
        db.query(ChatHistory)
        .filter(ChatHistory.user_id == current_user.id)
        .order_by(ChatHistory.created_at.desc())
        .limit(limit)
        .all()
    )
    # เรียงจากเก่า → ใหม่ เพื่อให้ frontend แสดงเป็น chat bubble ได้เลย
    histories = list(reversed(histories))
    return [
        {
            "id": h.id,
            "user_message": h.user_message,
            "ai_response": h.ai_response,
            "mode": h.mode,
            "created_at": h.created_at,
        }
        for h in histories
    ]


@router.post("/")
def chat(
    req: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # ดึง extracted_text จาก study sheets ที่เลือก (เฉพาะของ user นี้)
    pdf_context_block = ""
    if req.sheet_ids:
        sheets = (
            db.query(StudySheet)
            .filter(
                StudySheet.user_id == current_user.id,
                StudySheet.id.in_(req.sheet_ids)
            )
            .all()
        )
        pdf_parts = []
        for sheet in sheets:
            if sheet.extracted_text:
                pdf_parts.append(f"[เอกสาร: {sheet.title}]\n{sheet.extracted_text}")
        if pdf_parts:
            pdf_context_block = "\n\n".join(pdf_parts)

    # กำหนด context จาก History
    history_block = ""
    if req.conversation_history is not None:
        # ใช้ History สดๆ จากหน้าจอ Frontend เลย!
        context_lines = []
        for msg in req.conversation_history[-HISTORY_CONTEXT_COUNT*2:]: # จำกัดเพื่อไม่ให้ prompt ยาวไป
            role_label = "User" if msg.role == "user" else "AI"
            context_lines.append(f"{role_label}: {msg.content}")
        history_block = "\n".join(context_lines)
    else:
        # Fallback (ดึงบทสนทนาที่จะนำมาทำ Context จาก DB)
        if req.context_history_id:
            target_history = (
                db.query(ChatHistory)
                .filter(ChatHistory.id == req.context_history_id, ChatHistory.user_id == current_user.id)
                .first()
            )
            recent_histories = [target_history] if target_history else []
        else:
            recent_histories = (
                db.query(ChatHistory)
                .filter(ChatHistory.user_id == current_user.id)
                .order_by(ChatHistory.created_at.desc())
                .limit(HISTORY_CONTEXT_COUNT)
                .all()
            )
            recent_histories = list(reversed(recent_histories))

        # ประกอบ context จากประวัติ DB
        context_lines = []
        for h in recent_histories:
            context_lines.append(f"User: {h.user_message}")
            context_lines.append(f"AI: {h.ai_response}")
        history_block = "\n".join(context_lines)

    # ประกอบ prompt สุดท้าย
    prompt_parts = []

    if pdf_context_block:
        prompt_parts.append(f"[เนื้อหาจากเอกสารของคุณ]\n{pdf_context_block}")

    if history_block:
        prompt_parts.append(f"[บทสนทนาก่อนหน้า]\n{history_block}")

    prompt_parts.append(f"[คำถามปัจจุบัน]\n{req.message}")

    final_prompt = "\n\n".join(prompt_parts)

    # เรียก AI
    result = get_ai_response(final_prompt, req.mode)
    ai_reply = result.get("reply", "")

    # บันทึกบทสนทนาใหม่ลง DB
    new_history = ChatHistory(
        user_id=current_user.id,
        user_message=req.message,
        ai_response=ai_reply,
        mode=req.mode,
    )
    db.add(new_history)
    db.commit()

    # จำกัดประวัติแชท: ถ้าเกิน 4 ให้ลบตัวที่เก่าที่สุดออก
    MAX_HISTORY = 4
    current_count = db.query(ChatHistory).filter(ChatHistory.user_id == current_user.id).count()
    
    if current_count > MAX_HISTORY:
        # ดึงรายการที่เก่าที่สุดที่ต้องลบ (ปกติคืออันเดียวที่เพิ่งเกินมา)
        oldest_to_delete = (
            db.query(ChatHistory)
            .filter(ChatHistory.user_id == current_user.id)
            .order_by(ChatHistory.created_at.asc())
            .limit(current_count - MAX_HISTORY)
            .all()
        )
        for h in oldest_to_delete:
            db.delete(h)
        db.commit()

    return {"reply": ai_reply}

