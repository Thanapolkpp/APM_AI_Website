from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.utils.db import get_db
from app.utils.security import get_current_user
from app.models.chat_history import ChatHistory
from app.models.user import User
from app.services.ai_service import get_ai_response

router = APIRouter()

HISTORY_CONTEXT_COUNT = 3


class ChatRequest(BaseModel):
    message: str
    mode: str


@router.post("/")
def chat(
    req: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # ดึง 3 บทสนทนาล่าสุดของ user นี้
    recent_histories = (
        db.query(ChatHistory)
        .filter(ChatHistory.user_id == current_user.id)
        .order_by(ChatHistory.created_at.desc())
        .limit(HISTORY_CONTEXT_COUNT)
        .all()
    )

    # เรียงจากเก่า → ใหม่ เพื่อใส่ context ตามลำดับเวลา
    recent_histories = list(reversed(recent_histories))

    # ประกอบ context จากประวัติ
    context_lines = []
    for h in recent_histories:
        context_lines.append(f"User: {h.user_message}")
        context_lines.append(f"AI: {h.ai_response}")

    context_block = "\n".join(context_lines)

    # ประกอบ prompt สุดท้าย
    if context_block:
        prompt_with_context = (
            f"[บทสนทนาก่อนหน้า]\n{context_block}\n\n"
            f"[คำถามปัจจุบัน]\n{req.message}"
        )
    else:
        prompt_with_context = req.message

    # เรียก AI
    result = get_ai_response(prompt_with_context, req.mode)
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
