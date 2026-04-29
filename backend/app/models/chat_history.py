from sqlalchemy import Column, Integer, Text, String, DateTime, ForeignKey
from datetime import datetime, timezone
from app.utils.db import Base

class ChatHistory(Base):
    __tablename__ = "chat_histories"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    user_message = Column(Text)
    ai_response = Column(Text)
    mode = Column(String(50), default="bro")
    created_at = Column(DateTime, default=datetime.utcnow)

