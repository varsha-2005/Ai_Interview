from fastapi import APIRouter
from controllers.auth_controller import register_user, login_user
from models.user import UserCreate
from pydantic import BaseModel

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/register")
async def register(user: UserCreate):
    return await register_user(user)

@router.post("/login")
async def login(request: LoginRequest):
    return await login_user(request.email, request.password)