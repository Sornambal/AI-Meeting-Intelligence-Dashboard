from fastapi import APIRouter
from fastapi.responses import JSONResponse
from datetime import datetime

from app.schemas import SpeakSpaceRequest
from app.llm import extract_action_items
from app.postprocess import parse_actions_and_summary
from app.config import MODEL, SOURCE_NAME

router = APIRouter()

@router.post("/process", summary="Extract action items from meeting text", response_description="Structured actions and summary")
async def process_meeting(req: SpeakSpaceRequest):
    """Process meeting text and return structured action items.

    This endpoint always returns HTTP 200 with a structured JSON body.
    """
    meeting_text = req.prompt or ""

    try:
        raw = extract_action_items(meeting_text)
    except Exception as e:
        # If the LLM call failed, return a graceful response with empty actions and an error note
        return JSONResponse(status_code=200, content={
            "status": "success",
            "meeting_id": req.note_id,
            "user_id": req.user_id,
            "actions": [],
            "summary": "",
            "metadata": {
                "model": MODEL,
                "processed_at": datetime.utcnow().isoformat() + "Z",
                "source": SOURCE_NAME,
                "note": f"llm_error: {str(e)}"
            }
        })

    actions, summary, parse_error = parse_actions_and_summary(raw)

    metadata = {
        "model": MODEL,
        "processed_at": datetime.utcnow().isoformat() + "Z",
        "source": SOURCE_NAME
    }
    if parse_error:
        metadata["parse_error"] = parse_error

    response = {
        "status": "success",
        "meeting_id": req.note_id,
        "user_id": req.user_id,
        "actions": actions,
        "summary": summary,
        "metadata": metadata
    }

    return JSONResponse(status_code=200, content=response)
