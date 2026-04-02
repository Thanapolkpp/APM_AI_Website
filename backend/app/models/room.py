from sqlalchemy import Column, Integer, String
from app.utils.db import Base

class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    price = Column(Integer)
    image_path = Column(String(255))
