# Meeting Action Extractor 🎯

A full-stack web application for processing meeting notes and automatically extracting:
- **Meeting Summary** 📝
- **Minutes of Meeting (MoM)** 📋
- **Action Items / To-Do Tasks** ✅

Powered by **FastAPI** backend with **AI processing** (Groq LLaMA-3.1) and **React** frontend.

---

## 🚀 Quick Start

### Option 1: Windows Setup (Easiest)
```bash
setup_backend.bat
```

### Option 2: Linux/Mac Setup
```bash
chmod +x setup_backend.sh
./setup_backend.sh
```

### Option 3: Manual Setup

#### Backend
```bash
# 1. Install dependencies
cd backend
pip install -r requirements.txt

# 2. Setup .env
cp .env.example .env
# Edit .env with your Groq API key

# 3. Start PostgreSQL with Docker
docker run --name meeting-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=meeting_extractor -p 5432:5432 -d postgres:15-alpine

# 4. Run backend
python main.py
```

Backend: **http://localhost:8000**
Docs: **http://localhost:8000/docs**

#### Frontend
```bash
# 1. Install dependencies
cd frontend
npm install

# 2. Start dev server
npm run dev
```

Frontend: **http://localhost:3000**

---

## 📋 Features

### ✅ User Authentication
- Sign up with email, name, phone
- Secure login with JWT tokens
- Protected routes

### 📝 Meeting Processing
- Type meeting notes manually
- Record via voice (Web Speech API)
- Process with AI (Groq LLaMA-3.1)

### 📊 Output
- **Summary**: Key meeting highlights
- **MoM**: Bullet points of topics, decisions, key points
- **Action Items**: Tasks with owner, deadline, priority
- Copy to clipboard
- Download as PDF

### 🎨 Professional UI
- Modern React + Tailwind CSS design
- Responsive mobile-friendly layout
- Loading states and error handling
- Beautiful gradient backgrounds

---

## 🏗️ Project Structure

```
meeting-action-extractor/
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── pages/           # Login, Signup, Dashboard
│   │   ├── components/      # Input, Output, Protected Route
│   │   ├── hooks/           # useSpeechRecognition
│   │   └── utils/           # API, Auth, Functions
│   └── package.json
│
├── backend/                  # FastAPI backend
│   ├── main.py              # Main application
│   ├── config.py            # Configuration
│   ├── database.py          # Database connection
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   ├── auth.py              # JWT authentication
│   ├── llm.py               # Groq integration
│   ├── routes/
│   │   ├── auth.py          # Sign up, Login
│   │   └── meetings.py      # Process, History
│   └── requirements.txt
│
├── docker-compose.yml       # Full stack setup
└── README.md
```

---

## 🔧 API Endpoints

### Authentication
```
POST   /auth/signup          Register new user
POST   /auth/login           Login user
GET    /auth/me              Get current user (protected)
```

### Meetings
```
POST   /meetings/process     Process meeting notes (protected)
GET    /meetings/history     Get user's meeting history (protected)
```

### Health
```
GET    /                     API info
GET    /health               Health check
```

---

## 🗄️ Database Schema

### Users
```sql
id (PK), email (unique), name, phone, password_hash, is_active, created_at
```

### Meetings
```sql
id (PK), user_id (FK), note_text, summary, minutes, created_at
```

### Action Items
```sql
id (PK), meeting_id (FK), owner_id (FK), task, owner, deadline, priority, completed, created_at
```

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/meeting_extractor
SECRET_KEY=your-secret-key-change-in-production
GROQ_API_KEY=your-groq-api-key-from-console.groq.com
```

### Frontend (`frontend/.env`)
```env
REACT_APP_API_URL=http://localhost:8000
```

---

## 📦 Technologies

### Frontend
- React 18.2 with Vite
- Tailwind CSS
- Axios
- React Router
- Web Speech API
- jsPDF & html2canvas

### Backend
- FastAPI
- SQLAlchemy ORM
- PostgreSQL
- Groq API
- JWT Authentication
- Bcrypt

### Deployment
- Docker & Docker Compose
- Railway.app or Render.com
- Vercel (frontend)

---

## 🧪 Testing

### Test Signup
```bash
curl -X POST http://localhost:8000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "phone": "+1234567890",
    "password": "password123"
  }'
```

### Test Process Meeting
```bash
curl -X POST http://localhost:8000/meetings/process \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "John will handle frontend by Dec 20. Sarah will do backend by Dec 25."
  }'
```

---

## 🚢 Production Deployment

### Backend on Railway.app
1. Connect GitHub repo
2. Deploy FastAPI app
3. Add PostgreSQL instance
4. Set environment variables

### Frontend on Vercel
1. Import repository
2. Set `REACT_APP_API_URL` to production backend URL
3. Deploy

---

## 📝 API Response Examples

### Signup/Login Response
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
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

### Process Meeting Response
```json
{
  "meeting_id": 1,
  "summary": "Team discussed Q1 roadmap and assigned tasks for upcoming projects.",
  "minutes": "- Q1 Roadmap Discussed\n- John: Frontend by Dec 20\n- Sarah: Backend by Dec 25\n- Budget: $10,000 approved",
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

---

## ⚠️ Troubleshooting

### PostgreSQL Connection Error
```bash
# Verify database is running
psql postgresql://postgres:postgres@localhost:5432/meeting_extractor

# Or start with Docker
docker run --name meeting-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=meeting_extractor -p 5432:5432 -d postgres:15-alpine
```

### Port Already in Use
```bash
# Find and kill process on port 8000
lsof -i :8000
kill -9 <PID>
```

### GROQ_API_KEY Error
- Get key from https://console.groq.com
- Add to `backend/.env`
- Restart backend server

---

## 📚 Documentation

- **Backend**: See `backend/README.md`
- **Setup Guide**: See `BACKEND_SETUP.md`
- **API Docs**: http://localhost:8000/docs (Swagger)

---

## 🎯 Future Features

- [ ] Multiple languages support
- [ ] Batch processing
- [ ] Meeting recordings upload
- [ ] Team collaboration
- [ ] Analytics dashboard
- [ ] Email notifications
- [ ] Calendar integration

---

## 📄 License

MIT

---

## 👥 Support

For issues or questions:
1. Check documentation in `BACKEND_SETUP.md`
2. Review API docs at `http://localhost:8000/docs`
3. Check logs for error messages

---

**Built with ❤️ using FastAPI + React**
