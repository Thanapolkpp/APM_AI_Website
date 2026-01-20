from pydantic import BaseModel
from typing import List

class PlannerRequest(BaseModel):
    subjects: List[str]
    available_hours: int

class PlannerResponse(BaseModel):
    schedule: List[str]
