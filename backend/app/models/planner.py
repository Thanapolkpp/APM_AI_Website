
# เก็บไฟล์ที่เกี่ยวกับโครงสร้างข้อมูล (data structure)
from pydantic import BaseModel
from typing import List

class PlannerRequest(BaseModel):
    subjects: List[str]
    available_hours: int

class PlannerResponse(BaseModel):
    schedule: List[str]
