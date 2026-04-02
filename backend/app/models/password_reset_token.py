from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from app.utils.db import Base

class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    token = Column(String(64), unique=True, index=True)
    expires_at = Column(DateTime)
