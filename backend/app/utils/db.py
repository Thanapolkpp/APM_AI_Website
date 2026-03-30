import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# โหลดค่าจากไฟล์ .env
load_dotenv()

# ดึงค่าจาก .env ถ้าหาไม่เจอให้ใช้ localhost เป็นค่าเริ่มต้น
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:@host.docker.internal:3306/apm_project")

# Path ไปยังไฟล์ ca.pem ที่ก็อปปี้มาไว้ในโฟลเดอร์ app
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CA_CERT_PATH = os.path.join(BASE_DIR, "ca.pem")

# กำหนด connect_args เพื่อบังคับใช้ SSL กับ Aiven
# ใช้ ssl_ca สำหรับไลบรารี mysql-connector-python
connect_args = {}
if "aivencloud" in SQLALCHEMY_DATABASE_URL:
    connect_args = {
        "ssl_ca": CA_CERT_PATH
    }

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
