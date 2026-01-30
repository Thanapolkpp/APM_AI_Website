📌 APM AI Assistant — README (Local Run Guide)

โปรเจกต์นี้คือระบบ AI Assistant สำหรับนิสิต Gen Z ที่ใช้งานในรูปแบบ Chatbot
รองรับโหมด AI หลายสไตล์ และรันโมเดลแบบ Local ผ่าน Ollama เพื่อความเป็นส่วนตัว

✅ Requirements

ติดตั้งสิ่งเหล่านี้ก่อน

Docker + Docker Compose

Git

Node.js (ถ้าจะรัน Frontend แบบไม่ใช้ Docker)

Python 3.10+ (ถ้าจะรัน Backend แบบไม่ใช้ Docker)

Ollama

✅ 1) Clone Project
git clone https://github.com/Thanapolkpp/APM_AI_Website.git
cd APM_AI_Website

✅ 2) Setup Ollama (Run AI Model Local)
2.1 ติดตั้ง Ollama

ดาวน์โหลด Ollama แล้วติดตั้งให้เรียบร้อย

2.2 Pull โมเดล (ตัวอย่าง Gemma)
ollama pull gemma3

2.3 เปิด Ollama Service
ollama serve


Ollama จะเปิด API โดยปกติที่
http://localhost:11434

✅ 3) Run ด้วย Docker Compose (แนะนำ)
3.1 Build + Run ทุกอย่าง
docker compose up --build


หรือถ้าจะรันแบบ background

docker compose up --build -d

3.2 ปิดระบบ
docker compose down

✅ 4) URLs ที่ใช้เข้าใช้งาน

เมื่อรันสำเร็จแล้วจะเข้าได้ประมาณนี้

Frontend (React):
http://localhost:5173

Backend (FastAPI):
http://localhost:8000

API Docs (Swagger):
http://localhost:8000/docs

Ollama API:
http://localhost:11434

✅ 5) ตัวอย่างการเช็คว่า Ollama ใช้งานได้จริง

ลองยิง API ดู

curl http://localhost:11434/api/tags


ถ้าแสดงรายชื่อ model = ใช้ได้

✅ 6) วิธีใช้งาน AI Assistant

ในหน้าเว็บจะมีช่องแชทให้พิมพ์คำถาม
ตัวอย่างสิ่งที่สั่งได้

🧠 คุยปรึกษา / ระบายความเครียด

“ช่วงนี้เครียดมาก ทำไงดี”

“รู้สึกไม่มีแรงทำอะไรเลย”

📅 ช่วยจัดตารางอ่านหนังสือ

“ช่วยทำตารางอ่าน Final 7 วันให้หน่อย”

“มีสอบวันศุกร์ ช่วยจัดลำดับให้อ่านอะไรบ้าง”

✅ แบ่งงานโปรเจกต์เป็น Task ย่อย

“ต้องทำเว็บส่งอาจารย์ใน 3 วัน ช่วยแตก task ให้ที”

“โปรเจกต์ใหญ่เกิน ไม่รู้เริ่มตรงไหน”

✅ 7) โหมด AI ที่รองรับ

ระบบมี 3 โหมดหลัก

💪 Bro Mode

เพื่อนผู้ชายตรงๆ คุยง่าย ให้กำลังใจแบบจริงใจ

🌸 Cute Girl Mode

โทนอบอุ่น น่ารัก เหมาะกับเวลาต้องการ safe zone

🤓 Nerd Mode

โหมดจริงจัง เน้นความรู้ เทคนิค อธิบายแบบเป็นระบบ

✅ 8) Troubleshoot (ปัญหาที่พบบ่อย)
❌ Frontend เข้าไม่ได้

เช็คว่า Vite รันอยู่ไหม / หรือ container รันอยู่ไหม

docker compose ps

❌ Backend ต่อ Ollama ไม่ได้

เช็คว่า Ollama serve อยู่หรือยัง

ollama serve


แล้วลอง

curl http://localhost:11434/api/tags

❌ Docker Run แล้ว Error Port ซ้ำ

ถ้ามีโปรแกรมอื่นใช้ port ชนกันให้ปิดก่อน หรือเปลี่ยน port ใน docker-compose.yml

✅ 9) Tech Stack

AI Model: Gemma 3 (ผ่าน Ollama)

Backend: FastAPI + Uvicorn

Frontend: React + Vite

Tools: Docker / Docker Compose, GitHub, Postman, VS Code

✅ 10) Credits / Source

โปรเจกต์นี้ถูกออกแบบเพื่อใช้ในธีม
AI for Gen Z Lifestyle @KU 

KU_AI

ถ้าแป้งงอยากให้เราปรับ README ให้เป็นแบบ “พร้อมวางใน GitHub” แบบเป๊ะๆ (ใส่โครงสร้างโฟลเดอร์ + env ตัวอย่าง + docker-compose template) บอกได้เลย เดี๋ยวจัดให้ครบเลย

Sources
https://github.com/Thanapolkpp/APM_AI_Website

ได้เลยแป้งง นี่คือ README แบบ “พร้อมวางใน GitHub” สำหรับ repo นี้
https://github.com/Thanapolkpp/APM_AI_Website

(โฟกัสให้คนอื่นเอาไปรันเองง่ายที่สุด) 

KU_AI

APM AI Assistant for Personal Motivation

AI Assistant สำหรับนิสิต Gen Z ใช้งานแบบ Chatbot เพื่อช่วย

เป็นพื้นที่ปลอดภัยในการปรึกษาและระบายความเครียด

ช่วยวางแผนเวลา / จัดลำดับความสำคัญของงาน

แตก Task งานใหญ่ให้กลายเป็นงานย่อยแบบทำตามได้จริง

รองรับการรันโมเดลแบบ Local ผ่าน Ollama + Gemma 3 เพื่อความเป็นส่วนตัว 

KU_AI

Features

💬 Conversational AI (Chatbot)

🔒 Local LLM ผ่าน Ollama (ลดการพึ่ง Cloud)

🧠 3 โหมดการตอบ

Bro Mode เพื่อนผู้ชายตรงๆ ให้กำลังใจ

Cute Girl Mode โทนอบอุ่น น่ารัก

Nerd Mode อธิบายแบบมีเหตุผลเป็นระบบ

⚡ Frontend: React + Vite

🚀 Backend: FastAPI

🐳 Run ง่ายด้วย Docker / Docker Compose

Tech Stack

Frontend: React + Vite

Backend: FastAPI + Uvicorn

LLM Local: Ollama + Gemma 3

Dev Tools: Docker, Docker Compose, Git, Postman, VS Code 

KU_AI

Requirements

ติดตั้งก่อนใช้งาน

Docker + Docker Compose

Git

Ollama

แนะนำให้มี

Node.js (ถ้าจะรัน frontend แบบไม่ใช้ docker)

Python 3.10+ (ถ้าจะรัน backend แบบไม่ใช้ docker)

1) Clone Project
git clone https://github.com/Thanapolkpp/APM_AI_Website.git
cd APM_AI_Website

2) Setup Ollama (Local Model)
2.1 ติดตั้ง Ollama

ติดตั้ง Ollama ให้เรียบร้อยก่อน

2.2 Pull โมเดล (Gemma 3)
ollama pull gemma3

2.3 เปิด Ollama Service
ollama serve


Ollama API จะอยู่ที่

http://localhost:11434


เช็คว่ามีโมเดลจริงไหม

curl http://localhost:11434/api/tags

3) Run Project ด้วย Docker Compose (แนะนำสุด)

สั่งรันทั้งหมด

docker compose up --build


รันแบบ background

docker compose up --build -d


หยุดการทำงาน

docker compose down

4) เข้าใช้งานระบบ

หลังรันสำเร็จจะเข้าได้ประมาณนี้

Frontend (React):

http://localhost:5173

Backend (FastAPI):

http://localhost:8000

Swagger API Docs:

http://localhost:8000/docs

Ollama API:

http://localhost:11434

5) วิธีใช้งาน AI Assistant

เปิดเว็บแล้วพิมพ์ข้อความในแชทได้เลย

ตัวอย่างคำสั่งที่ใช้ได้

🧠 ปรึกษา / ระบายความรู้สึก

“ช่วงนี้เครียดมาก ทำไงดี”

“รู้สึกหมดไฟเลย”

📅 ช่วยจัดตารางอ่านหนังสือ

“ช่วยทำตารางอ่านสอบ 7 วันให้หน่อย”

“มีสอบวันศุกร์ ช่วยวางแผนอ่านให้ทันที”

✅ แตกงานโปรเจกต์เป็น Task

“ต้องทำเว็บส่งอาจารย์ใน 3 วัน ช่วยแตกงานให้หน่อย”

“มีโปรเจกต์ใหญ่ ไม่รู้เริ่มตรงไหน”

6) Troubleshoot
ปัญหา 1: Backend ต่อ Ollama ไม่ได้

เช็คว่า Ollama เปิดอยู่ไหม

ollama serve


แล้วเช็คโมเดล

curl http://localhost:11434/api/tags

ปัญหา 2: Port ชนกัน (รันไม่ได้)

เช็คว่า port ถูกใช้อยู่ไหม แล้วเปลี่ยนใน docker-compose.yml

ปัญหา 3: Docker ไม่อัปเดตโค้ด

ลอง rebuild ใหม่

docker compose down
docker compose up --build
