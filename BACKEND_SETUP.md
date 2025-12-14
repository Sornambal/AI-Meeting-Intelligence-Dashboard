# Backend Setup Guide

## Option 1: Quick Setup with PostgreSQL (Recommended)

### Prerequisites
- Python 3.11+
- PostgreSQL 14+ (or use Docker)
- Groq API Key from https://console.groq.com

### Step 1: Create PostgreSQL Database with Docker
```bash
docker run --name meeting-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=meeting_extractor -p 5432:5432 -d postgres:15-alpine
```

### Step 2: Install Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Step 3: Configure Environment
Create `.env` file in `backend/` directory:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/meeting_extractor
SECRET_KEY=your-secret-key-change-in-production
GROQ_API_KEY=your-groq-api-key-here
```

### Step 4: Run Backend Server
```bash
python main.py
```

Backend runs at: **http://localhost:8000**

API Documentation: **http://localhost:8000/docs**

---

## Option 2: Docker Compose (Full Stack)

### Step 1: Create `.env` file in root directory
```
GROQ_API_KEY=your-groq-api-key-here
SECRET_KEY=your-secret-key-change-in-production
```

### Step 2: Run Docker Compose
```bash
docker-compose up
```

Services start:
- Frontend: **http://localhost:3000**
- Backend: **http://localhost:8000**
- Database: **localhost:5432**

---

## Testing the Backend

### 1. Sign Up
```bash
curl -X POST http://localhost:8000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "+1234567890",
    "password": "password123"
  }'
```

Response:
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "+1234567890",
    "is_active": true,
    "created_at": "2025-12-14T10:00:00"
  }
}
```

### 2. Process Meeting Notes
```bash
curl -X POST http://localhost:8000/meetings/process \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "John said he will handle frontend development by Dec 20. Sarah will work on backend by Dec 25. Meeting approved budget of $10,000.",
    "note_id": "note_1",
    "timestamp": "2025-12-14T10:00:00"
  }'
```

Response:
```json
{
  "meeting_id": 1,
  "summary": "Team meeting to discuss project roadmap and assign tasks.",
  "minutes": "- Frontend development assigned to John\n- Backend work assigned to Sarah\n- Budget approved: $10,000",
  "action_items": [
    {
      "task": "Complete frontend development",
      "owner": "John",
      "deadline": "2025-12-20",
      "priority": "High"
    },
    {
      "task": "Complete backend development",
      "owner": "Sarah",
      "deadline": "2025-12-25",
      "priority": "High"
    }
  ],
  "created_at": "2025-12-14T10:00:00"
}
```

### 3. Get Meeting History
```bash
curl -X GET http://localhost:8000/meetings/history \
  -H "Authorization: Bearer <access_token>"
```

---

## Database Schema

### Users
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  phone VARCHAR NOT NULL,
  password_hash VARCHAR NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Meetings
```sql
CREATE TABLE meetings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  note_text TEXT NOT NULL,
  summary TEXT,
  minutes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Action Items
```sql
CREATE TABLE action_items (
  id SERIAL PRIMARY KEY,
  meeting_id INTEGER REFERENCES meetings(id),
  owner_id INTEGER REFERENCES users(id),
  task VARCHAR NOT NULL,
  owner VARCHAR NOT NULL,
  deadline VARCHAR,
  priority VARCHAR DEFAULT 'Medium',
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Troubleshooting

### PostgreSQL Connection Error
Make sure PostgreSQL is running and DATABASE_URL is correct:
```bash
psql postgresql://postgres:postgres@localhost:5432/meeting_extractor
```

### Groq API Error
Verify GROQ_API_KEY is set:
```bash
echo $GROQ_API_KEY
```

### Port 8000 Already in Use
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8000
kill -9 <PID>
```

---

## API Endpoints

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user info

### Meetings
- `POST /meetings/process` - Process meeting notes
- `GET /meetings/history` - Get user's meeting history

---

## Frontend Integration

Update `frontend/.env` to point to backend:
```
REACT_APP_API_URL=http://localhost:8000
```

Frontend will automatically:
- Store JWT token in localStorage
- Include token in Authorization header
- Redirect to login on 401 errors

---

## Production Deployment

### Railway.app
1. Create PostgreSQL instance on Railway
2. Deploy FastAPI app to Railway
3. Set environment variables:
   - `DATABASE_URL` (Railway PostgreSQL URL)
   - `SECRET_KEY` (strong random string)
   - `GROQ_API_KEY` (from console.groq.com)

### Render.com
1. Create PostgreSQL database
2. Connect GitHub repository
3. Deploy FastAPI application
4. Configure environment variables

### Vercel (Frontend)
Deploy React frontend with environment:
```
REACT_APP_API_URL=https://your-backend-url.railway.app
```
