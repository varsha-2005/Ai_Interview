from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime
from bson import ObjectId

class UserBase(BaseModel):
    email: EmailStr
    password: str

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
        json_encoders = {ObjectId: str}