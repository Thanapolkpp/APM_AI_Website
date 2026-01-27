from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.services.ai_service import get_ai_response_with_image

router = APIRouter()

@router.post("/chat-with-image")
async def chat_image(
    prompt: str = Form(...),            # รับข้อความจากช่องแชท
    file: UploadFile = File(None)       # รับไฟล์รูปภาพ (ถ้ามี)
):
    image_data = None
    
    # ถ้ามีการส่งรูปภาพมาด้วย
    if file:
        # ตรวจสอบว่าเป็นไฟล์รูปภาพหรือไม่
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="ไฟล์ที่ส่งมาไม่ใช่รูปภาพ")
        
        image_data = await file.read()

    # ส่งไปให้ service ประมวลผล
    result = await get_ai_response_with_image(prompt, image_data)
    
    return {"status": "success", "response": result}