from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.utils.db import get_db
from app.utils.security import get_current_user
from app.models.user import User
from app.services import notification_service

router = APIRouter()


@router.get("/")
def get_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """ดึง notifications ทั้งหมดของ user (max 4)"""
    notifs = notification_service.get_notifications(db, current_user.id)
    return [
        {
            "id": n.id,
            "type": n.type,
            "title": n.title,
            "message": n.message,
            "is_read": n.is_read,
            "created_at": n.created_at,
        }
        for n in notifs
    ]


@router.get("/unread-count")
def get_unread_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    count = notification_service.get_unread_count(db, current_user.id)
    return {"unread_count": count}


@router.patch("/read-all")
def mark_all_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    notification_service.mark_all_read(db, current_user.id)
    return {"message": "อ่านทั้งหมดแล้ว"}


@router.patch("/{notification_id}/read")
def mark_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    notif = notification_service.mark_read(db, current_user.id, notification_id)
    if not notif:
        raise HTTPException(status_code=404, detail="ไม่พบ Notification นี้")
    return {"message": "อ่านแล้ว", "id": notification_id}
