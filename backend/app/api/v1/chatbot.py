from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from app.services.ai_service import get_ai_response, get_ai_response_with_image

router = APIRouter()

# ---------- TEXT CHAT ----------
class ChatRequest(BaseModel):
    message: str
    mode: str

@router.post("/chat")
def chat(req: ChatRequest):
    return get_ai_response(req.message, req.mode)  # ต้อง return {"reply": "..."} เท่านั้น


# ---------- IMAGE CHAT ----------
@router.post("/chat-with-image")
async def chat_with_image(
    prompt: str = Form(""),
    mode: str = Form("bro"),
    file: UploadFile = File(None)
):
    image_data = None

    if file:
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="ไฟล์ที่ส่งมาไม่ใช่รูปภาพ")
        image_data = await file.read()

    result = await get_ai_response_with_image(prompt, mode, image_data)

    # ✅ บังคับให้ reply เป็น string กันพัง
    if isinstance(result, dict) and "reply" in result:
        return {"reply": str(result["reply"])}

    return {"reply": str(result)}
