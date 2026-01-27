import os
from google import genai

def main():
    api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("❌ Missing GOOGLE_API_KEY or GEMINI_API_KEY")
        print('PowerShell ตัวอย่าง:')
        print('$env:GOOGLE_API_KEY="YOUR_API_KEY"')
        return

    client = genai.Client(api_key=api_key)

    models = sorted([m.name for m in client.models.list()])
    for name in models:
        print(name)

if __name__ == "__main__":
    main()
