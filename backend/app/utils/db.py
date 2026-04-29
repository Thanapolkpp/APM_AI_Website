import os
import tempfile
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# โหลดค่าจากไฟล์ .env
load_dotenv()

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:@localhost:3306/apm_project")

connect_args = {}
if "aivencloud" in SQLALCHEMY_DATABASE_URL:
    ssl_ca_content = os.getenv("SSL_CA_CONTENT")
    if ssl_ca_content:
        # เขียน cert ลง temp file ชั่วคราว (รองรับทั้ง Render และ local)
        tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".pem", mode="w")
        tmp.write(ssl_ca_content)
        tmp.close()
        connect_args = {"ssl_ca": tmp.name}
    else:
        # fallback สำหรับ local dev ที่มีไฟล์ ca.pem
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        CA_CERT_PATH = os.path.join(BASE_DIR, "ca.pem")
        if os.path.exists(CA_CERT_PATH):
            connect_args = {"ssl_ca": CA_CERT_PATH}

# ─── Connection Pooling สำหรับ Performance ───
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args=connect_args,
    pool_size=10,           # จำนวน connection ที่เก็บไว้ใน pool
    max_overflow=20,        # connection เพิ่มเติมได้สูงสุดเมื่อ pool เต็ม
    pool_recycle=1800,      # รีไซเคิล connection ทุก 30 นาที (ป้องกัน stale connection)
    pool_pre_ping=True,     # เช็ค connection ก่อนใช้ (auto-reconnect ถ้าหลุด)
    pool_timeout=30,        # timeout สำหรับรอ connection จาก pool
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
