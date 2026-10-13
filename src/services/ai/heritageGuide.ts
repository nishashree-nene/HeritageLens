/**
 * Heritage Guide Service — connects to the Express backend /api/guide endpoint.
 * Falls back to the curated knowledge-base when the backend is unreachable.
 */

import type { AIGuideRequest, AIGuideResponse, Language } from '../../types';
import { DEMO_SITES } from '../../data/demo/heritage-sites';

const API_BASE = import.meta.env.VITE_AI_API_URL || 'http://localhost:3001';

// ── Knowledge-base fallback (bilingual) ───────────────────────────────────────
const KB: Record<string, Record<string, { en: string; ta: string }>> = {
  'site-001': {
    'who built': {
      en: 'Brihadeeswarar Temple was built by Raja Raja Chola I, completed in 1010 CE. The greatest king of the Chola dynasty, he dedicated this temple to Lord Shiva. It is also called Peruvudaiyar Kovil ("Big Temple").',
      ta: 'பிரகதீஸ்வரர் கோயில் ராஜராஜ சோழன் I ஆல் 1010 CE இல் கட்டப்பட்டது. சோழ வம்சத்தின் மிகப்பெரிய அரசன் இந்த கோயிலை சிவபெருமானுக்கு அர்ப்பணித்தார்.',
    },
    'how tall': {
      en: 'The vimana (main tower) rises 66 metres — built using interlocking granite blocks without mortar. The 80-tonne capstone was placed via a 6 km ramp.',
      ta: 'விமானம் 66 மீட்டர் உயரமுள்ளது — சாந்து இல்லாமல் ஒன்றினொன்று பிணைந்த கிரானைட் கற்களால் கட்டப்பட்டது.',
    },
    'architect': {
      en: 'A masterpiece of Dravidian architecture with 13 receding stories, an 80-tonne capstone, and interlocking granite stones — no mortar used. The temple has stood 1,000+ years.',
      ta: 'சாந்து இல்லாமல் கட்டப்பட்ட திராவிட கட்டிடக்கலையின் மேதைத்துவமான படைப்பு. 1000 ஆண்டுகளுக்கும் மேலாக நிலைத்திருக்கிறது.',
    },
    'when': {
      en: 'Constructed between ~1003 CE and 1010 CE during Raja Raja Chola I\'s reign. UNESCO World Heritage Site since 1987.',
      ta: '1003–1010 CE இல் கட்டப்பட்டது. 1987 முதல் யுனெஸ்கோ உலக பாரம்பரிய தளம்.',
    },
    'nearby': {
      en: 'Nearby: Thanjavur Palace & Royal Museum (10 min walk), Saraswati Mahal Library (50,000+ manuscripts), Sangeetha Mahal. Thanjavur has veena craftsmen and Tanjore painting workshops.',
      ta: 'அருகில்: தஞ்சாவூர் அரண்மனை அருங்காட்சியகம் (10 நிமிட நடை), சரஸ்வதி மகால் நூலகம், வீணை கைவினைஞர்கள்.',
    },
    'visit': {
      en: 'Open daily 6 AM–12:30 PM and 4 PM–8:30 PM. Entry free. Camera fee ₹50 for foreign visitors. Modest clothing required.',
      ta: 'திறந்திருக்கும் நேரம்: காலை 6–12:30, மாலை 4–8:30. நுழைவு இலவசம்.',
    },
  },
  'site-002': {
    'who built': {
      en: 'Built by Narasimhavarman II (Rajasimha) of the Pallava dynasty around 700–728 CE. He was a great patron of arts who made the historic shift from rock-cut to free-standing stone temples.',
      ta: 'பல்லவ வம்சத்தின் நரசிம்மவர்மன் II (ராஜசிம்மன்) ஆல் 700-728 CE இல் கட்டப்பட்டது.',
    },
    'seven pagodas': {
      en: 'Ancient texts and 17th-century European sailors mention "Seven Pagodas" at Mahabalipuram. The 2004 tsunami briefly exposed stone ruins on the seabed, supporting this legend.',
      ta: '2004 சுனாமி கடலடியில் பழங்கால கட்டமைப்புகளை வெளிப்படுத்தியது, ஏழு தேவாலயங்களின் புராணக்கதையை உறுதிப்படுத்துகிறது.',
    },
    'when': {
      en: 'Built around 700–728 CE. UNESCO World Heritage Site (1984) as part of "Group of Monuments at Mahabalipuram."',
      ta: '700-728 CE இல் கட்டப்பட்டது. 1984 முதல் யுனெஸ்கோ உலக பாரம்பரிய தளம்.',
    },
  },
  'site-003': {
    'troy': {
      en: 'Gingee earned "Troy of the East" due to near-impregnability: three hills with 150-ft sheer cliffs, triple walls, and a 7-year food supply. Aurangzeb\'s full army besieged it 8 years without success.',
      ta: 'ஔரங்கசீப்பின் முழு படையும் 8 ஆண்டுகள் முற்றுகையிட்டும் கைப்பற்ற முடியவில்லை. அதனால் "கிழக்கின் ட்ராய்" என்று அழைக்கப்படுகிறது.',
    },
    'who built': {
      en: 'Originally built by the Chola dynasty in the 9th century, later expanded by Vijayanagara Empire (15th cent.), captured by Shivaji (1677), used by Mughals, French, and finally British (1761).',
      ta: '9ஆம் நூற்றாண்டில் சோழர்கள் கட்டினார்கள். பிறகு விஜயநகரம், மராட்டியர்கள், முகலாயர்கள், பிரெஞ்சு மற்றும் ஆங்கிலேயர்கள் ஆட்சி செய்தனர்.',
    },
  },
  'site-004': {
    'gopuram': {
      en: 'The Meenakshi Temple has 14 gopurams. The tallest (south) reaches 52 m and is covered with ~33,000 coloured stucco sculptures of deities.',
      ta: 'மீனாட்சி கோவிலில் 14 கோபுரங்கள். மிக உயரமானது 52 மீட்டர் — ஆயிரக்கணக்கான வண்ணமயமான சிற்பங்கள் மூடியுள்ளன.',
    },
    'musical pillars': {
      en: 'The "1000-Pillar Hall" (985 pillars, built ~1569 CE) contains musical pillars — each carved from a single granite block that produces a distinct musical note when struck.',
      ta: 'ஆயிரம் தூண்கள் மண்டபம் (985 தூண்கள், 1569 CE) — ஒவ்வொரு தூணும் தட்டப்படும்போது தனித்துவமான இசை ஒலியை தருகிறது.',
    },
    'who built': {
      en: 'Original temple: Kulashekhara Pandya (~6th cent BCE). Current structure: mainly built by Vishwanatha Nayak and Tirumalai Nayak in the 16th–17th centuries CE.',
      ta: 'அசல் கோயில் கி.மு. 6ஆம் நூற்றாண்டில் குலசேகர பாண்டியனால் கட்டப்பட்டது. நவீன கட்டமைப்பு 16-17ஆம் நூற்றாண்டில் நாயக்க ஆட்சியாளர்களால்.',
    },
  },
};

function knowledgeBaseResponse(question: string, siteId: string, lang: Language): AIGuideResponse {
  const siteKB = KB[siteId];
  const site   = DEMO_SITES.find((s) => s.id === siteId);
  const q      = question.toLowerCase();

  if (siteKB) {
    for (const key of Object.keys(siteKB)) {
      if (q.includes(key)) {
        return {
          answer:      siteKB[key][lang] ?? siteKB[key].en,
          confidence:  'high',
          sources:     ['ASI Documentation', 'UNESCO World Heritage Records'],
          suggestions: getSuggestions(siteId, lang),
          isDemo:      true,
        };
      }
    }
  }

  const name = site ? (lang === 'ta' ? site.name_ta : site.name_en) : 'this monument';
  return {
    answer: lang === 'ta'
      ? `${name} பற்றி கேட்பதற்கு நன்றி. இது ${site?.historical_period ?? 'பண்டைய காலத்தில்'} ${site?.dynasty ?? site?.builder ?? 'பண்டைய கட்டிடக்கலைஞர்களால்'} ${site?.location_name ?? 'இந்தியாவில்'} கட்டப்பட்டது. கட்டிடக்கலை, வரலாற்று நிகழ்வுகள் அல்லது சுற்றுலா தகவல்கள் பற்றி மேலும் கேளுங்கள்.`
      : `Thank you for asking about ${name}. This site dates to the ${site?.historical_period ?? 'ancient period'} and was built by ${site?.dynasty ?? site?.builder ?? 'ancient craftsmen'} in ${site?.location_name ?? 'India'}. Ask me about its architecture, history, or visitor information.`,
    confidence:  'medium',
    sources:     ['Curated heritage knowledge base'],
    suggestions: getSuggestions(siteId, lang),
    isDemo:      true,
  };
}

function getSuggestions(siteId: string, lang: Language): string[] {
  const map: Record<string, { en: string[]; ta: string[] }> = {
    'site-001': {
      en: ['Who built this temple?', 'How tall is the vimana?', 'Explain the architecture', 'Tell me about Raja Raja Chola I', 'What can I see nearby?', 'When is it open to visitors?'],
      ta: ['இந்த கோயிலை யார் கட்டினார்கள்?', 'விமானம் எவ்வளவு உயரம்?', 'கட்டிடக்கலை சிறப்பு என்ன?', 'அருகில் என்ன காணலாம்?'],
    },
    'site-002': {
      en: ['Who built the Shore Temple?', 'What are the Seven Pagodas?', 'How did the 2004 tsunami affect it?', 'What is Mahabalipuram known for?'],
      ta: ['கடற்கரை கோயிலை யார் கட்டினார்கள்?', 'ஏழு தேவாலயங்கள் என்ன?', '2004 சுனாமியும் கோயிலும்'],
    },
    'site-003': {
      en: ['Why is it called Troy of the East?', 'Who controlled Gingee Fort over history?', 'Tell me about the Maratha siege', 'How do I reach Gingee Fort?'],
      ta: ['செஞ்சி கோட்டை கிழக்கின் ட்ராய் ஏன்?', 'யார் யார் இந்த கோட்டையை ஆண்டனர்?'],
    },
    'site-004': {
      en: ['How many gopurams does Meenakshi Temple have?', 'Tell me about the musical pillars', 'Who is Meenakshi?', 'Best time to visit Madurai'],
      ta: ['மீனாட்சி கோவிலில் எத்தனை கோபுரங்கள்?', 'இசை தூண்கள் பற்றி சொல்லுங்கள்', 'மீனாட்சி யார்?'],
    },
    'site-005': {
      en: ['What is inside Thanjavur Palace?', 'Tell me about the Chola bronzes', 'What is Saraswati Mahal Library?'],
      ta: ['தஞ்சாவூர் அரண்மனையில் என்ன உள்ளது?', 'சோழ வெண்கல சிலைகள் பற்றி சொல்லுங்கள்'],
    },
  };
  const entry = map[siteId];
  if (entry) return entry[lang] ?? entry.en;
  return lang === 'ta'
    ? ['யார் இதை கட்டினார்கள்?', 'இது எப்போது கட்டப்பட்டது?', 'கட்டிடக்கலை சிறப்பு என்ன?']
    : ['Who built this?', 'When was this built?', 'What is the architectural significance?', 'What should I know before visiting?'];
}

// ── Backend call ──────────────────────────────────────────────────────────────
async function callBackend(req: AIGuideRequest): Promise<AIGuideResponse> {
  const res = await fetch(`${API_BASE}/api/guide`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
    signal: AbortSignal.timeout(20_000),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error ?? `HTTP ${res.status}`);
  }

  const data = await res.json();
  return {
    answer:      data.answer,
    confidence:  data.confidence ?? 'high',
    sources:     data.sources,
    suggestions: data.suggestions ?? getSuggestions(req.siteId, req.language),
    isDemo:      data.isDemo ?? false,
  };
}

// ── Public API ────────────────────────────────────────────────────────────────
export async function askHeritageGuide(req: AIGuideRequest): Promise<AIGuideResponse> {
  try {
    return await callBackend(req);
  } catch (err) {
    console.warn('[heritageGuide] Backend unavailable, using knowledge-base:', err);
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 300));
    return knowledgeBaseResponse(req.question, req.siteId, req.language);
  }
}

export function getDefaultSuggestions(siteId: string, lang: Language): string[] {
  return getSuggestions(siteId, lang);
}
