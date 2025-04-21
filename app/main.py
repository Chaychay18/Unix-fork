from fastapi import FastAPI, HTTPException, Depends
from typing import List
from .database import get_db
from .models import Task
from .schemas import TaskCreate, TaskResponse
from datetime import datetime
from sqlalchemy.orm import Session
import uuid

app = FastAPI(title="Unix-Inspired Task Manager")

@app.get("/tasks", response_model=List[TaskResponse])
async def list_tasks(db: Session = Depends(get_db)):
    """List all tasks (Unix 'ls' inspired)"""
    tasks = db.query(Task).all()
    return tasks

@app.post("/tasks", response_model=TaskResponse, status_code=201)
async def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    """Create a new task (Unix 'fork' inspired)"""
    try:
        new_task = Task(
            id=str(uuid.uuid4()),
            name=task.name,
            description=task.description,
            status="running",
            created_at=datetime.utcnow()
        )
        db.add(new_task)
        db.commit()
        db.refresh(new_task)
        return new_task
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create task: {str(e)}")

@app.get("/tasks/{task_id}", response_model=TaskResponse)
async def get_task(task_id: str, db: Session = Depends(get_db)):
    """Get details of a specific task"""
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task