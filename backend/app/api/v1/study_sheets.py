import os
import io
import uuid
import shutil
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.utils.db import get_db
from app.utils.security import get_current_user
from app.models.study_sheet import StudySheet
from app.models.user_sheet import UserSheet
from app.models.user import User

try:
    import PyPDF2
    PDF_SUPPORT = True
except ImportError:
    PDF_SUPPORT = False

router = APIRouter()

UPLOAD_BASE_DIR = "uploads/sheets"
MAX_SHEETS_PER_USER = 10


# ---------- Helpers ----------

def get_user_upload_dir(user_id: int) -> str:
    user_dir = os.path.join(UPLOAD_BASE_DIR, str(user_id))
    os.makedirs(user_dir, exist_ok=True)
    return user_dir


def extract_text_from_pdf(file_bytes: bytes) -> str:
    if not PDF_SUPPORT:
        return ""
    try:
        reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
        pages_text = []
        for page in reader.pages:
            text = page.extract_text()
            if text:
                pages_text.append(text)
        return "\n".join(pages_text)
    except Exception:
        return ""


# ---------- Schemas ----------

class UpdatePriceRequest(BaseModel):
    price: int


# ---------- Endpoints ----------

@router.post("/upload")
def upload_study_sheet(
    title: str = Form(...),
    price: int = Form(0),
    is_public: bool = Form(False),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="รองรับเฉพาะไฟล์ PDF เท่านั้น")

    if price < 0:
        raise HTTPException(status_code=400, detail="ราคาต้องไม่ติดลบ")

    file_bytes = file.file.read()

    # FIFO: ถ้ามีครบ 10 ลบเก่าสุดก่อน
    sheet_count = db.query(StudySheet).filter(StudySheet.user_id == current_user.id).count()
    if sheet_count >= MAX_SHEETS_PER_USER:
        oldest = (
            db.query(StudySheet)
            .filter(StudySheet.user_id == current_user.id)
            .order_by(StudySheet.created_at.asc())
            .first()
        )
        if oldest:
            physical_path = oldest.file_path.lstrip("/")
            if os.path.exists(physical_path):
                os.remove(physical_path)
            db.query(UserSheet).filter(UserSheet.sheet_id == oldest.id).delete()
            db.delete(oldest)
            db.commit()

    unique_filename = f"{uuid.uuid4().hex}.pdf"
    user_dir = get_user_upload_dir(current_user.id)
    file_path = os.path.join(user_dir, unique_filename)

    with open(file_path, "wb") as f:
        f.write(file_bytes)

    file_path_normalized = "/" + file_path.replace("\\", "/")
    extracted_text = extract_text_from_pdf(file_bytes)

    new_sheet = StudySheet(
        user_id=current_user.id,
        title=title,
        file_path=file_path_normalized,
        extracted_text=extracted_text,
        price=price,
        is_public=is_public,
    )
    db.add(new_sheet)
    db.commit()
    db.refresh(new_sheet)

    current_user.coins += 3
    db.commit()

    return {
        "message": "อัปโหลดสำเร็จ",
        "id": new_sheet.id,
        "title": new_sheet.title,
        "file_path": new_sheet.file_path,
        "price": new_sheet.price,
        "is_public": new_sheet.is_public,
        "text_extracted": len(extracted_text) > 0,
        "bonus_coins": 3,
        "coins_total": current_user.coins,
    }


@router.get("/")
def get_my_sheets(
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
            "price": s.price,
            "is_public": s.is_public,
            "category": "สรุปสอบ",
            "subject": "General Education",
            "is_mine": True,
            "already_purchased": False,
            "created_at": s.created_at,
        }
        for s in sheets
    ]


@router.get("/market")
def get_market(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # ดู sheet ที่วางขายทั้งหมด (รวมของตัวเองเพื่อเช็ค)
    sheets = (
        db.query(StudySheet)
        .filter(StudySheet.is_public == True)
        .order_by(StudySheet.created_at.desc())
        .all()
    )

    purchased_ids = {
        row.sheet_id
        for row in db.query(UserSheet).filter(UserSheet.buyer_id == current_user.id).all()
    }

    return [
        {
            "id": s.id,
            "title": s.title,
            "price": s.price,
            "category": "บทเรียน",
            "subject": "General Education",
            "file_path": s.file_path,
            "gradient": "from-blue-500 to-indigo-600",
            "iconName": "BookText",
            "already_purchased": s.id in purchased_ids or s.user_id == current_user.id,
            "is_mine": s.user_id == current_user.id,
            "created_at": s.created_at,
        }
        for s in sheets
    ]


@router.get("/my-purchased")
def get_purchased_sheets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    rows = (
        db.query(UserSheet, StudySheet)
        .join(StudySheet, UserSheet.sheet_id == StudySheet.id)
        .filter(UserSheet.buyer_id == current_user.id)
        .order_by(UserSheet.bought_at.desc())
        .all()
    )
    return [
        {
            "id": sheet.id,
            "title": sheet.title,
            "file_path": sheet.file_path,
            "price": sheet.price,
            "category": "งานวิจัย",
            "subject": "General Education",
            "gradient": "from-purple-500 to-pink-500",
            "is_mine": False,
            "already_purchased": True,
            "bought_at": us.bought_at,
        }
        for us, sheet in rows
    ]


@router.post("/{sheet_id}/buy")
def buy_sheet(
    sheet_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    sheet = db.query(StudySheet).filter(StudySheet.id == sheet_id).first()
    if not sheet:
        raise HTTPException(status_code=404, detail="ไม่พบ Sheet นี้")

    if sheet.user_id == current_user.id:
        raise HTTPException(status_code=400, detail="ไม่สามารถซื้อ Sheet ของตัวเองได้")

    if not sheet.is_public:
        raise HTTPException(status_code=400, detail="Sheet นี้ไม่ได้วางขาย")

    already = db.query(UserSheet).filter(
        UserSheet.buyer_id == current_user.id,
        UserSheet.sheet_id == sheet_id,
    ).first()
    if already:
        raise HTTPException(status_code=400, detail="ซื้อ Sheet นี้ไปแล้ว")

    if current_user.coins < sheet.price:
        raise HTTPException(
            status_code=400,
            detail=f"เหรียญไม่พอ (มี {current_user.coins}, ต้องการ {sheet.price})"
        )

    # โอน coins
    current_user.coins -= sheet.price
    seller = db.query(User).filter(User.id == sheet.user_id).first()
    if seller:
        seller.coins += sheet.price

    # บันทึกการซื้อ
    new_purchase = UserSheet(buyer_id=current_user.id, sheet_id=sheet_id)
    db.add(new_purchase)
    db.commit()

    return {
        "message": f"ซื้อ Sheet '{sheet.title}' สำเร็จ",
        "coins_remaining": current_user.coins,
    }


@router.patch("/{sheet_id}/publish")
def toggle_publish(
    sheet_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    sheet = db.query(StudySheet).filter(StudySheet.id == sheet_id).first()
    if not sheet:
        raise HTTPException(status_code=404, detail="ไม่พบ Sheet นี้")

    if sheet.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="คุณไม่ใช่เจ้าของ Sheet นี้")

    sheet.is_public = not sheet.is_public
    db.commit()

    status = "วางขายแล้ว" if sheet.is_public else "ถอนออกจากร้านแล้ว"
    return {
        "message": status,
        "id": sheet.id,
        "is_public": sheet.is_public,
    }


@router.patch("/{sheet_id}/price")
def update_price(
    sheet_id: int,
    body: UpdatePriceRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if body.price < 0:
        raise HTTPException(status_code=400, detail="ราคาต้องไม่ติดลบ")

    sheet = db.query(StudySheet).filter(StudySheet.id == sheet_id).first()
    if not sheet:
        raise HTTPException(status_code=404, detail="ไม่พบ Sheet นี้")

    if sheet.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="คุณไม่ใช่เจ้าของ Sheet นี้")

    sheet.price = body.price
    db.commit()

    return {
        "message": "อัปเดตราคาสำเร็จ",
        "id": sheet.id,
        "price": sheet.price,
    }


@router.delete("/{sheet_id}")
def delete_study_sheet(
    sheet_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    sheet = db.query(StudySheet).filter(StudySheet.id == sheet_id).first()
    if not sheet:
        raise HTTPException(status_code=404, detail="ไม่พบ Sheet นี้")

    if sheet.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="คุณไม่มีสิทธิ์ลบ Sheet นี้")

    # ลบไฟล์ทางกายภาพ
    if sheet.file_path:
        # ลบ / นำหน้าออกถ้ามี
        physical_path = sheet.file_path.lstrip("/")
        if os.path.exists(physical_path):
            os.remove(physical_path)

    # ลบ records ในฐานข้อมูล
    db.query(UserSheet).filter(UserSheet.sheet_id == sheet_id).delete()
    db.delete(sheet)
    db.commit()

    return {"message": "ลบชีทสรุปสำเร็จแล้วครับเพื่อน 🌷"}
