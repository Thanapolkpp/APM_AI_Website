from fastapi import APIRouter
from app.models.planner import PlannerRequest, PlannerResponse
from app.services.schedule_generator import generate_schedule

router = APIRouter()

@router.post("/")
def create_plan(data: PlannerRequest):
    schedule = generate_schedule(data)
    return PlannerResponse(schedule=schedule)
