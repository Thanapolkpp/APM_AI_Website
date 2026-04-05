from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from datetime import datetime
from app.utils.db import Base

class Todo(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    task_text = Column(String(500))
    # For Admin Verification
    proof_image = Column(String(500), nullable=True) # URL of uploaded photo
    status = Column(String(50), default="active") # "active", "pending", "accepted", "rejected"
    is_completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.now)

