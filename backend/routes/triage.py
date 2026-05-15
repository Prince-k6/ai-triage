from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List

from services.llm_service import generate_triage_response
from database import get_db
import models, schemas, auth

router = APIRouter(prefix="/triage", tags=["triage"])

class TriageChatRequest(BaseModel):
    messages: list

@router.post("")
async def triage_chat(request: TriageChatRequest, current_user: models.User = Depends(auth.get_current_user)):
    # Authenticated LLM Chat
    reply = generate_triage_response(request.messages)
    return {"reply": reply}

@router.post("/sessions", response_model=schemas.TriageSessionResponse)
def save_session(session_data: schemas.TriageSessionCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    new_session = models.TriageSession(
        owner_id=current_user.id,
        reason=session_data.reason,
        score=session_data.score,
        level=session_data.level
    )
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    return new_session

@router.get("/sessions", response_model=List[schemas.TriageSessionResponse])
def get_sessions(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.TriageSession).filter(models.TriageSession.owner_id == current_user.id).order_by(models.TriageSession.date.desc()).all()
