from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import triage

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=False,
    expose_headers=["*"],
)

app.include_router(triage.router)

@app.get("/")
async def root():
    return {"status": "AI Triage Backend Running"}