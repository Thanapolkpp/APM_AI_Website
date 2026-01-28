from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.ai_service import get_ai_response

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    mode: str

@router.post("/chat")
async def chat_with_ai(request: ChatRequest):
    try:
        # ส่งทั้ง message และ mode ไปให้ ai_service
        return get_ai_response(request.message, request.mode)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))