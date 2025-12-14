# ⚡ Quick Backend Start (5 Minutes)

## For Windows Users

### Step 1: Start PostgreSQL (one-time)
Open PowerShell and run:
```powershell
docker run --name meeting-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=meeting_extractor -p 5432:5432 -d postgres:15-alpine
```

### Step 2: Get Groq API Key
1. Go to https://console.groq.com
2. Create API key
3. Copy the key

### Step 3: Setup Backend
```powershell
cd backend
pip install -r requirements.txt
```

### Step 4: Create .env file
Create `backend/.env`:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/meeting_extractor
SECRET_KEY=your-secret-key-change-in-production
GROQ_API_KEY=<paste-your-groq-key-here>
```

### Step 5: Run Backend
```powershell
cd backend
python main.py
```

✅ Backend runs at: **http://localhost:8000**
✅ Docs at: **http://localhost:8000/docs**

---

## For Linux/Mac Users

```bash
# Start PostgreSQL
docker run --name meeting-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=meeting_extractor -p 5432:5432 -d postgres:15-alpine

# Install Python dependencies
cd backend
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env and add your GROQ_API_KEY

# Run backend
python main.py
```

---

## Testing Backend is Working

### 1. Sign Up
```bash
curl -X POST http://localhost:8000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "phone": "1234567890",
    "password": "test123"
  }'
```

Expected: Returns user data with `access_token`

### 2. Copy the Token
Look for `"access_token"` in response. Copy the token value (without quotes).

### 3. Process Meeting
```bash
curl -X POST http://localhost:8000/meetings/process \
  -H "Authorization: Bearer <PASTE_TOKEN_HERE>" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "John will handle frontend development by Dec 20. Sarah will do backend by Dec 25."
  }'
```

Expected: Returns summary, minutes, and action items

---

## What's Next?

After backend is running, start frontend:

```bash
# In another terminal
cd frontend
npm run dev
```

Then open: **http://localhost:3000**

---

## Common Issues

### PostgreSQL already running?
```bash
docker stop meeting-db
docker rm meeting-db
docker run --name meeting-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=meeting_extractor -p 5432:5432 -d postgres:15-alpine
```

### Python not found?
Make sure Python 3.11+ is installed and in PATH:
```bash
python --version
```

### Port 8000 in use?
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8000
kill -9 <PID>
```

### GROQ_API_KEY error?
1. Get key from https://console.groq.com
2. Add to `backend/.env`
3. Restart backend (Ctrl+C and `python main.py`)

---

## API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Register user |
| POST | `/auth/login` | Login user |
| GET | `/auth/me` | Get current user |
| POST | `/meetings/process` | Process meeting notes |
| GET | `/meetings/history` | Get meeting history |
| GET | `/health` | Health check |

---

## Files You Need to Edit

1. **backend/.env** (create it)
   ```
   GROQ_API_KEY=your-key-here
   ```

2. **That's it!** Everything else is configured.

---

## Startup Commands Reference

```bash
# Terminal 1: Start PostgreSQL (first time only)
docker run --name meeting-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=meeting_extractor -p 5432:5432 -d postgres:15-alpine

# Terminal 2: Start Backend
cd backend
python main.py

# Terminal 3: Start Frontend  
cd frontend
npm run dev
```

Then visit:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs
