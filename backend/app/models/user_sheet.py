from sqlalchemy import Column, Integer, DateTime, ForeignKey
from datetime import datetime
from app.utils.db import Base

class UserSheet(Base):
    __tablename__ = "user_sheets"

    id = Column(Integer, primary_key=True, index=True)
    buyer_id = Column(Integer, ForeignKey("users.id"), index=True)
    sheet_id = Column(Integer, ForeignKey("study_sheets.id"), index=True)
    bought_at = Column(DateTime, default=datetime.utcnow)

