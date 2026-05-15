from fastapi import APIRouter
from pydantic import BaseModel
from services.llm_service import generate_triage_response

router = APIRouter()

class TriageRequest(BaseModel):
    messages: list

@router.post("/triage")
async def triage(request: TriageRequest):
    reply = generate_triage_response(request.messages)
    return {"reply": reply}
