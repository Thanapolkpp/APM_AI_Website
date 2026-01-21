# ใช้ MySQL  
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# เปลี่ยน user, password, host, db_name ตามของคุณ
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:@localhost:3306/app/utils/db.py"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency สำหรับดึง Database Session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()