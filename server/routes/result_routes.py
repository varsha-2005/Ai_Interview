from fastapi import APIRouter, Depends
from controllers.result_controller import save_result, generate_result
from models.result import ResultCreate
from utils.auth import get_current_user
from pydantic import BaseModel

router = APIRouter()

class GenerateRequest(BaseModel):
    interviewId: str

@router.post("/")
async def save(result: ResultCreate, user = Depends(get_current_user)):
    return await save_result(result, user)

@router.post("/generate")
async def generate(request: GenerateRequest):
    return await generate_result(request.interviewId)