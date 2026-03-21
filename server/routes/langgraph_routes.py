from fastapi import APIRouter
from controllers.langgraph_controller import get_interview_flow

router = APIRouter()

@router.get("/flow")
async def interview_flow():
    return get_interview_flow()