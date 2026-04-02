from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from datetime import datetime
from app.utils.db import Base

class StudySheet(Base):
    __tablename__ = "study_sheets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String(255))
    file_path = Column(String(500))
    extracted_text = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
