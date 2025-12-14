# Meeting Action Extractor - Backend

Fast API backend for processing meeting notes with AI.

## Setup

### 1. Prerequisites
- Python 3.11+
- PostgreSQL 14+
- Groq API Key

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Create .env file
Copy `.env.example` to `.env` and update:
```
DATABASE_URL=postgresql://user:password@localhost:5432/meeting_extractor
SECRET_KEY=your-secret-key-here
GROQ_API_KEY=your-groq-api-key
```

### 4. Create PostgreSQL Database
```bash
createdb meeting_extractor
```

### 5. Run Server
```bash
python main.py
```

Server runs on `http://localhost:8000`

### API Documentation
- Swagger: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user (requires token)

### Meetings
- `POST /meetings/process` - Process meeting notes
- `GET /meetings/history` - Get user's meeting history

## Database Schema

### Users Table
- id (integer, primary key)
- email (string, unique)
- name (string)
- phone (string)
- password_hash (string)
- is_active (boolean)
- created_at (datetime)

### Meetings Table
- id (integer, primary key)
- user_id (integer, foreign key)
- note_text (text)
- summary (text)
- minutes (text)
- created_at (datetime)

### Action Items Table
- id (integer, primary key)
- meeting_id (integer, foreign key)
- owner_id (integer, foreign key, nullable)
- task (string)
- owner (string)
- deadline (string, nullable)
- priority (string)
- completed (boolean)
- created_at (datetime)
