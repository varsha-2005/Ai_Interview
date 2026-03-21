from fastapi import UploadFile, File, HTTPException, Depends
from config.database import db
from models.resume import Resume
from ai.ai_service import create_embedding
from utils.auth import get_current_user
from pypdf import PdfReader
import os
from bson import ObjectId

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

async def upload_resume(file: UploadFile, user):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())
    
    text = ""
    try:
        reader = PdfReader(file_path)
        for page in reader.pages:
            text += page.extract_text() + "\n"
    except Exception as e:
        print(f"PDF parsing failed: {e}")
        text = ""
    
    embedding = create_embedding(text)
    
    resume_dict = {
        "user": ObjectId(user["_id"]),
        "fileUrl": file_path,
        "originalName": file.filename,
        "text": text,
        "embedding": embedding
    }
    
    result = await db.resumes.insert_one(resume_dict)
    resume_dict["id"] = str(result.inserted_id)
    resume_dict.pop("_id", None)
    return resume_dict