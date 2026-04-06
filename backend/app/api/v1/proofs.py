from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session

from app.utils.db import get_db
from app.utils.security import get_current_user
from app.utils.pdf_utils import compress_pdf
from app.models.proof import Proof
from app.models.user import User
from app.services.storage_service import upload_file, delete_file

router = APIRouter()

BUCKET = "proofs"

ALLOWED_TYPES = {
    "application/pdf": "pdf",
    "image/jpeg": "image",
    "image/png": "image",
    "image/webp": "image",
}


# ---------- Endpoints ----------

@router.post("/upload")
def upload_proof(
    title: str = Form(...),
    description: str = Form(""),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail="รองรับเฉพาะ PDF, JPG, PNG, WEBP เท่านั้น"
        )

    file_bytes = file.file.read()
    file_type = ALLOWED_TYPES[file.content_type]

    # compress PDF ก่อน upload (รูปภาพ upload ตรงได้เลย)
    if file_type == "pdf":
        file_bytes = compress_pdf(file_bytes)

    public_url = upload_file(
        BUCKET,
        file_bytes,
        file.filename or f"proof.{file_type}",
        content_type=file.content_type,
    )

    new_proof = Proof(
        user_id=current_user.id,
        title=title,
        description=description or None,
        file_path=public_url,
        file_type=file_type,
    )
    db.add(new_proof)
    db.commit()
    db.refresh(new_proof)

    return {
        "message": "อัปโหลดพรูฟสำเร็จ",
        "id": new_proof.id,
        "title": new_proof.title,
        "file_path": new_proof.file_path,
        "file_type": new_proof.file_type,
        "created_at": new_proof.created_at,
    }


@router.get("/")
def get_my_proofs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    proofs = (
        db.query(Proof)
        .filter(Proof.user_id == current_user.id)
        .order_by(Proof.created_at.desc())
        .all()
    )
    return [
        {
            "id": p.id,
            "title": p.title,
            "description": p.description,
            "file_path": p.file_path,
            "file_type": p.file_type,
            "created_at": p.created_at,
        }
        for p in proofs
    ]


@router.delete("/{proof_id}")
def delete_proof(
    proof_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    proof = db.query(Proof).filter(Proof.id == proof_id).first()
    if not proof:
        raise HTTPException(status_code=404, detail="ไม่พบพรูฟนี้")

    if proof.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="คุณไม่มีสิทธิ์ลบพรูฟนี้")

    # ลบไฟล์จาก Supabase Storage ก่อน
    if proof.file_path:
        delete_file(BUCKET, proof.file_path)

    # ลบออกจาก DB
    db.delete(proof)
    db.commit()

    return {"message": "ลบพรูฟสำเร็จแล้ว"}
