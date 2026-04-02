import os
import uuid
import shutil
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session

from app.utils.db import get_db
from app.utils.security import get_current_user
from app.models.study_sheet import StudySheet
from app.models.user import User

router = APIRouter()

UPLOAD_BASE_DIR = "uploads/sheets"
MAX_SHEETS_PER_USER = 4


def get_user_upload_dir(user_id: int) -> str:
    user_dir = os.path.join(UPLOAD_BASE_DIR, str(user_id))
    os.makedirs(user_dir, exist_ok=True)
    return user_dir


@router.post("/upload")
def upload_study_sheet(
    title: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # ตรวจสอบว่าเป็น PDF
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="รองรับเฉพาะไฟล์ PDF เท่านั้น")

    # FIFO: ถ้ามีไฟล์ครบ 4 แล้ว ลบอันเก่าสุดออกก่อน
    sheet_count = db.query(StudySheet).filter(StudySheet.user_id == current_user.id).count()
    if sheet_count >= MAX_SHEETS_PER_USER:
        oldest = (
            db.query(StudySheet)
            .filter(StudySheet.user_id == current_user.id)
            .order_by(StudySheet.created_at.asc())
            .first()
        )
        if oldest:
            # ลบไฟล์จริงออกจาก filesystem
            if os.path.exists(oldest.file_path):
                os.remove(oldest.file_path)
            # ลบ record ออกจาก DB
            db.delete(oldest)
            db.commit()

    # สร้าง unique filename กันชนกัน
    ext = os.path.splitext(file.filename)[1] or ".pdf"
    unique_filename = f"{uuid.uuid4().hex}{ext}"

    # สร้าง subfolder ของ user และ save ไฟล์
    user_dir = get_user_upload_dir(current_user.id)
    file_path = os.path.join(user_dir, unique_filename)

    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    # แปลง path ให้เป็น forward slash สำหรับ frontend
    file_path_normalized = file_path.replace("\\", "/")

    # บันทึก record ใหม่ลง DB (extracted_text ว่างไว้ก่อน — ขยายต่อได้ภายหลัง)
    new_sheet = StudySheet(
        user_id=current_user.id,
        title=title,
        file_path=f"/{file_path_normalized}",
        extracted_text="",
    )
    db.add(new_sheet)
    db.commit()
    db.refresh(new_sheet)

    return {
        "message": "อัปโหลดสำเร็จ",
        "id": new_sheet.id,
        "title": new_sheet.title,
        "file_path": new_sheet.file_path,
    }


@router.get("/")
def get_study_sheets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    sheets = (
        db.query(StudySheet)
        .filter(StudySheet.user_id == current_user.id)
        .order_by(StudySheet.created_at.desc())
        .all()
    )
    return [
        {
            "id": s.id,
            "title": s.title,
            "file_path": s.file_path,
            "created_at": s.created_at,
        }
        for s in sheets
    ]
