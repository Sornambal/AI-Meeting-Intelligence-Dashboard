import os
from dotenv import load_dotenv

# Load environment from .env in project root (if present)
load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
MODEL = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")
SOURCE_NAME = os.getenv("SOURCE_NAME", "SpeakSpace")

# For local tests, allow overriding model endpoint
GROQ_API_URL = os.getenv("GROQ_API_URL", "https://api.groq.com/openai/v1/chat/completions")
API_TOKEN = os.getenv("API_TOKEN", "")
