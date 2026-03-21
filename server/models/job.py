from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from bson import ObjectId

class JobBase(BaseModel):
    user: str
    company: str
    description: str

class JobCreate(JobBase):
    pass

class Job(JobBase):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
        json_encoders = {ObjectId: str}