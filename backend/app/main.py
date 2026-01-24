# “ศูนย์ควบคุม” ของ backend
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv

# โหลด API Key
load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")

# ตั้งค่า Gemini
if API_KEY:
    genai.configure(api_key=API_KEY)
    model = genai.GenerativeModel('gemini-2.5-flash')
else:
    print("⚠️ Warning: ไม่เจอ API Key")

app = FastAPI()

# ----------------------------------------------------
# 👇 จุดที่แก้: ตั้งค่า CORS ให้ยอมรับ Frontend (localhost:5173)
# ----------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # อนุญาตทุกเว็บ (แก้ปัญหา CORS Blocked)
    allow_credentials=True,
    allow_methods=["*"],  # อนุญาตทุกคำสั่ง (GET, POST, etc.)
    allow_headers=["*"],
)
# ----------------------------------------------------

class ChatRequest(BaseModel):
    message: str

@app.post("/api/chat")
async def chat_with_ai(request: ChatRequest):
    try:
        if not API_KEY:
            return {"reply": "ขอโทษครับ ระบบยังไม่ใส่ API Key"}
            
        response = model.generate_content(request.message)
        return {"reply": response.text}
    except Exception as e:
        print(f"Error: {e}")
        # ส่ง Error กลับไปบอก Frontend ด้วย
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def read_root():
    return {"status": "Backend is running OK!"}