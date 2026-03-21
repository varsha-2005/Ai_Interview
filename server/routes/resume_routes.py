from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Query
from controllers.resume_controller import upload_resume
from ai.ai_service import screen_resume
from config.database import db
from utils.auth import get_current_user
from bson import ObjectId
from pydantic import BaseModel

router = APIRouter()

@router.post("/")
async def upload(file: UploadFile = File(...), user = Depends(get_current_user)):
    return await upload_resume(file, user)

@router.post("/screen")
async def screen(
    resumeId: str = Query(...),
    jobDescription: str = Query(...),
    company: str = Query(...),
    user = Depends(get_current_user)
):
    resume = await db.resumes.find_one({"_id": ObjectId(resumeId), "user": ObjectId(user["_id"])})
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    result = screen_resume(resume["text"], jobDescription, company)
    return result