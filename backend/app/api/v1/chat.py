from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

from app.utils.db import get_db
from app.utils.security import get_current_user
from app.models.chat_history import ChatHistory
from app.models.study_sheet import StudySheet
from app.models.user import User
from app.services.ai_service import get_ai_response

router = APIRouter()

HISTORY_CONTEXT_COUNT = 3


class ChatRequest(BaseModel):
    message: str
    mode: str
    sheet_ids: List[int] = []


@router.get("/history")
def get_chat_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    histories = (
        db.query(ChatHistory)
        .filter(ChatHistory.user_id == current_user.id)
        .order_by(ChatHistory.created_at.desc())
        .limit(HISTORY_CONTEXT_COUNT)
        .all()
    )
    # เรียงจากเก่า → ใหม่ เพื่อให้ frontend แสดงเป็น chat bubble ได้เลย
    histories = list(reversed(histories))
    return [
        {
            "id": h.id,
            "user_message": h.user_message,
            "ai_response": h.ai_response,
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

    # ดึง 3 บทสนทนาล่าสุดของ user นี้
    recent_histories = (
        db.query(ChatHistory)
        .filter(ChatHistory.user_id == current_user.id)
        .order_by(ChatHistory.created_at.desc())
        .limit(HISTORY_CONTEXT_COUNT)
        .all()
    )
    recent_histories = list(reversed(recent_histories))

    # ประกอบ context จากประวัติ
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
    )
    db.add(new_history)
    db.commit()

    return {"reply": ai_reply}
