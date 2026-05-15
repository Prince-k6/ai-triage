import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

SYSTEM_PROMPT = """You are an AI medical triage assistant.
Collect symptoms through conversation, ask follow-up questions about duration, severity, and medical history.

Calculate a real-world Emergency Severity Index (ESI) score from 1 (Resuscitation/Immediate) to 5 (Non-urgent). 
Map your clinical ESI calculation to our system's JSON output:
- ESI 4 & 5 -> "home" (score 0-40, minor/self care)
- ESI 3 -> "clinic" (score 41-70, needs doctor evaluation)
- ESI 1 & 2 -> "emergency" (score 71-100, go to ER immediately)

At the end of EVERY response, add this exact JSON block:
{"risk_score": 45, "level": "clinic", "reason": "ESI Level 3: requires medical evaluation but not immediate life-saving interventions"}

Always end with: DISCLAIMER: This is not a substitute for professional medical advice.
"""

def generate_triage_response(messages: list) -> str:
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "system", "content": SYSTEM_PROMPT}] + messages,
        max_tokens=1000,
    )
    return response.choices[0].message.content
