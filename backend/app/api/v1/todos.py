import os
from uuid import uuid4
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.utils.db import get_db
from app.utils.security import get_current_user
from app.models.todo import Todo
from app.models.user import User

router = APIRouter()

UPLOAD_DIR = "uploads/proofs"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

class TodoCreate(BaseModel):
    task_text: str

class TodoVerify(BaseModel):
    status: str # "accepted" or "rejected"

@router.post("/")
def create_todo(
    body: TodoCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    new_todo = Todo(user_id=current_user.id, task_text=body.task_text)
    db.add(new_todo)
    db.commit()
    db.refresh(new_todo)
    return {
        "id": new_todo.id,
        "task_text": new_todo.task_text,
        "is_completed": new_todo.is_completed,
        "status": new_todo.status,
        "proof_image": new_todo.proof_image,
        "created_at": new_todo.created_at,
    }

@router.get("/")
def get_todos(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    todos = (
        db.query(Todo)
        .filter(Todo.user_id == current_user.id)
        .order_by(Todo.created_at.asc())
        .all()
    )
    return [
        {
            "id": t.id,
            "task_text": t.task_text,
            "is_completed": t.is_completed,
            "status": t.status,
            "proof_image": f"/uploads/proofs/{t.proof_image}" if t.proof_image else None,
            "created_at": t.created_at,
        }
        for t in todos
    ]

@router.put("/{todo_id}/toggle")
def toggle_todo(
    todo_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    todo = db.query(Todo).filter(Todo.id == todo_id, Todo.user_id == current_user.id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    todo.is_completed = not todo.is_completed
    if todo.is_completed:
        current_user.missions_done += 1
    else:
        # ป้องกัน missions_done ติดลบ เมื่อ un-toggle
        current_user.missions_done = max(0, current_user.missions_done - 1)
    db.commit()
    db.refresh(todo)
    return {
        "id": todo.id,
        "is_completed": todo.is_completed
    }
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}

@router.post("/{todo_id}/proof")
async def upload_todo_proof(
    todo_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    todo = db.query(Todo).filter(Todo.id == todo_id, Todo.user_id == current_user.id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")

    # Validate file extension
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"ประเภทไฟล์ไม่รองรับ รองรับเฉพาะ: {', '.join(ALLOWED_EXTENSIONS)}")

    # Validate file size (read into memory to check)
    file_bytes = await file.read()
    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="ไฟล์ใหญ่เกิน 10 MB")

    # Validate image magic bytes (prevent disguised files)
    MAGIC_BYTES = {
        b"\xff\xd8\xff": ".jpg",   # JPEG
        b"\x89PNG":       ".png",   # PNG
        b"GIF8":          ".gif",   # GIF
        b"RIFF":          ".webp",  # WebP (partial)
    }
    is_valid_image = any(file_bytes.startswith(sig) for sig in MAGIC_BYTES)
    if not is_valid_image:
        raise HTTPException(status_code=400, detail="ไฟล์ไม่ใช่รูปภาพที่ถูกต้อง")

    # Create user-specific directory
    user_proof_dir = os.path.join(UPLOAD_DIR, str(current_user.id))
    if not os.path.exists(user_proof_dir):
        os.makedirs(user_proof_dir)

    # Generate filename (safe, no user input in path)
    filename = f"{uuid4()}{file_ext}"
    file_path = os.path.join(user_proof_dir, filename)

    # Save validated file
    with open(file_path, "wb") as buffer:
        buffer.write(file_bytes)

    # Store relative path (e.g., "1/abc.jpg") in DB
    db_filename = f"{current_user.id}/{filename}"
    todo.proof_image = db_filename
    todo.status = "pending"
    db.commit()

    return {"message": "Upload successful", "image": f"/uploads/proofs/{db_filename}"}

# [NEW] Admin verifies todo
@router.patch("/{todo_id}/verify")
def verify_todo(
    todo_id: int,
    body: TodoVerify,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin only")

    todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")

    # ดักจับ: ถ้าสถานะปัจจุบันเป็น accepted อยู่แล้ว ไม่ต้องให้รางวัลซ้ำ
    old_status = todo.status
    todo.status = body.status

    if body.status == "accepted":
        todo.is_completed = True
        # ให้รางวัลเฉพาะในกรณีที่เปลี่ยนจากสถานะอื่นมาเป็น accepted ครั้งแรกเท่านั้น
        if old_status != "accepted":
            user = db.query(User).filter(User.id == todo.user_id).first()
            if user:
                user.exp += 15
                user.coins += 2
                user.missions_done += 1
    else:
        todo.is_completed = False

    db.commit()
    return {"message": f"Todo {body.status}", "id": todo.id}

# Admin List (All Todos with Proof)
@router.get("/admin/all")
def get_all_verify_todos(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin only")

    todos = (
        db.query(Todo, User.username)
        .join(User, Todo.user_id == User.id)
        .filter(Todo.status != "active")
        .order_by(Todo.created_at.desc())
        .all()
    )
    return [
        {
            "id": t.id,
            "username": uname,
            "task_text": t.task_text,
            "status": t.status, # Return status: pending, accepted, rejected
            "proof_image": f"/uploads/proofs/{t.proof_image}" if t.proof_image else None,
            "created_at": t.created_at,
        }
        for t, uname in todos
    ]

@router.delete("/{todo_id}")
def delete_todo(
    todo_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    todo = db.query(Todo).filter(Todo.id == todo_id, Todo.user_id == current_user.id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="ไม่พบ Todo นี้")

    db.delete(todo)
    db.commit()
    return {"message": "ลบ Todo สำเร็จ"}
