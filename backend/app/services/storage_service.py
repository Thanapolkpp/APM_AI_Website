import os
import uuid
from supabase import create_client, Client

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

_client: Client | None = None


def _get_client() -> Client:
    global _client
    if _client is None:
        if not SUPABASE_URL or not SUPABASE_KEY:
            raise RuntimeError("SUPABASE_URL และ SUPABASE_KEY ยังไม่ได้ตั้งค่าใน env")
        _client = create_client(SUPABASE_URL, SUPABASE_KEY)
    return _client


def upload_file(bucket: str, file_bytes: bytes, filename: str, content_type: str = "application/pdf") -> str:
    """
    อัปโหลดไฟล์ไปยัง Supabase Storage
    คืน public URL ของไฟล์ (Full URL)
    """
    client = _get_client()
    unique_name = f"{uuid.uuid4().hex}_{filename}"
    client.storage.from_(bucket).upload(
        path=unique_name,
        file=file_bytes,
        file_options={"content-type": content_type},
    )
    public_url_resp = client.storage.from_(bucket).get_public_url(unique_name)
    
    # บางเวอร์ชันคืนค่าเป็น Object บางเวอร์ชันเป็น String
    public_url = str(public_url_resp)
    
    # ถ้ายังไม่ได้เป็น Full URL หรือลืม protocol ให้จัดการใหม่
    if not public_url.startswith("http"):
        base_url = SUPABASE_URL.strip()
        if not base_url.startswith("http"):
            base_url = f"https://{base_url}"
        base_url = base_url.rstrip("/")
        public_url = f"{base_url}/storage/v1/object/public/{bucket}/{unique_name}"
        
    return public_url


def delete_file(bucket: str, file_url: str) -> None:
    """
    ลบไฟล์ออกจาก Supabase Storage โดยใช้ public URL
    """
    client = _get_client()
    # ดึงชื่อไฟล์จาก URL (ส่วนหลัง /bucket-name/ )
    try:
        filename = file_url.split(f"/{bucket}/")[-1]
        client.storage.from_(bucket).remove([filename])
    except Exception:
        pass
