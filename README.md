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
