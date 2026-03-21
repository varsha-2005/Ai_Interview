from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from controllers.resume_controller import upload_resume
from ai.ai_service import screen_resume
from config.database import db
from utils.auth import get_current_user
from bson import ObjectId
from pydantic import BaseModel

router = APIRouter()

# ✅ Request body model (THIS FIXES YOUR ERROR)
class ScreenRequest(BaseModel):
    resumeId: str
    jobDescription: str
    company: str

# 📄 Upload Resume
@router.post("/")
async def upload(file: UploadFile = File(...), user = Depends(get_current_user)):
    return await upload_resume(file, user)

# 🤖 Screen Resume (FIXED)
@router.post("/screen")
async def screen(request: ScreenRequest, user = Depends(get_current_user)):
    try:
        resume = await db.resumes.find_one({
            "_id": ObjectId(request.resumeId),
            "user": ObjectId(user["_id"])
        })

        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")

        result = screen_resume(
            resume["text"],
            request.jobDescription,
            request.company
        )

        return result

    except Exception as e:
        print(f"Screening error: {e}")
        raise HTTPException(status_code=500, detail="Screening failed")