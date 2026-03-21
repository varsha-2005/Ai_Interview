from fastapi import Depends
from ai.ai_service import evaluate_answer
from pydantic import BaseModel

class AnswerRequest(BaseModel):
    interviewId: str
    questionId: str
    question: str
    answer: str

async def save_answer(request: AnswerRequest):
    result = evaluate_answer(request.question, request.answer)
    return {
        "interviewId": request.interviewId,
        "questionId": request.questionId,
        "score": result["score"],
        "evaluation": result["evaluation"],
        "note": "Evaluated",
        "saved": True
    }