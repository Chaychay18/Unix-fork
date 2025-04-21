from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class TaskCreate(BaseModel):
    name: str
    description: Optional[str] = None

class TaskResponse(BaseModel):
    id: str
    name: str
    description: Optional[str]
    status: str
    created_at: datetime

    class Config:
        orm_mode = True