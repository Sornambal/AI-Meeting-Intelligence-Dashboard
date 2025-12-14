from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from database import get_db
from models import Meeting as MeetingModel, ActionItem as ActionItemModel, User as UserModel
from schemas import ProcessRequest, ProcessResponse, ActionItemBase
from llm import process_meeting_notes
from datetime import datetime

router = APIRouter(prefix="/meetings", tags=["meetings"])

def get_user_id(authorization: str = Header(None)) -> int:
    """Extract user ID from Authorization header"""
    if not authorization:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing token")
    
    try:
        from jose import jwt
        from config import settings
        
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        return user_id
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

@router.post("/process", response_model=ProcessResponse)
def process_meeting(
    request: ProcessRequest,
    user_id: int = Depends(get_user_id),
    db: Session = Depends(get_db)
):
    """Process meeting notes and extract summary, MoM, and action items"""
    
    # Verify user exists
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    # Process notes with LLM
    llm_result = process_meeting_notes(request.prompt)
    
    # Create meeting record
    meeting = MeetingModel(
        user_id=user_id,
        note_text=request.prompt,
        summary=llm_result.get("summary", ""),
        minutes=llm_result.get("minutes", "")
    )
    
    db.add(meeting)
    db.commit()
    db.refresh(meeting)
    
    # Create action items
    action_items_data = llm_result.get("action_items", [])
    created_action_items = []
    
    for item in action_items_data:
        action_item = ActionItemModel(
            meeting_id=meeting.id,
            task=item.get("task", ""),
            owner=item.get("owner", ""),
            deadline=item.get("deadline"),
            priority=item.get("priority", "Medium")
        )
        db.add(action_item)
        created_action_items.append(action_item)
    
    db.commit()
    
    # Return response
    return {
        "meeting_id": meeting.id,
        "summary": meeting.summary,
        "minutes": meeting.minutes,
        "action_items": [
            ActionItemBase(
                task=item.task,
                owner=item.owner,
                deadline=item.deadline,
                priority=item.priority
            ) for item in created_action_items
        ],
        "created_at": meeting.created_at
    }

@router.get("/history")
def get_meeting_history(user_id: int = Depends(get_user_id), db: Session = Depends(get_db)):
    """Get all meetings for current user"""
    
    meetings = db.query(MeetingModel).filter(MeetingModel.user_id == user_id).all()
    
    return [{
        "id": m.id,
        "note_text": m.note_text[:100] + "..." if len(m.note_text) > 100 else m.note_text,
        "summary": m.summary[:100] + "..." if m.summary and len(m.summary) > 100 else m.summary,
        "created_at": m.created_at
    } for m in meetings]
