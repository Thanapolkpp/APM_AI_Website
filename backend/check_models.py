# backend/check_models.py
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    print("API Key not found in .env file")
else:
    print(f"API Key found: {api_key[:5]}...")
    genai.configure(api_key=api_key)

    print("\nSearching for available AI models...")
    try:
        count = 0
        for m in genai.list_models():
            if "generateContent" in m.supported_generation_methods:
                print(f"- {m.name}")
                count += 1

        if count == 0:
            print("No chat-capable models found (you may need to create a new API key)")
    except Exception as e:
        print(f"An error occurred: {e}")
