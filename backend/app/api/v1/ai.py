from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.services.ai_service import get_ai_response_with_image

router = APIRouter()

@router.post("/chat-with-image")
async def chat_image(
    prompt: str = Form(...),
    file: UploadFile = File(None)
):
    image_data = None

    if file:
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="ไฟล์ที่ส่งมาไม่ใช่รูปภาพ")

        image_data = await file.read()

    result = await get_ai_response_with_image(prompt, image_data)

    # ✅ กันพัง: ให้ reply เป็น string เท่านั้น
    if isinstance(result, dict) and "reply" in result:
        return {"reply": str(result["reply"])}
    return {
        "status": "success",
        "reply": str(result["reply"]) if isinstance(result, dict) else str(result)
    }
