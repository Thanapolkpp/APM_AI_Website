from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Request
from pydantic import BaseModel
import asyncio
import os
import tempfile
from fastapi.responses import StreamingResponse
from app.services.ai_service import call_ollama_stream, get_ai_response, get_ai_response_with_image, get_ai_response_with_pdf
from slowapi import Limiter
from slowapi.util import get_remote_address
import fitz
import io

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

MAX_IMAGE_SIZE = 10 * 1024 * 1024  # 10 MB
MAX_PDF_SIZE = 25 * 1024 * 1024    # 25 MB

# ---------- 1. ระบบแชทปกติ (ไม่มีรูป) ----------
class ChatRequest(BaseModel):
    message: str
    mode: str

@router.post("/chat")
@limiter.limit("30/minute")
async def chat(request: Request, req: ChatRequest):
    result = await get_ai_response(req.message, req.mode) 
    
    if isinstance(result, dict) and "reply" in result:
        return {"reply": str(result["reply"])}
    return {"reply": str(result)}


# ---------- 2. ระบบแชทพร้อมรูปภาพ ----------
@router.post("/chat-with-image")
@limiter.limit("20/minute")
async def chat_with_image(
    request: Request,
    prompt: str = Form(...),
    mode: str = Form("bro"),
    file: UploadFile = File(None)
):
    image_data = None
    if file:
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="ไฟล์ที่ส่งมาไม่ใช่รูปภาพ")
        image_data = await file.read()
        if len(image_data) > MAX_IMAGE_SIZE:
            raise HTTPException(status_code=413, detail="รูปภาพใหญ่เกิน 10 MB")

    result = await get_ai_response_with_image(prompt, mode, image_data)

    if isinstance(result, dict) and "reply" in result:
        return {"reply": str(result["reply"])}
    return {"reply": str(result)}

@router.post("/chat-with-image/stream")
@limiter.limit("20/minute")
async def chat_with_image_stream(
    request: Request,
    prompt: str = Form(...),
    mode: str = Form("bro"),
    file: UploadFile = File(None)
):
    image_data = None
    if file:
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="ไฟล์ที่ส่งมาไม่ใช่รูปภาพ")
        image_data = await file.read()
        if len(image_data) > MAX_IMAGE_SIZE:
            raise HTTPException(status_code=413, detail="รูปภาพใหญ่เกิน 10 MB")

    return StreamingResponse(call_ollama_stream(prompt, mode, image_data), media_type="text/plain")


# ---------- 3. ระบบแชทพร้อม PDF ----------
@router.post("/chat-with-pdf")
@limiter.limit("15/minute")
async def chat_with_pdf(
    request: Request,
    prompt: str = Form(...),
    mode: str = Form("bro"),
    file: UploadFile = File(...)
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="ไฟล์ที่ส่งมาไม่ใช่ PDF")
    
    pdf_data = await file.read()
    if len(pdf_data) > MAX_PDF_SIZE:
        raise HTTPException(status_code=413, detail="ไฟล์ PDF ใหญ่เกิน 25 MB")
    
    result = await get_ai_response_with_pdf(prompt, mode, pdf_data)

    if isinstance(result, dict) and "reply" in result:
        return {"reply": str(result["reply"])}
    return {"reply": str(result)}

@router.post("/chat-with-pdf/stream")
@limiter.limit("15/minute")
async def chat_with_pdf_stream(
    request: Request,
    prompt: str = Form(...),
    mode: str = Form("bro"),
    file: UploadFile = File(...)
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="ไฟล์ที่ส่งมาไม่ใช่ PDF")
    
    pdf_data = await file.read()
    if len(pdf_data) > MAX_PDF_SIZE:
        raise HTTPException(status_code=413, detail="ไฟล์ PDF ใหญ่เกิน 25 MB")
    
    # สกัดข้อความจาก PDF แบบ Non-blocking
    def extract_text(data):
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp.write(data)
            path = tmp.name
        try:
            import fitz
            doc = fitz.open(path)
            text = "".join([page.get_text() for page in doc])
            doc.close()
            return text
        finally:
            if os.path.exists(path):
                os.remove(path)

    try:
        pdf_text_raw = await asyncio.to_thread(extract_text, pdf_data)
        pdf_text = pdf_text_raw[:8000]
        
        final_prompt = f"{prompt}\n\n[เนื้อหาจาก PDF]\n{pdf_text}"
        return StreamingResponse(call_ollama_stream(final_prompt, mode), media_type="text/plain")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"เกิดข้อผิดพลาดในการประมวลผล PDF: {str(e)}")


