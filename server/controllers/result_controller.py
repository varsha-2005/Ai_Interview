from fastapi import HTTPException, Depends
from config.database import db
from models.result import ResultCreate
from bson import ObjectId
import random
from datetime import datetime
from utils.auth import get_current_user

async def save_result(result: ResultCreate, user):
    result_dict = result.dict()
    result_dict["user"] = ObjectId(user["_id"])
    result_dict["interview"] = ObjectId(result_dict["interview"]) if result_dict.get("interview") else None
    result_dict["createdAt"] = datetime.utcnow()
    res = await db.results.insert_one(result_dict)
    result_dict["id"] = str(res.inserted_id)
    result_dict.pop("_id", None)
    return result_dict

async def generate_result(interviewId: str):
    score = 60 + random.randint(0, 40)
    feedback = (
        "Excellent technical knowledge and problem solving." if score >= 80
        else "Good progress, work on edgecases and optimization." if score >= 65
        else "Please revisit fundamentals and practice more problems."
    )
    
    result_dict = {
        "interview": interviewId,
        "scores": {"interview": score},
        "feedback": feedback
    }
    res = await db.results.insert_one(result_dict)
    result_dict["id"] = str(res.inserted_id)
    return result_dict