from sqlalchemy.orm import Session
from app.models.user import User
from app.models.avatar import Avatar
from app.models.room import Room
from app.models.user_avatar import UserAvatar
from app.models.user_room import UserRoom
from app.utils.security import hash_password
import random

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def create_user(db: Session, user_data):
    hashed_pwd = hash_password(user_data.password)
    db_user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hashed_pwd,
        
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user