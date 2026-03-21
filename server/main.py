from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="AI Interview API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

from config.database import db
from routes.auth_routes import router as auth_router
from routes.resume_routes import router as resume_router
from routes.job_routes import router as job_router
from routes.interview_routes import router as interview_router
from routes.answer_routes import router as answer_router
from routes.result_routes import router as result_router
from routes.langgraph_routes import router as langgraph_router

app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(resume_router, prefix="/api/resume", tags=["resume"])
app.include_router(job_router, prefix="/api/job", tags=["job"])
app.include_router(interview_router, prefix="/api/interview", tags=["interview"])
app.include_router(answer_router, prefix="/api/answers", tags=["answers"])
app.include_router(result_router, prefix="/api/result", tags=["result"])
app.include_router(langgraph_router, prefix="/api/langgraph", tags=["langgraph"])

@app.get("/")
async def root():
    return {"message": "API running..."}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 5001))
    uvicorn.run(app, host="0.0.0.0", port=port)