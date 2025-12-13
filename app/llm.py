import requests
from typing import Optional
from app.config import GROQ_API_KEY, GROQ_API_URL, MODEL
from app.prompts import MEETING_PROMPT

# Calls the Groq LLM endpoint and returns raw text response
def extract_action_items(meeting_text: str) -> str:
    if not GROQ_API_KEY:
        raise RuntimeError("GROQ_API_KEY is not set in environment")

    # Use a short system message + user prompt that demands JSON-only output
    system_message = "You are a JSON-only assistant for extracting meeting actions."
    user_prompt = MEETING_PROMPT.format(meeting_text=meeting_text)

    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": system_message},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.0
    }

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    resp = requests.post(GROQ_API_URL, json=payload, headers=headers, timeout=30)
    try:
        resp.raise_for_status()
    except Exception as e:
        raise RuntimeError(f"LLM request failed: {e} - {resp.text}")

    data = resp.json()
    # Prefer chat format
    try:
        return data["choices"][0]["message"]["content"]
    except Exception:
        # Fallback to older shape
        try:
            return data["choices"][0]["text"]
        except Exception:
            return resp.text
