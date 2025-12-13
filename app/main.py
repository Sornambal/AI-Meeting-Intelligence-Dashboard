from fastapi import FastAPI
from app.api import router

app = FastAPI(title="AI-Powered Voice-Based Meeting Action Extractor")

# Mount API router
app.include_router(router)
