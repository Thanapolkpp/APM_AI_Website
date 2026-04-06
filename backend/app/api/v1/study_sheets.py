from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.utils.db import get_db
from app.utils.security import get_current_user
from app.utils.pdf_utils import compress_pdf, extract_text_from_pdf
from app.models.study_sheet import StudySheet
from app.models.user_sheet import UserSheet
from app.models.user import User
from app.services import notification_service
from app.services.storage_service import upload_file, delete_file
import os

router = APIRouter()

BUCKET = "sheets"
MAX_SHEETS_PER_USER = 10

def normalize_pdf_url(path: str) -> str:
    """ENSURE FULL ABSOLUTE SUPABASE URL AND PREVENT DOUBLE BUCKET NAMES"""
    if not path:
        return ""
    if path.startswith("http"):
        return path
    
    supabase_url = os.getenv("SUPABASE_URL", "").strip()
    if not supabase_url:
        return path
        
    if not supabase_url.startswith("http"):
        supabase_url = f"https://{supabase_url}"
    supabase_url = supabase_url.rstrip("/")
    
    clean_path = path.lstrip("/")
    
    # ถ้าไม่มี /storage/v1/object/public/ อยู่ใน path ให้เติมให้ครบ
    if "storage/v1/object/public/" not in clean_path:
        # เช็คว่า clean_path มันมีชื่อ bucket (sheets/) อยู่ข้างหน้าแล้วหรือยัง
        if clean_path.startswith(f"{BUCKET}/"):
            return f"{supabase_url}/storage/v1/object/public/{clean_path}"
        # ถ้าไม่มีเลย ให้ยัด bucket เข้าไป
        return f"{supabase_url}/storage/v1/object/public/{BUCKET}/{clean_path}"
    
    return f"{supabase_url}/{clean_path}"


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

    # FIFO: ถ้ามีครบ 10 ลบเก่าสุดก่อน (ลบจาก Supabase + DB)
    sheet_count = db.query(StudySheet).filter(StudySheet.user_id == current_user.id).count()
    if sheet_count >= MAX_SHEETS_PER_USER:
        oldest = (
            db.query(StudySheet)
            .filter(StudySheet.user_id == current_user.id)
            .order_by(StudySheet.created_at.asc())
            .first()
        )
        if oldest:
            if oldest.file_path:
                delete_file(BUCKET, oldest.file_path)
            db.query(UserSheet).filter(UserSheet.sheet_id == oldest.id).delete()
            db.delete(oldest)
            db.commit()

    # extract text จาก original bytes ก่อน (compress อาจ reformat รูปภาพ)
    extracted_text = extract_text_from_pdf(file_bytes)

    # compress PDF ให้เล็กลง แล้วค่อย upload
    compressed_bytes = compress_pdf(file_bytes)
    public_url = upload_file(BUCKET, compressed_bytes, file.filename or "sheet.pdf")

    new_sheet = StudySheet(
        user_id=current_user.id,
        title=title,
        file_path=public_url,
        extracted_text=extracted_text,
        price=price,
        is_public=is_public,
    )
    db.add(new_sheet)
    db.commit()
    db.refresh(new_sheet)

    current_user.coins += 3
    db.commit()

    notification_service.add_notification(
        db=db,
        user_id=current_user.id,
        type="coin_earned",
        title="ได้รับ Coin!",
        message=f"อัปโหลดชีท '{title}' สำเร็จ ได้รับ +3 coins เป็นรางวัล!",
    )

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
            "file_path": normalize_pdf_url(s.file_path),
            "price": s.price,
            "is_public": s.is_public,
            "category": "สรุปสอบ",
            "subject": "General Education",
            "is_mine": True,
            "already_purchased": False,
            "created_at": s.created_at,
            "extracted_text": s.extracted_text,
        }
        for s in sheets
    ]


@router.get("/market")
def get_market(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
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
            "file_path": normalize_pdf_url(s.file_path),
            "gradient": "from-blue-500 to-indigo-600",
            "iconName": "BookText",
            "already_purchased": s.id in purchased_ids or s.user_id == current_user.id,
            "is_mine": s.user_id == current_user.id,
            "created_at": s.created_at,
            "extracted_text": s.extracted_text,
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
            "file_path": normalize_pdf_url(sheet.file_path),
            "price": sheet.price,
            "category": "งานวิจัย",
            "subject": "General Education",
            "gradient": "from-purple-500 to-pink-500",
            "is_mine": False,
            "already_purchased": True,
            "bought_at": us.bought_at,
            "extracted_text": sheet.extracted_text,
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

    current_user.coins -= sheet.price
    seller = db.query(User).filter(User.id == sheet.user_id).first()
    if seller:
        seller.coins += sheet.price

    new_purchase = UserSheet(buyer_id=current_user.id, sheet_id=sheet_id)
    db.add(new_purchase)
    db.commit()

    notification_service.add_notification(
        db=db,
        user_id=current_user.id,
        type="purchase",
        title="ซื้อชีทสำเร็จ!",
        message=f"คุณซื้อชีท '{sheet.title}' สำเร็จ ใช้ไป {sheet.price} coins",
    )
    if seller:
        notification_service.add_notification(
            db=db,
            user_id=seller.id,
            type="sale",
            title="ชีทของคุณถูกซื้อแล้ว!",
            message=f"ชีท '{sheet.title}' ถูกซื้อไปแล้ว คุณได้รับ +{sheet.price} coins",
        )

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

    # ลบไฟล์จาก Supabase Storage
    if sheet.file_path:
        delete_file(BUCKET, sheet.file_path)

    # ลบ records ใน DB (UserSheet ก่อน แล้วค่อยลบ StudySheet)
    db.query(UserSheet).filter(UserSheet.sheet_id == sheet_id).delete()
    db.delete(sheet)
    db.commit()

    return {"message": "ลบชีทสรุปสำเร็จแล้วครับเพื่อน 🌷"}
