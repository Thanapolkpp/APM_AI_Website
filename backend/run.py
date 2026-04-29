import uvicorn
import os

if __name__ == "__main__":
    # ดึง Port จาก Render (Default เป็น 8000 ถ้าไม่มี)
    port = int(os.environ.get("PORT", 8000))
    # รันแอปโดยผูกกับ 0.0.0.0 เพื่อให้โลกภายนอกเข้าถึงได้
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=False)
