# APM AI Assistant 

## 0) Requirements (ต้องมี)

```bash
docker --version
docker compose version
git --version
ollama --version
```

---

## 1) Clone Project

```bash
git clone https://github.com/Thanapolkpp/APM_AI_Website.git
cd APM_AI_Website
```

---

## 2) Setup Ollama (Local LLM)

### 2.1 Pull โมเดล Gemma 3

```bash
ollama pull gemma3
```

### 2.2 เปิด Ollama Service

```bash
ollama serve
```

### 2.3 เช็คว่าโมเดลพร้อมใช้งาน

```bash
curl http://localhost:11434/api/tags
```

---

## 3) Run Project (Docker Compose)

### 3.1 Build + Run

```bash
docker compose up --build
```

### 3.2 Run แบบ Background

```bash
docker compose up --build -d
```

### 3.3 ดูสถานะ Container

```bash
docker compose ps
```

### 3.4 ดู Logs

```bash
docker compose logs -f
```

### 3.5 ปิดระบบ

```bash
docker compose down
```

---

## 4) URLs เข้าใช้งาน

Frontend

```txt
http://localhost:5173
```

Backend

```txt
http://localhost:8000
```

Swagger Docs

```txt
http://localhost:8000/docs
```

Ollama API

```txt
http://localhost:11434
```

---

## 5) Troubleshoot Commands

### Frontend เข้าไม่ได้ (เช็ค container)

```bash
docker compose ps
```

### Backend ต่อ Ollama ไม่ได้ (เปิด Ollama ใหม่)

```bash
ollama serve
```

### เช็ค Ollama อีกครั้ง

```bash
curl http://localhost:11434/api/tags
```

### ถ้าแก้โค้ดแล้วไม่อัปเดต (Rebuild)

```bash
docker compose down
docker compose up --build
```


