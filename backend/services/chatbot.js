/**
 * Heritage chatbot service.
 *
 * Priority chain:
 *   1. Google Gemini 1.5 Flash (recommended)
 *   2. OpenAI GPT-4o
 *   3. Curated knowledge-base fallback (no API key)
 */

import { HERITAGE_DB, KNOWLEDGE_BASE } from '../data/heritageDb.js';

const SYSTEM_PROMPT = `You are HeritageLens AI — a knowledgeable, friendly guide specializing in Indian heritage monuments and UNESCO World Heritage Sites.

Your expertise covers:
- Architecture (Dravidian, Mughal, Pallava, Chola, Vijayanagara, Maratha styles)
- Historical periods and dynasties
- Archaeological significance and conservation
- Visitor information and cultural etiquette
- Tamil heritage sites: Brihadeeswarar Temple, Shore Temple, Meenakshi Amman Temple, Gingee Fort, Thanjavur Palace
- Pan-India sites: Taj Mahal, Red Fort, Qutb Minar, Hampi, Ajanta & Ellora, Khajuraho

Guidelines:
1. Be accurate — only state what you know. Clearly acknowledge uncertainty with phrases like "I'm not certain, but..." or "Sources suggest..."
2. Be concise but informative. Aim for 2-4 paragraphs.
3. Support English and Tamil. If the question is in Tamil, respond in Tamil.
4. Do not fabricate dates, names, or measurements.
5. If asked about visiting: mention actual ASI/tourism board info if you know it.
6. Cite uncertainty rather than inventing answers.`;

// ── Gemini chatbot ────────────────────────────────────────────────────────────
async function chatWithGemini({ question, siteId, language, conversationHistory }) {
  const site = HERITAGE_DB.find((s) => s.id === siteId);
  const siteContext = site
    ? `\n\nCurrent monument context: ${site.name} — ${site.location} (${site.period}). Builder: ${site.builder}. Style: ${site.style}.`
    : '';

  // Build conversation turns
  const turns = [];
  for (const msg of (conversationHistory || []).slice(-8)) {
    if (msg.role === 'user') {
      turns.push({ role: 'user', parts: [{ text: msg.content }] });
    } else if (msg.role === 'assistant') {
      turns.push({ role: 'model', parts: [{ text: msg.content }] });
    }
  }
  // Add current question
  turns.push({ role: 'user', parts: [{ text: question }] });

  const body = {
    system_instruction: { parts: [{ text: SYSTEM_PROMPT + siteContext }] },
    contents: turns,
    generationConfig: { temperature: 0.4, maxOutputTokens: 800 },
  };

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty Gemini response');

  return {
    answer: text.trim(),
    confidence: 'high',
    sources: ['Google Gemini AI', 'Heritage knowledge base'],
    suggestions: getSuggestions(siteId, language),
    isDemo: false,
    provider: 'gemini',
  };
}

// ── OpenAI chatbot ────────────────────────────────────────────────────────────
async function chatWithOpenAI({ question, siteId, language, conversationHistory }) {
  const site = HERITAGE_DB.find((s) => s.id === siteId);
  const siteContext = site
    ? `\n\nCurrent monument context: ${site.name} — ${site.location} (${site.period}).`
    : '';

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT + siteContext },
    ...(conversationHistory || []).slice(-8).map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content,
    })),
    { role: 'user', content: question },
  ];

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({ model: 'gpt-4o', messages, max_tokens: 800, temperature: 0.4 }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('Empty OpenAI response');

  return {
    answer: text.trim(),
    confidence: 'high',
    sources: ['OpenAI GPT-4o', 'Heritage knowledge base'],
    suggestions: getSuggestions(siteId, language),
    isDemo: false,
    provider: 'openai',
  };
}

// ── Curated knowledge-base fallback ──────────────────────────────────────────
function chatWithKnowledgeBase({ question, siteId, language }) {
  const kb = KNOWLEDGE_BASE[siteId] || {};
  const site = HERITAGE_DB.find((s) => s.id === siteId);
  const q = question.toLowerCase();
  const lang = language === 'ta' ? 'ta' : 'en';

  for (const key of Object.keys(kb)) {
    if (q.includes(key)) {
      return {
        answer: kb[key][lang] || kb[key].en,
        confidence: 'high',
        sources: ['ASI Documentation', 'UNESCO World Heritage Records'],
        suggestions: getSuggestions(siteId, language),
        isDemo: true,
        provider: 'knowledge-base',
      };
    }
  }

  // Generic site reply
  const name = site?.name || 'this monument';
  const answer = lang === 'ta'
    ? `${name} பற்றிய உங்கள் கேள்விக்கு நன்றி. இது ${site?.period || 'பண்டைய காலத்தில்'} ${site?.builder || 'பண்டைய கட்டிடக்கலைஞர்களால்'} ${site?.location || 'இந்தியாவில்'} கட்டப்பட்டது. கட்டிடக்கலை, வரலாறு, அல்லது சுற்றுலா தகவல்கள் பற்றி மேலும் கேளுங்கள்.`
    : `Thank you for your question about ${name}. This site dates to the ${site?.period || 'ancient period'} and was built by ${site?.builder || 'ancient craftsmen'} in ${site?.location || 'India'}. Feel free to ask about its architecture, history, or visitor information.`;

  return {
    answer,
    confidence: 'medium',
    sources: ['Curated heritage knowledge base'],
    suggestions: getSuggestions(siteId, language),
    isDemo: true,
    provider: 'knowledge-base',
  };
}

// ── Suggestion sets ───────────────────────────────────────────────────────────
function getSuggestions(siteId, lang) {
  const map = {
    'site-001': {
      en: ['Who built Brihadeeswarar Temple?', 'How tall is the vimana?', 'What is special about the architecture?', 'Tell me about Raja Raja Chola I', 'What can I see nearby?', 'When is it open to visitors?'],
      ta: ['இந்த கோயிலை யார் கட்டினார்கள்?', 'விமானம் எவ்வளவு உயரம்?', 'கட்டிடக்கலை சிறப்பு என்ன?', 'ராஜராஜ சோழன் பற்றி சொல்லுங்கள்'],
    },
    'site-002': {
      en: ['Who built the Shore Temple?', 'What are the Seven Pagodas?', 'Tell me about the 2004 tsunami and the temple', 'What is Mahabalipuram known for?', 'What are Pancha Rathas?'],
      ta: ['கடற்கரை கோயிலை யார் கட்டினார்கள்?', 'ஏழு தேவாலயங்கள் என்ன?', '2004 சுனாமியும் கோயிலும்'],
    },
    'site-003': {
      en: ['Why is Gingee called Troy of the East?', 'Who controlled Gingee Fort over history?', 'Tell me about the Maratha siege', 'How do I reach Gingee Fort?'],
      ta: ['செஞ்சி கோட்டை கிழக்கின் ட்ராய் ஏன்?', 'யார் யார் இந்த கோட்டையை ஆண்டனர்?'],
    },
    'site-004': {
      en: ['How many gopurams does Meenakshi Temple have?', 'Tell me about the musical pillars', 'Who is Meenakshi?', 'What are the best times to visit?'],
      ta: ['மீனாட்சி கோவிலில் எத்தனை கோபுரங்கள்?', 'இசை தூண்கள் பற்றி சொல்லுங்கள்'],
    },
    'site-005': {
      en: ['What is inside Thanjavur Palace?', 'Tell me about the Chola bronzes', 'What is Saraswati Mahal Library?'],
      ta: ['தஞ்சாவூர் அரண்மனையில் என்ன உள்ளது?', 'சோழ வெண்கல சிலைகள் பற்றி சொல்லுங்கள்'],
    },
  };
  const entry = map[siteId];
  if (entry) return entry[lang === 'ta' ? 'ta' : 'en'] || entry.en;
  return lang === 'ta'
    ? ['யார் இதை கட்டினார்கள்?', 'இது எப்போது கட்டப்பட்டது?', 'கட்டிடக்கலை சிறப்பு என்ன?']
    : ['Who built this?', 'When was this built?', 'What is the architectural significance?', 'What should I know before visiting?'];
}

// ── Public entrypoint ─────────────────────────────────────────────────────────
export async function askGuide(req) {
  if (process.env.GEMINI_API_KEY) {
    try {
      return await chatWithGemini(req);
    } catch (err) {
      console.warn('[chatbot] Gemini failed, trying next:', err.message);
    }
  }

  if (process.env.OPENAI_API_KEY) {
    try {
      return await chatWithOpenAI(req);
    } catch (err) {
      console.warn('[chatbot] OpenAI failed, using knowledge-base:', err.message);
    }
  }

  console.info('[chatbot] No AI key — using knowledge-base fallback');
  return chatWithKnowledgeBase(req);
}
