from typing import List, Optional, Any
from pydantic import BaseModel, Field


class SpeakSpaceRequest(BaseModel):
    prompt: str = Field(..., description="Meeting text, already transcribed from audio")
    note_id: str = Field(..., description="Unique meeting/note id")
    timestamp: str = Field(..., description="ISO timestamp string")
    user_id: Optional[str] = Field(None, description="Optional user id")


class ActionItem(BaseModel):
    task: str = Field(..., description="Action task description")
    owner: Optional[str] = Field(None, description="Person responsible for the task")
    deadline: Optional[str] = Field(None, description="Deadline (string or ISO date)")
    priority: Optional[str] = Field(None, description="Low/Medium/High")
    confidence: Optional[float] = Field(None, ge=0.0, le=1.0)


class ProcessedResponse(BaseModel):
    status: str
    meeting_id: str
    user_id: Optional[str]
    actions: List[ActionItem]
    summary: Optional[str]
    metadata: Any
