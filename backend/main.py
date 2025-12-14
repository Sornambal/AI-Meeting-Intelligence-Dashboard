from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
import os

# Check if Groq API key is configured - if it is, we can do real processing
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "").strip()
HAS_DATABASE = False

try:
    from database import engine, Base
    from routes import auth, meetings
    import models
    
    # Try to create tables - this will fail if no database, but that's OK
    Base.metadata.create_all(bind=engine)
    HAS_DATABASE = True
except Exception as e:
    print(f"Note: Database not available: {type(e).__name__}")
    print("Processing meetings will work with LLM, but data will not be persisted to database")
    auth = None
    meetings = None

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes if database is available
if HAS_DATABASE and auth and meetings:
    app.include_router(auth.router)
    app.include_router(meetings.router)
else:
    # Demo/LLM-only routes (no database persistence)
    from pydantic import BaseModel
    
    class SignupRequest(BaseModel):
        email: str
        name: str
        phone: str
        password: str
    
    class LoginRequest(BaseModel):
        email: str
        password: str
    
    class MeetingProcessRequest(BaseModel):
        text: str
    
    @app.post("/auth/signup")
    def demo_signup(user: SignupRequest):
        return {
            "access_token": "demo-token-123",
            "token_type": "bearer",
            "user": {
                "id": 1,
                "email": user.email,
                "name": user.name,
                "phone": user.phone,
                "is_active": True,
                "created_at": "2025-12-14T00:00:00"
            }
        }
    
    @app.post("/auth/login")
    def demo_login(credentials: LoginRequest):
        return {
            "access_token": "demo-token-123",
            "token_type": "bearer",
            "user": {
                "id": 1,
                "email": credentials.email,
                "name": "Demo User",
                "phone": "000000000",
                "is_active": True,
                "created_at": "2025-12-14T00:00:00"
            }
        }
    
    @app.post("/meetings/process")
    def demo_process(meeting: MeetingProcessRequest):
        # Import the LLM processor
        from llm import process_meeting_notes
        
        # Process the meeting text using LLM
        result = process_meeting_notes(meeting.text)
        
        return {
            "meeting_id": 1,
            "summary": result.get("summary", ""),
            "minutes": result.get("minutes", ""),
            "action_items": result.get("action_items", []),
            "created_at": "2025-12-14T00:00:00"
        }

@app.get("/")
def read_root():
    return {
        "message": "Meeting Action Extractor API",
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "mode": "DATABASE" if HAS_DATABASE else "LLM_ONLY"
    }

@app.get("/health")
def health_check():
    return {"status": "ok", "mode": "DATABASE" if HAS_DATABASE else "LLM_ONLY"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
