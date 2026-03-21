from fastapi import APIRouter, Depends, Query
from controllers.interview_controller import start_interview, get_questions
from models.interview import InterviewCreate
from utils.auth import get_current_user

router = APIRouter()

@router.post("/start")
async def start(interview: InterviewCreate, user = Depends(get_current_user)):
    return await start_interview(interview, user)

@router.get("/questions")
async def questions(
    company: str = Query(...),
    difficulty: str = Query(...),
    role: str = Query("Full Stack Engineer"),
    resumeText: str = Query(""),
    mode: str = Query("Full interview")
):
    return await get_questions(company, difficulty, role, resumeText, mode)