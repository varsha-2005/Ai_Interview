from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from bson import ObjectId

class Scores(BaseModel):
    resume: Optional[float] = None
    aptitude: Optional[float] = None
    technical: Optional[float] = None
    interview: Optional[float] = None

class ResultBase(BaseModel):
    interview: str
    scores: Scores
    feedback: str

class ResultCreate(ResultBase):
    pass

class Result(ResultBase):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
        json_encoders = {ObjectId: str}