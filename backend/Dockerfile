# 1. เลือก Base Image เป็น Python เวอร์ชันล่าสุดที่เป็นแบบ slim (ประหยัดพื้นที่)
FROM python:3.9-slim

# 2. ตั้งค่า Working Directory ใน Container
WORKDIR /code

# 3. คัดลอกไฟล์ requirements.txt เข้าไปก่อนเพื่อติดตั้ง Library
# (ทำขั้นตอนนี้ก่อนคัดลอกโค้ดทั้งหมด เพื่อให้ Docker build ได้เร็วขึ้น)
COPY ./requirements.txt /code/requirements.txt

# 4. ติดตั้ง Library ต่างๆ
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# 5. คัดลอกโฟลเดอร์ app เข้าไปใน Container
COPY ./app /code/app

# 6. สั่งให้ FastAPI รันผ่าน Uvicorn
# --host 0.0.0.0 คือการอนุญาตให้เชื่อมต่อจากภายนอก Container ได้
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]