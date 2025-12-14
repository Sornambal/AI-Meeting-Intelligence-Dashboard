# Frontend README

## Installation

```bash
cd frontend
npm install
```

## Environment Setup

Create a `.env.local` file with:

```
VITE_API_BASE_URL=https://meeting-action-extractor.onrender.com
```

## Development

```bash
npm run dev
```

The app will run on `http://localhost:3000`

## Build

```bash
npm run build
```

## Features

- 📝 User signup and login with JWT authentication
- 🎙️ Web Speech API for voice-to-text conversion
- 📊 Real-time processing of meeting notes
- 📋 Meeting summary, minutes, and action items
- 📥 PDF export and copy-to-clipboard features
- 📱 Responsive design with Tailwind CSS
- 🔒 Protected routes and token-based authentication

## Architecture

- `src/pages/` - Page components (Signup, Login, Dashboard)
- `src/components/` - Reusable components (InputSection, OutputPanels, etc.)
- `src/hooks/` - Custom React hooks (useAuth, useSpeechRecognition)
- `src/utils/` - Utility functions (API calls, auth helpers)
