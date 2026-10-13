/**
 * HeritageLens Backend Server
 * Express API for AI monument identification and heritage chatbot.
 *
 * Endpoints:
 *   POST /api/recognize  — identify a monument from an image
 *   POST /api/guide      — heritage chatbot (context-aware)
 *   GET  /api/health     — liveness probe
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { identifyMonument } from './services/recognition.js';
import { askGuide } from './services/chatbot.js';

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json({ limit: '10mb' }));

// multer stores uploaded images in memory (max 10 MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are accepted'));
  },
});

// ── Health ────────────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    aiProvider: process.env.GEMINI_API_KEY
      ? 'gemini'
      : process.env.OPENAI_API_KEY
      ? 'openai'
      : 'demo',
  });
});

// ── Monument Recognition ──────────────────────────────────────────────────────
app.post('/api/recognize', upload.single('image'), async (req, res) => {
  try {
    // Accept either a multipart file upload or a base64 string in JSON body
    let imageBuffer = null;
    let mimeType = 'image/jpeg';

    if (req.file) {
      imageBuffer = req.file.buffer;
      mimeType = req.file.mimetype;
    } else if (req.body?.image_base64) {
      const b64 = req.body.image_base64.replace(/^data:image\/\w+;base64,/, '');
      imageBuffer = Buffer.from(b64, 'base64');
    }

    if (!imageBuffer) {
      return res.status(400).json({ error: 'No image provided. Send as multipart "image" or JSON "image_base64".' });
    }

    const result = await identifyMonument(imageBuffer, mimeType);
    return res.json(result);
  } catch (err) {
    console.error('[recognize]', err);
    return res.status(500).json({ error: 'Recognition failed', detail: err.message });
  }
});

// ── Heritage Chatbot ──────────────────────────────────────────────────────────
app.post('/api/guide', async (req, res) => {
  try {
    const { question, siteId, language, conversationHistory } = req.body;
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'question is required' });
    }
    const answer = await askGuide({ question, siteId, language: language || 'en', conversationHistory: conversationHistory || [] });
    return res.json(answer);
  } catch (err) {
    console.error('[guide]', err);
    return res.status(500).json({ error: 'Chatbot failed', detail: err.message });
  }
});

// ── Error handler ─────────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[unhandled]', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\n🏛️  HeritageLens Backend running on http://localhost:${PORT}`);
  console.log(`   AI provider: ${process.env.GEMINI_API_KEY ? 'Gemini' : process.env.OPENAI_API_KEY ? 'OpenAI' : 'Demo (no API key)'}`);
  console.log(`   Health:      http://localhost:${PORT}/api/health\n`);
});
