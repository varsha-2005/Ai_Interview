from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from bson import ObjectId

class InterviewBase(BaseModel):
    user: str
    resume: Optional[str] = None
    job: Optional[str] = None
    difficulty: str
    mode: str
    status: Optional[str] = "in-progress"

class InterviewCreate(InterviewBase):
    pass

class Interview(InterviewBase):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
        json_encoders = {ObjectId: str}