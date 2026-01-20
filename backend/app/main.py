from fastapi import FastAPI
from app.api.planner import router as planner_router

app = FastAPI(title="AI Study Planner API")

app.include_router(planner_router, prefix="/planner", tags=["Planner"])

@app.get("/")
def root():
    return {"message": "API is running"}
