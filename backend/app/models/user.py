from sqlalchemy import Column, Integer, String, Boolean
from app.utils.db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    hashed_password = Column(String(255))
    coins = Column(Integer, default=30)
    exp = Column(Integer, default=0)
    has_claimed_test_reward = Column(Boolean, default=False)
    is_admin = Column(Boolean, default=False)
    
    # Statistics for Special Missions
    reading_time_minutes = Column(Integer, default=0)
    missions_done = Column(Integer, default=0)
    chat_modes_used = Column(String(50), default="") # e.g. "bro,nerd"