from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.utils.db import get_db
from app.utils.security import get_current_user
from app.models.todo import Todo
from app.models.user import User

router = APIRouter()


class TodoCreate(BaseModel):
    task_text: str


@router.post("/")
def create_todo(
    body: TodoCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    new_todo = Todo(user_id=current_user.id, task_text=body.task_text)
    db.add(new_todo)
    db.commit()
    db.refresh(new_todo)
    return {
        "id": new_todo.id,
        "task_text": new_todo.task_text,
        "is_completed": new_todo.is_completed,
        "created_at": new_todo.created_at,
    }


@router.get("/")
def get_todos(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    todos = (
        db.query(Todo)
        .filter(Todo.user_id == current_user.id)
        .order_by(Todo.created_at.asc())
        .all()
    )
    return [
        {
            "id": t.id,
            "task_text": t.task_text,
            "is_completed": t.is_completed,
            "created_at": t.created_at,
        }
        for t in todos
    ]


@router.put("/{todo_id}/toggle")
def toggle_todo(
    todo_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    todo = db.query(Todo).filter(Todo.id == todo_id, Todo.user_id == current_user.id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="ไม่พบ Todo นี้")

    todo.is_completed = not todo.is_completed
    db.commit()
    return {
        "id": todo.id,
        "task_text": todo.task_text,
        "is_completed": todo.is_completed,
    }
