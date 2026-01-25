import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv

# Load API Key
load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")

# Configure Gemini
if API_KEY:
    genai.configure(api_key=API_KEY)
    model = genai.GenerativeModel("gemini-2.5-flash")
else:
    print("Warning: API Key not found")

app = FastAPI()

# Enable CORS (allow all origins)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (fix CORS blocked issues)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

@app.post("/api/chat")
async def chat_with_ai(request: ChatRequest):
    try:
        if not API_KEY:
            return {"reply": "Sorry, the system API key is not configured yet."}

        response = model.generate_content(request.message)
        return {"reply": response.text}

    except Exception as e:
        print(f"Error: {e}")
        # Return error to frontend
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def read_root():
    return {"status": "Backend is running OK!"}
