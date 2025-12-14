import json
import os
from config import settings

# Initialize Groq client only if API key is available
client = None
if settings.GROQ_API_KEY and settings.GROQ_API_KEY.startswith("gsk_"):
    try:
        from groq import Groq
        # Initialize Groq client without problematic parameters
        client = Groq(api_key=settings.GROQ_API_KEY)
        print("✓ Groq client initialized successfully")
    except Exception as e:
        print(f"Warning: Could not initialize Groq client: {e}")
        print("Running in demo mode - real AI processing will not be available")
        client = None
else:
    print("Warning: GROQ_API_KEY not configured. Running in demo mode.")

def process_meeting_notes(meeting_text: str) -> dict:
    """
    Process meeting notes using Groq LLaMA and extract:
    - Summary
    - Minutes of Meeting (MoM)
    - Action Items
    """
    
    # If client is not initialized, return mock data
    if not client:
        return {
            "summary": "Meeting processed (Demo mode - configure GROQ_API_KEY for real AI processing)",
            "minutes": "- Demo meeting\n- No actual processing\n- Please configure GROQ_API_KEY in .env",
            "action_items": []
        }
    
    prompt = f"""Analyze the following meeting notes and provide ONLY a valid JSON response with this exact structure. No markdown, no explanations, ONLY JSON:

{{
    "summary": "Brief 2-3 sentence summary of the meeting",
    "minutes": "Bullet points of key topics, decisions, and discussion points separated by \\n",
    "action_items": [
        {{"task": "Task description", "owner": "Person responsible", "deadline": "YYYY-MM-DD or TBD", "priority": "High|Medium|Low"}},
        {{"task": "Another task", "owner": "Another person", "deadline": "YYYY-MM-DD or TBD", "priority": "High|Medium|Low"}}
    ]
}}

Meeting Notes:
{meeting_text}

RESPOND WITH ONLY THE JSON OBJECT, NO OTHER TEXT."""
    
    try:
        message = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            max_tokens=2048,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        
        response_text = message.choices[0].message.content.strip()
        print(f"DEBUG: Raw response length: {len(response_text)}")
        print(f"DEBUG: First 200 chars: {response_text[:200]}")
        
        # Parse JSON from response
        try:
            # Try to find JSON in the response
            json_start = response_text.find('{')
            json_end = response_text.rfind('}') + 1
            if json_start != -1 and json_end > json_start:
                json_str = response_text[json_start:json_end]
                result = json.loads(json_str)
            else:
                result = json.loads(response_text)
            
            # Validate the structure
            if "summary" not in result:
                result["summary"] = ""
            if "minutes" not in result:
                result["minutes"] = ""
            if "action_items" not in result:
                result["action_items"] = []
            
            print(f"DEBUG: Successfully parsed JSON with {len(result.get('action_items', []))} action items")
            return result
        except json.JSONDecodeError as e:
            print(f"JSON parse error: {e}")
            print(f"Response text: {response_text[:500]}")
            # Fallback: return structured response even if parsing fails
            return {
                "summary": response_text[:200],
                "minutes": response_text[200:500] if len(response_text) > 200 else "",
                "action_items": []
            }
    except Exception as e:
        print(f"Error processing with Groq: {e}")
        return {
            "summary": "Error processing meeting",
            "minutes": f"Error: {str(e)}",
            "action_items": []
        }
