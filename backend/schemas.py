from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TriageSessionCreate(BaseModel):
    reason: str
    score: int
    level: str
    messages: Optional[str] = None

class TriageSessionResponse(BaseModel):
    id: int
    date: datetime
    reason: str
    score: int
    level: str
    messages: Optional[str] = None

    class Config:
        from_attributes = True
