from fastapi import HTTPException, Depends
from config.database import db
from models.job import JobCreate
from utils.auth import get_current_user
from bson import ObjectId

async def create_job(job: JobCreate, user):
    job_dict = job.dict()
    job_dict["user"] = ObjectId(user["_id"])
    result = await db.jobs.insert_one(job_dict)
    job_dict["id"] = str(result.inserted_id)
    job_dict.pop("_id", None)
    return job_dict