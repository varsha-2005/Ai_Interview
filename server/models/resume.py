from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from bson import ObjectId

class ResumeBase(BaseModel):
    user: str
    fileUrl: str
    originalName: str
    text: str
    embedding: Optional[List[float]] = []

class ResumeCreate(ResumeBase):
    pass

class Resume(ResumeBase):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
        json_encoders = {ObjectId: str}