from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import triage, auth
import models
from database import engine

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=False,
    expose_headers=["*"],
)

app.include_router(auth.router)
app.include_router(triage.router)

@app.get("/")
async def root():
    return {"status": "AI Triage Backend Running (with DB Auth)"}