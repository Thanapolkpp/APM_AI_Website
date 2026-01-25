# AI Study Planner (Ai_for_gen_z)

โปรเจกต์เว็บไซต์เกี่ยวกับ AI สำหรับช่วยวางแผนการเรียน  
เช่น การสร้างตารางเวลา การแบ่งเวลาเรียน และแนวทางการเรียนที่เหมาะสมกับผู้ใช้  

โปรเจกต์นี้พัฒนาโดยแยก **Frontend (React + Vite)** และ **Backend (FastAPI)**  
และใช้ **Docker + Docker Compose** เพื่อจัดการระบบทั้งหมด

---

## 📦 Tech Stack
- Frontend: React, Vite
- Backend: FastAPI (Python)
- Container: Docker, Docker Compose
- Version Control: Git, GitHub

---

## 📁 Project Structure
Ai_for_gen_z/
├── backend/
│ ├── app/
│ ├── requirements.txt
│ └── Dockerfile
│
├── frontend/
│ ├── src/
│ ├── package.json
│ └── Dockerfile
│
├── docker-compose.yml
└── README.md


---

## 🚀 วิธีรันโปรเจกต์ด้วย Docker
ต้องติดตั้ง
- Docker
- Docker Compose

รันคำสั่งจากโฟลเดอร์หลักของโปรเจกต์

```bash
docker compose up --build

หยุดการทำงาน
docker compose down

🔀 Git Branch Workflow

การใช้ Branch ช่วยให้สามารถพัฒนาแต่ละฟีเจอร์แยกจากกัน
โดยไม่กระทบกับโค้ดหลัก (main branch)

📌 ดู branch ทั้งหมด
git branch

🌱 สร้าง branch ใหม่
git branch feature-planner

🔄 เปลี่ยนไปใช้งาน branch ที่สร้าง
git checkout feature-planner


หรือแบบคำสั่งเดียว

git checkout -b feature-planner

🛠 ทำงานและ commit บน branch
git add .
git commit -m "Add planner feature"

⬆️ push branch ขึ้น GitHub
git push origin feature-planner

🔁 กลับไปที่ main branch
git checkout main

🔗 merge branch เข้ากับ main
git merge feature-planner

🗑 ลบ branch (หลัง merge แล้ว)

ลบในเครื่อง

git branch -d feature-planner


ลบบน GitHub

git push origin --delete feature-planner

🌱 สร้าง branch develop

ต้องอยู่ที่ branch main ก่อน

git checkout main
git pull origin main


จากนั้นสร้างและสลับไปที่ develop

git checkout -b develop

⬆️ push develop ขึ้น GitHub
git push -u origin develop


คำสั่ง -u จะผูก branch นี้กับ remote
ครั้งต่อไปแค่ git push ก็พอ



เกี่ยวกับ Backend
ึคำสั่ง run test backend:    python -m uvicorn app.main:app --reload