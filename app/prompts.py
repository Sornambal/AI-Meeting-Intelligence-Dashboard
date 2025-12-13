"""Prompt template instructing the model to return STRICT JSON only."""

MEETING_PROMPT = """
You are a JSON-only assistant. Your response must be valid JSON and nothing else. No explanations, no markdown, no extra text.

Extract action items from the meeting text below. Output ONLY a JSON object with this exact structure:

{{
  "actions": [
    {{
      "task": "string description of the task",
      "owner": "string name of person responsible, or null if none",
      "deadline": "string deadline or null",
      "priority": "Low|Medium|High",
      "confidence": 0.0 to 1.0
    }}
  ],
  "summary": "1-2 sentence summary of actions"
}}

Rules:
- If no actions found, actions should be an empty array []
- Priority defaults to "Medium" if unclear
- Confidence is your certainty (0.0-1.0)
- Output ONLY the JSON, no other text

Meeting text: {meeting_text}

JSON output:
"""
