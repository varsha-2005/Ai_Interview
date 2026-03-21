from fastapi import APIRouter, Depends
from controllers.job_controller import create_job
from models.job import JobCreate
from utils.auth import get_current_user

router = APIRouter()

@router.post("/")
async def create(job: JobCreate, user = Depends(get_current_user)):
    return await create_job(job, user)