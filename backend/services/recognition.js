/**
 * Monument recognition service.
 *
 * Priority chain:
 *   1. Google Gemini 1.5 Flash (vision-capable, free tier)
 *   2. OpenAI GPT-4o (vision)
 *   3. Demo fallback (curated heritage DB — no API key needed)
 */

import { HERITAGE_DB } from '../data/heritageDb.js';

// ── Gemini recognition ────────────────────────────────────────────────────────
async function recognizeWithGemini(imageBuffer, mimeType) {
  const apiKey = process.env.GEMINI_API_KEY;
  const b64 = imageBuffer.toString('base64');

  const body = {
    contents: [{
      parts: [
        {
          inlineData: { mimeType, data: b64 },
        },
        {
          text: `You are an expert heritage monument identification system specializing in Indian heritage sites.

Analyze this image and identify the monument or heritage site shown.

Return a JSON object with EXACTLY these fields:
{
  "name": "Full official name of the monument",
  "location": "City, State, Country",
  "historical_period": "e.g. Chola Period (985–1014 CE)",
  "architectural_style": "e.g. Dravidian, Mughal, etc.",
  "builder": "Name of builder/dynasty or null",
  "construction_date": "Year or period or null",
  "overview": "2-3 sentence historical overview",
  "notable_facts": ["fact 1", "fact 2", "fact 3"],
  "cultural_significance": "1-2 sentences",
  "visitor_info": "Opening hours, entry fee, tips (or null if unknown)",
  "confidence": 0.0,
  "confidence_reason": "Why you are or aren't confident",
  "is_heritage_site": true,
  "alternative_matches": []
}

Rules:
- confidence must be a number from 0.0 to 1.0
- If you cannot identify the monument with reasonable confidence (< 0.4), set is_heritage_site to false and leave name as "Unknown structure"
- Do NOT invent facts. Only include information you are reasonably sure of.
- If the image does not show a monument or heritage site, set is_heritage_site to false.
- Return ONLY the JSON object, no markdown, no explanation.`,
        },
      ],
    }],
    generationConfig: { responseMimeType: 'application/json', temperature: 0.1 },
  };

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!raw) throw new Error('Empty Gemini response');

  const parsed = JSON.parse(raw.trim());
  return formatResult(parsed, 'gemini');
}

// ── OpenAI GPT-4o Vision recognition ─────────────────────────────────────────
async function recognizeWithOpenAI(imageBuffer, mimeType) {
  const apiKey = process.env.OPENAI_API_KEY;
  const b64 = imageBuffer.toString('base64');
  const dataUrl = `data:${mimeType};base64,${b64}`;

  const body = {
    model: 'gpt-4o',
    max_tokens: 1000,
    response_format: { type: 'json_object' },
    messages: [{
      role: 'user',
      content: [
        { type: 'image_url', image_url: { url: dataUrl, detail: 'high' } },
        {
          type: 'text',
          text: `You are an expert heritage monument identification system specializing in Indian heritage sites.
Analyze this image and identify the monument. Return a JSON object with fields:
name, location, historical_period, architectural_style, builder, construction_date,
overview (2-3 sentences), notable_facts (array of 3), cultural_significance,
visitor_info, confidence (0.0-1.0), confidence_reason, is_heritage_site (boolean), alternative_matches (array).
Do not invent facts. If not identifiable set is_heritage_site:false, confidence<0.4.`,
        },
      ],
    }],
  };

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content;
  if (!raw) throw new Error('Empty OpenAI response');

  const parsed = JSON.parse(raw);
  return formatResult(parsed, 'openai');
}

// ── Demo fallback ─────────────────────────────────────────────────────────────
function recognizeDemo(imageBuffer) {
  // Cycle through demo sites deterministically based on image content hash
  const sum = imageBuffer.slice(0, 64).reduce((acc, b) => acc + b, 0);
  const site = HERITAGE_DB[sum % HERITAGE_DB.length];

  return {
    siteId: site.id,
    siteName: site.name,
    location: site.location,
    historical_period: site.period,
    architectural_style: site.style,
    builder: site.builder,
    construction_date: site.date,
    overview: site.overview,
    notable_facts: site.facts,
    cultural_significance: site.significance,
    visitor_info: site.visitor_info,
    confidence: 0.88 + (sum % 10) * 0.008,
    confidence_reason: 'Demo mode — matched from curated heritage database',
    is_heritage_site: true,
    alternative_matches: [],
    isDemo: true,
    provider: 'demo',
    matchMethod: 'demo',
  };
}

// ── Shared formatter ──────────────────────────────────────────────────────────
function formatResult(parsed, provider) {
  // Try to match against our database for siteId
  const nameLower = (parsed.name || '').toLowerCase();
  const match = HERITAGE_DB.find(
    (s) =>
      nameLower.includes(s.name.toLowerCase().split(' ')[0]) ||
      s.name.toLowerCase().includes(nameLower.split(' ')[0])
  );

  return {
    siteId: match?.id || null,
    siteName: parsed.name || 'Unknown structure',
    location: parsed.location || 'Unknown location',
    historical_period: parsed.historical_period || null,
    architectural_style: parsed.architectural_style || null,
    builder: parsed.builder || null,
    construction_date: parsed.construction_date || null,
    overview: parsed.overview || null,
    notable_facts: Array.isArray(parsed.notable_facts) ? parsed.notable_facts : [],
    cultural_significance: parsed.cultural_significance || null,
    visitor_info: parsed.visitor_info || null,
    confidence: Math.min(1, Math.max(0, Number(parsed.confidence) || 0)),
    confidence_reason: parsed.confidence_reason || null,
    is_heritage_site: parsed.is_heritage_site !== false,
    alternative_matches: Array.isArray(parsed.alternative_matches) ? parsed.alternative_matches : [],
    isDemo: false,
    provider,
    matchMethod: 'vision-ai',
  };
}

// ── Public entrypoint ─────────────────────────────────────────────────────────
export async function identifyMonument(imageBuffer, mimeType = 'image/jpeg') {
  // 1. Try Gemini
  if (process.env.GEMINI_API_KEY) {
    try {
      return await recognizeWithGemini(imageBuffer, mimeType);
    } catch (err) {
      console.warn('[recognition] Gemini failed, trying next:', err.message);
    }
  }

  // 2. Try OpenAI
  if (process.env.OPENAI_API_KEY) {
    try {
      return await recognizeWithOpenAI(imageBuffer, mimeType);
    } catch (err) {
      console.warn('[recognition] OpenAI failed, using demo:', err.message);
    }
  }

  // 3. Demo fallback
  console.info('[recognition] No AI key configured — using demo fallback');
  return recognizeDemo(imageBuffer);
}
