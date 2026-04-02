from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from datetime import datetime
from app.utils.db import Base

class StudySheet(Base):
    __tablename__ = "study_sheets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String(255))
    file_path = Column(String(500))
    extracted_text = Column(Text)
    price = Column(Integer, default=0)
    is_public = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
