from sqlalchemy import Column, Integer, Boolean, ForeignKey
from app.utils.db import Base

class UserAvatar(Base):
    __tablename__ = "user_avatars"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    avatar_id = Column(Integer, ForeignKey("avatars.id"))
    is_equipped = Column(Boolean, default=False)
