from sqlalchemy.orm import Session
from app.models.notification import Notification

MAX_NOTIFICATIONS = 4


def add_notification(db: Session, user_id: int, type: str, title: str, message: str):
    """
    เพิ่ม notification ใหม่ให้ user
    ถ้ามีครบ 4 แล้ว → ลบอันเก่าที่สุดออกก่อน (FIFO)
    """
    count = db.query(Notification).filter(Notification.user_id == user_id).count()
    if count >= MAX_NOTIFICATIONS:
        oldest = (
            db.query(Notification)
            .filter(Notification.user_id == user_id)
            .order_by(Notification.created_at.asc())
            .first()
        )
        if oldest:
            db.delete(oldest)

    new_notif = Notification(
        user_id=user_id,
        type=type,
        title=title,
        message=message,
    )
    db.add(new_notif)
    db.commit()
    db.refresh(new_notif)
    return new_notif


def get_notifications(db: Session, user_id: int):
    """ดึง notifications ของ user เรียงจากใหม่ไปเก่า"""
    return (
        db.query(Notification)
        .filter(Notification.user_id == user_id)
        .order_by(Notification.created_at.desc())
        .all()
    )


def get_unread_count(db: Session, user_id: int) -> int:
    return (
        db.query(Notification)
        .filter(Notification.user_id == user_id, Notification.is_read == False)
        .count()
    )


def mark_read(db: Session, user_id: int, notification_id: int):
    notif = (
        db.query(Notification)
        .filter(Notification.id == notification_id, Notification.user_id == user_id)
        .first()
    )
    if notif:
        notif.is_read = True
        db.commit()
    return notif


def mark_all_read(db: Session, user_id: int):
    db.query(Notification).filter(
        Notification.user_id == user_id,
        Notification.is_read == False,
    ).update({"is_read": True})
    db.commit()
