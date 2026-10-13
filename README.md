# 🏛️ HeritageLens — AI + AR Smart Tourism Explorer

> *"See the Past. Understand the Present. Preserve the Future."*

HeritageLens is a full-stack AI-powered heritage tourism application.  
Point your camera at a monument, identify it with AI, explore it in 3D, and chat with an intelligent heritage guide — all in English and Tamil.

---

## ✨ Features

| Feature | Description |
|---|---|
| **📷 Live Camera Scan** | Real browser camera (getUserMedia) — capture, retake, upload |
| **🤖 AI Identification** | Google Gemini / GPT-4o vision identifies monuments with confidence scores |
| **💬 Heritage Chatbot** | Bilingual (EN/Tamil) AI guide with conversation history & TTS |
| **🏛️ 3D Explorer** | React Three Fiber viewer — GLTF/GLB models or procedural fallback |
| **🕰️ See the Past** | Cinematic present ↔ historical photo comparison + timeline |
| **🗺️ Heritage Map** | Leaflet map of all heritage sites |
| **🏅 Gamification** | Points, badges, quiz |

---

## 🚀 Quick Start (Local)

### Prerequisites

| Tool | Version | Install |
|---|---|---|
| Node.js | 18 + | https://nodejs.org |
| npm     | 9 +  | bundled with Node |

---

### 1. Clone & install frontend

```bash
# from the project root (HeritageLens/)
npm install
```

### 2. Configure frontend environment

```bash
copy .env.example .env
# The default VITE_AI_API_URL=http://localhost:3001 works out of the box
```

### 3. Install & configure backend

```bash
cd backend
npm install

# Copy the example env
copy .env.example .env
```

Open `backend/.env` and add **at least one** AI key:

```env
# Option A — Google Gemini (free tier, recommended)
# Get key: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=AIza...

# Option B — OpenAI GPT-4o
# Get key: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-...
```

> **No key?** The app still works with a curated demo fallback — no API key needed to run locally.

---

### 4. Start both servers

Open **two terminals**:

**Terminal 1 — Backend**
```bash
cd backend
npm run dev
# → http://localhost:3001
```

**Terminal 2 — Frontend**
```bash
# from project root
npm run dev
# → http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🌐 Camera Access

The browser camera requires either:
- `localhost` (works by default during development), or
- HTTPS (required in production)

To test on a mobile device on your local network:
```bash
npm run dev -- --host
# Then open https://<your-ip>:5173 on the phone
```
> Accept the self-signed certificate warning — camera will work on `localhost` equivalent.

---

## 🔌 API Endpoints

The backend runs on `http://localhost:3001`.

| Method | Endpoint | Description |
|---|---|---|
| `GET`  | `/api/health` | Liveness check — returns AI provider in use |
| `POST` | `/api/recognize` | Monument identification from image |
| `POST` | `/api/guide` | Heritage chatbot |

### POST /api/recognize

Send as `multipart/form-data`:
```
image   (File)   — captured/uploaded image
```
OR as JSON:
```json
{ "image_base64": "data:image/jpeg;base64,..." }
```

Response:
```json
{
  "siteName": "Brihadeeswarar Temple",
  "location": "Thanjavur, Tamil Nadu",
  "confidence": 0.94,
  "historical_period": "Chola Period (1010 CE)",
  "architectural_style": "Dravidian",
  "overview": "...",
  "notable_facts": ["...", "..."],
  "is_heritage_site": true,
  "provider": "gemini"
}
```

### POST /api/guide

```json
{
  "question": "Who built the Brihadeeswarar Temple?",
  "siteId": "site-001",
  "language": "en",
  "conversationHistory": []
}
```

---

## 🏛️ Adding Real 3D Models

1. Find a CC0-licensed GLB/GLTF on [Sketchfab](https://sketchfab.com/search?q=heritage&features=downloadable) or [Smithsonian 3D](https://3d.si.edu/)
2. Download the `.glb` file
3. Place it in `public/models/yourmodel.glb`
4. Open `src/data/modelRegistry.ts` and set `modelUrl: '/models/yourmodel.glb'`

---

## 📁 Project Structure

```
HeritageLens/
├── src/
│   ├── components/
│   │   ├── heritage/
│   │   │   ├── CameraCapture.tsx      ← Feature A: live camera
│   │   │   ├── Heritage3DViewer.tsx   ← Feature D: 3D viewer
│   │   │   └── AIHeritageGuide.tsx    ← Chatbot widget (embedded)
│   │   └── ui/                        ← Navbar, Button, Badge, etc.
│   ├── pages/
│   │   ├── Scan.tsx                   ← Feature A+B: scan & identify
│   │   ├── Chat.tsx                   ← Feature C: standalone chatbot
│   │   ├── ARExperience.tsx           ← Feature D: 3D explorer
│   │   ├── SeeThePast.tsx             ← Feature E: historical view
│   │   └── ...
│   ├── services/ai/
│   │   ├── heritageRecognition.ts     ← calls /api/recognize
│   │   └── heritageGuide.ts           ← calls /api/guide
│   └── data/
│       ├── modelRegistry.ts           ← 3D model catalogue
│       └── demo/heritage-sites.ts     ← curated site data
│
└── backend/
    ├── server.js                      ← Express entry point
    ├── services/
    │   ├── recognition.js             ← Gemini / OpenAI / demo
    │   └── chatbot.js                 ← Gemini / OpenAI / KB
    └── data/heritageDb.js             ← bilingual knowledge base
```

---

## 🛡️ Environment Variables Reference

### Frontend (`/.env`)
| Variable | Default | Description |
|---|---|---|
| `VITE_AI_API_URL` | `http://localhost:3001` | Backend URL |
| `VITE_SUPABASE_URL` | — | Optional auth |
| `VITE_SUPABASE_ANON_KEY` | — | Optional auth |

### Backend (`/backend/.env`)
| Variable | Default | Description |
|---|---|---|
| `PORT` | `3001` | Server port |
| `GEMINI_API_KEY` | — | Google Gemini key (recommended) |
| `OPENAI_API_KEY` | — | OpenAI key (fallback) |
| `FRONTEND_ORIGIN` | `http://localhost:5173` | CORS origin |

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite 8 |
| Styling | Tailwind CSS v4, Framer Motion |
| 3D | Three.js, React Three Fiber, @react-three/drei |
| Routing | React Router v7 |
| State | Zustand |
| Backend | Node.js 18+, Express 4 |
| AI | Google Gemini 1.5 Flash / OpenAI GPT-4o |
| Maps | Leaflet + React-Leaflet |

---

## ⚠️ Heritage Content Notice

Digital reconstructions are labeled with confidence levels and should not be treated as confirmed historical records unless explicitly verified by heritage experts.  
All historical information is based on publicly available ASI documentation and UNESCO World Heritage records.

---

*Built with ❤️ for Tamil Nadu cultural heritage preservation*
