import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
import pymysql

# Import Base and models so SQLAlchemy knows what to create
from app.utils.db import Base
from app.models import user, planner

# Load environment variables
dotenv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '.env')
load_dotenv(dotenv_path)

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# Apply SSL connect_args if using Aiven
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CA_CERT_PATH = os.path.join(BASE_DIR, "ca.pem")

connect_args = {}
if SQLALCHEMY_DATABASE_URL and "aivencloud" in SQLALCHEMY_DATABASE_URL:
    connect_args = {
        "ssl": {
            "ca": CA_CERT_PATH
        }
    }

if not SQLALCHEMY_DATABASE_URL:
    print("Error: DATABASE_URL is missing!")
    exit(1)

try:
    print(f"Connecting to database...")
    engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args=connect_args)
    
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    
    print("Tables created successfully!")
except Exception as e:
    print(f"Error during table creation: {e}")
