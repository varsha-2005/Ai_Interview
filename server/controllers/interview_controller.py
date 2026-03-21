from fastapi import HTTPException, Depends, Query
from config.database import db
from models.interview import InterviewCreate
from ai.ai_service import generate_questions
from utils.auth import get_current_user
from bson import ObjectId

async def start_interview(interview: InterviewCreate, user):
    interview_dict = interview.dict()
    interview_dict["user"] = ObjectId(user["_id"])
    if interview_dict.get("job"):
        interview_dict["job"] = ObjectId(interview_dict["job"]) if interview_dict["job"] else None
    if interview_dict.get("resume"):
        interview_dict["resume"] = ObjectId(interview_dict["resume"]) if interview_dict["resume"] else None
    result = await db.interviews.insert_one(interview_dict)
    interview_dict["id"] = str(result.inserted_id)
    interview_dict.pop("_id", None)
    return interview_dict

async def get_questions(
    company: str,
    difficulty: str,
    role: str = "Full Stack Engineer",
    resumeText: str = "",
    mode: str = "Full interview"
):
    result = generate_questions(company, difficulty, role, resumeText, mode)
    return result["questions"]