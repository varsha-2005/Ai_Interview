from fastapi import APIRouter
from controllers.answer_controller import save_answer
from controllers.answer_controller import AnswerRequest

router = APIRouter()

@router.post("/")
async def save(request: AnswerRequest):
    return await save_answer(request)