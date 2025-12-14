from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    email: str
    name: str
    phone: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class ActionItemBase(BaseModel):
    task: str
    owner: str
    deadline: Optional[str] = None
    priority: str = "Medium"

class ActionItem(ActionItemBase):
    id: int
    meeting_id: int
    completed: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class MeetingCreate(BaseModel):
    note_text: str

class MeetingResponse(BaseModel):
    id: int
    note_text: str
    summary: Optional[str]
    minutes: Optional[str]
    action_items: list[ActionItem]
    created_at: datetime
    
    class Config:
        from_attributes = True

class ProcessRequest(BaseModel):
    prompt: str
    note_id: Optional[str] = None
    timestamp: Optional[str] = None
    user_id: Optional[int] = None

class ProcessResponse(BaseModel):
    meeting_id: int
    summary: str
    minutes: str
    action_items: list[ActionItemBase]
    created_at: datetime

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: User
