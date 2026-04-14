import os
import sys
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Load .env from backend directory
load_dotenv('backend/.env')

db_url = os.getenv("DATABASE_URL")
if not db_url:
    print("DATABASE_URL not found")
    sys.exit(1)

# Ensure ssl_ca path is correct if relative
if 'ssl_get_server_cert' not in db_url and 'ssl_ca=ca.pem' in db_url:
    # If ca.pem is in backend folder
    ca_path = os.path.abspath('backend/app/ca.pem')
    db_url = db_url.replace('ca.pem', ca_path)

try:
    engine = create_engine(db_url)
    with engine.connect() as conn:
        result = conn.execute(text("SELECT id, username, email, equipped_avatar FROM users WHERE username = 'pun'"))
        user = result.fetchone()
        if user:
            print(f"User found: {user}")
        else:
            print("User 'pun' not found")
except Exception as e:
    print(f"Error connecting to DB: {e}")
