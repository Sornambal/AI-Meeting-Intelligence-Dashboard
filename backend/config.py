import os
from dotenv import load_dotenv
from pathlib import Path

# Load .env from backend directory
backend_dir = Path(__file__).parent
load_dotenv(backend_dir / ".env")

class Settings:
    # Database
    DATABASE_URL = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:postgres@localhost:5432/meeting_extractor"
    )
    
    # JWT
    SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 30 * 24  # 30 days
    
    # Groq API
    GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
    
    # CORS
    CORS_ORIGINS = ["*"]
    
    # App
    APP_NAME = "Meeting Action Extractor"
    APP_VERSION = "1.0.0"

settings = Settings()
