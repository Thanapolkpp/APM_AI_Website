from sqlalchemy import Column, Integer, Boolean, ForeignKey
from app.utils.db import Base

class UserRoom(Base):
    __tablename__ = "user_rooms"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    room_id = Column(Integer, ForeignKey("rooms.id"))
    is_equipped = Column(Boolean, default=False)
