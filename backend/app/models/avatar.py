from sqlalchemy import Column, Integer, String
from app.utils.db import Base

class Avatar(Base):
    __tablename__ = "avatars"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    price = Column(Integer)
    model_path = Column(String(255))
