from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from fastapi.responses import StreamingResponse
from app.services.ai_service import call_ollama_stream, get_ai_response, get_ai_response_with_image, get_ai_response_with_pdf
import fitz
import io

router = APIRouter()

# ---------- 1. ระบบแชทปกติ (ไม่มีรูป) ----------
class ChatRequest(BaseModel):
    message: str
    mode: str

@router.post("/chat")
async def chat(req: ChatRequest):
    result = await get_ai_response(req.message, req.mode) 
    
    if isinstance(result, dict) and "reply" in result:
        return {"reply": str(result["reply"])}
    return {"reply": str(result)}


# ---------- 2. ระบบแชทพร้อมรูปภาพ ----------
@router.post("/chat-with-image")
async def chat_with_image(
    prompt: str = Form(...),
    mode: str = Form("bro"),
    file: UploadFile = File(None)
):
    image_data = None
    if file:
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="ไฟล์ที่ส่งมาไม่ใช่รูปภาพ")
        image_data = await file.read()

    result = await get_ai_response_with_image(prompt, mode, image_data)

    if isinstance(result, dict) and "reply" in result:
        return {"reply": str(result["reply"])}
    return {"reply": str(result)}

@router.post("/chat-with-image/stream")
async def chat_with_image_stream(
    prompt: str = Form(...),
    mode: str = Form("bro"),
    file: UploadFile = File(None)
):
    image_data = None
    if file:
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="ไฟล์ที่ส่งมาไม่ใช่รูปภาพ")
        image_data = await file.read()

    return StreamingResponse(call_ollama_stream(prompt, mode, image_data), media_type="text/plain")


# ---------- 3. ระบบแชทพร้อม PDF ----------
@router.post("/chat-with-pdf")
async def chat_with_pdf(
    prompt: str = Form(...),
    mode: str = Form("bro"),
    file: UploadFile = File(...)
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="ไฟล์ที่ส่งมาไม่ใช่ PDF")
    
    pdf_data = await file.read()
    result = await get_ai_response_with_pdf(prompt, mode, pdf_data)

    if isinstance(result, dict) and "reply" in result:
        return {"reply": str(result["reply"])}
    return {"reply": str(result)}

@router.post("/chat-with-pdf/stream")
async def chat_with_pdf_stream(
    prompt: str = Form(...),
    mode: str = Form("bro"),
    file: UploadFile = File(...)
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="ไฟล์ที่ส่งมาไม่ใช่ PDF")
    
    pdf_data = await file.read()
    
    # สกัดข้อความจาก PDF
    try:
        doc = fitz.open(stream=pdf_data, filetype="pdf")
        pdf_text = "".join([page.get_text() for page in doc])
        pdf_text = pdf_text[:8000]
        doc.close()
        
        final_prompt = f"{prompt}\n\n[เนื้อหาจาก PDF]\n{pdf_text}"
        return StreamingResponse(call_ollama_stream(final_prompt, mode), media_type="text/plain")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"เกิดข้อผิดพลาดในการประมวลผล PDF: {str(e)}")


