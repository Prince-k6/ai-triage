import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

SYSTEM_PROMPT = """You are an AI medical triage assistant.
Collect symptoms through conversation, ask follow-up questions about duration, severity, and medical history.

At the end of EVERY response, add this exact JSON block:
{"risk_score": 45, "level": "clinic", "reason": "brief reason here"}

Risk levels:
- "home" = score 0-40 (minor, self care at home)
- "clinic" = score 41-70 (needs doctor soon)
- "emergency" = score 71-100 (go to ER immediately)

Always end with: DISCLAIMER: This is not a substitute for professional medical advice.
"""

def generate_triage_response(messages: list) -> str:
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "system", "content": SYSTEM_PROMPT}] + messages,
        max_tokens=1000,
    )
    return response.choices[0].message.content
