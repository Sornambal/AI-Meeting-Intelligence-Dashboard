# 🧠 Meeting Action Extractor
AI-powered backend that converts meeting notes into structured action items using LLMs.

---

## 📌 One-Line Description
A FastAPI-based AI workflow that processes meeting transcripts (from voice-first platforms like SpeakSpace) and automatically extracts structured action items including owner, task, deadline, priority, and confidence.

---

## 🧩 Problem Statement

Meetings generate important decisions and follow-up tasks, but these are often lost in unstructured voice notes or long transcripts. Most voice applications stop at speech-to-text conversion and fail to transform spoken intent into actionable workflows.

This creates inefficiency, missed deadlines, and poor accountability.

---

## 💡 Solution Overview

This project provides a **custom SpeakSpace-compatible backend workflow** that:

1. Receives meeting notes already converted from voice to text
2. Uses a Large Language Model (LLM) to understand intent
3. Extracts actionable tasks with structured metadata
4. Returns clean, machine-readable JSON output

The system is designed to be **production-ready**, **scalable**, and **easy to integrate** with voice-first platforms.

---

## 🔄 End-to-End Workflow

User speaks in meeting
↓
SpeakSpace (Voice → Text)
↓
POST request to backend API
↓
LLM extracts action items
↓
Structured JSON response

---

## 🛠️ Tech Stack

- **Backend**: Python, FastAPI
- **AI / LLM**: Groq API (LLaMA-3.1-8B-Instant)
- **Validation**: Pydantic
- **Environment Management**: python-dotenv
- **Deployment**: Render / Railway / Cloud VM

---

## 📥 API Details

### Endpoint
POST /process

### Request Body
```json
{
  "prompt": "Ravi will update the dashboard by Friday",
  "note_id": "note_1",
  "timestamp": "2025-12-10T10:00:00Z",
  "user_id": "123"
}
```

### Response
```json
{
  "status": "success",
  "meeting_id": "note_1",
  "user_id": "123",
  "actions": [
    {
      "task": "Update the dashboard",
      "owner": "Ravi",
      "deadline": "Friday",
      "priority": "Medium",
      "confidence": 1.0
    }
  ],
  "summary": "Ravi will update the dashboard by Friday",
  "metadata": {
    "model": "llama3-8b-groq",
    "processed_at": "2025-12-13T15:33:22Z",
    "source": "SpeakSpace"
  }
}
```

---

## ⚙️ Local Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/agentic_meeting_extractor.git
   cd agentic_meeting_extractor
   ```

2. **Create and Activate Virtual Environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Variables**
   - Copy `.env.example` to `.env`
   - Fill in your `GROQ_API_KEY`

5. **Run the Application**
   ```bash
   uvicorn app.main:app --reload
   ```
   - Open Swagger UI at: `http://127.0.0.1:8000/docs`

---

## 🌐 Deployment Guide (For Judges)

This backend can be deployed using Render (Free Tier).

### Deployment Steps
1. Push the repository to GitHub
2. Create a new Web Service on Render
3. Connect the GitHub repository
4. Set the Start Command:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 10000
   ```
5. Add Environment Variable:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```
6. Deploy and ensure the service remains live during evaluation

Once deployed, the API will be available at:
```
https://your-app-name.onrender.com/process
```

**⚠️ Critical: Your API Must Be Live (Functional) during judging. If not, the submission may be disqualified.**

---

## 🔗 Sample SpeakSpace Action Configuration (Copy-Paste Ready)

**Title:**
```
Extract Meeting Actions
```

**Description:**
```
Converts meeting voice notes into structured action items
```

**Prompt Template:**
```
Extract action items from this meeting note and return structured tasks: $PROMPT
```

**API URL:**
```
https://your-app-name.onrender.com/process
```

**Authorization:**
```
None required (or add API_TOKEN if configured)
```

---



## 🚀 Live Demo Instructions

To test the API endpoint:

1. Start the local server: `uvicorn app.main:app --reload`
2. Use curl or Postman to send a POST request to `http://127.0.0.1:8000/process`
3. Use the sample request body above
4. Verify the structured JSON response

For deployed version, replace localhost with your Render URL.

---

## 📄 Environment File Template (.env.example)

```
# Groq API Configuration
GROQ_API_KEY=your_groq_api_key_here

# Model Configuration
GROQ_MODEL=llama3-8b-groq

# Source Name
SOURCE_NAME=SpeakSpace

# API URL (optional, defaults to Groq)
GROQ_API_URL=https://api.groq.com/openai/v1/chat/completions

# API Token (optional)
API_TOKEN=
```

---

## 📂 Project Structure

```
agentic_meeting_extractor/
├── app/
│   ├── __init__.py
│   ├── main.py          # FastAPI app entry
│   ├── api.py           # /process endpoint
│   ├── schemas.py       # Pydantic models
│   ├── llm.py           # Groq LLM integration
│   ├── prompts.py       # LLM prompt templates
│   ├── postprocess.py   # JSON parsing and normalization
│   └── config.py        # Environment config
├── .env                 # Environment variables (copy from .env.example)
├── .env.example         # Environment template
├── requirements.txt     # Python dependencies
└── README.md            # This file
