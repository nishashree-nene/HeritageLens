import type { AIGuideRequest, AIGuideResponse, Language } from '../../types';
import { DEMO_SITES } from '../../data/demo/heritage-sites';

const KB: Record<string, Record<string, { en: string; ta: string }>> = {
  'site-001': {
    'who built': { en: 'Brihadeeswarar Temple was built by Raja Raja Chola I, completed in 1010 CE. He was the greatest king of the Chola dynasty and dedicated this temple to Lord Shiva.', ta: 'பிரகதீஸ்வரர் கோயில் ராஜராஜ சோழன் I ஆல் 1010 CE இல் நிறைவடைந்தது. சோழ வம்சத்தின் மிகப்பெரிய அரசன் இந்த கோயிலை சிவபெருமானுக்கு அர்ப்பணித்தார்.' },
    'when': { en: 'The temple was constructed between approximately 1003 CE and 1010 CE during the reign of Raja Raja Chola I. It has stood for over 1,000 years.', ta: 'கோயில் 1003 CE மற்றும் 1010 CE இடையில் ராஜராஜ சோழன் I ஆட்சியில் கட்டப்பட்டது.' },
    'architecture': { en: 'The temple is a masterpiece of Dravidian architecture. Its vimana rises 66 meters — built from interlocking granite without mortar. 13 progressively receding stories and an 80-tonne capstone make it extraordinary.', ta: 'திராவிட கட்டிடக்கலையின் மேதைத்துவமான படைப்பு. 66 மீட்டர் உயர விமானம் சாந்து இல்லாமல் கட்டப்பட்டது.' },
    'why important': { en: 'The Brihadeeswarar Temple is the spiritual, political and cultural center of the Chola Empire. Its inscriptions provide invaluable records. It was the first South Indian temple designated a UNESCO World Heritage Site in 1987.', ta: 'சோழ சாம்ராஜ்யத்தின் ஆன்மீக, அரசியல் மற்றும் கலாச்சார மையம். 1987 இல் யுனெஸ்கோ தளமாக நியமிக்கப்பட்டது.' },
    'nearby': { en: 'Nearby you can find: Thanjavur Royal Palace Museum (Chola bronzes), Saraswati Mahal Library (50,000+ manuscripts), Thanjavur painting workshops, and veena craftsmen workshops.', ta: 'அருகில்: தஞ்சாவூர் அரண்மனை அருங்காட்சியகம், சரஸ்வதி மகால் நூலகம், தஞ்சாவூர் ஓவியர்கள் மற்றும் வீணை கைவினைஞர்கள்.' },
    'first': { en: 'Start at the main vimana — the 66-meter granite tower. Then visit the Nandi mandapam with its massive monolithic Nandi. Walk the inner corridors to see original Chola murals hidden beneath Nayak additions.', ta: 'முதலில் பிரதான விமானத்தில் தொடங்குங்கள். பின்னர் நந்தி மண்டபத்தை பாருங்கள்.' },
  },
  'site-002': {
    'who built': { en: 'The Shore Temple was built by Narasimhavarman II (also called Rajasimha) of the Pallava dynasty around 700–728 CE.', ta: 'கடற்கரை கோயில் பல்லவ வம்சத்தின் நரசிம்மவர்மன் II ஆல் 700-728 CE இல் கட்டப்பட்டது.' },
    'seven pagodas': { en: 'Ancient texts and 17th-century European sailors mention "Seven Pagodas" at Mahabalipuram. The 2004 tsunami temporarily exposed underwater ruins, supporting this legend.', ta: '2004 சுனாமி கடலடியில் பழங்கால கட்டமைப்புகளை வெளிப்படுத்தியது, ஏழு தேவாலயங்களின் புராணக்கதையை உறுதிப்படுத்துகிறது.' },
    'when': { en: 'The Shore Temple was constructed around 700–728 CE during the late Pallava period. It is one of the oldest structural stone temples in South India.', ta: 'கடற்கரை கோயில் 700-728 CE இல் கட்டப்பட்டது. தென்னிந்தியாவின் பழமையான கல் கோயில்களில் ஒன்று.' },
  },
  'site-003': {
    'who built': { en: 'Gingee Fort was originally built by the Chola dynasty in the 9th century, expanded by Vijayanagara Empire in the 15th century, and fortified by Marathas, Mughals, and French over subsequent centuries.', ta: 'செஞ்சி கோட்டை 9ஆம் நூற்றாண்டில் சோழர்களால் கட்டப்பட்டது, பின்னர் விஜயநகர சாம்ராஜ்யம், மராட்டியர்கள் மற்றும் பிரெஞ்சு ஆட்சியாளர்களால் விரிவுபடுத்தப்பட்டது.' },
    'troy': { en: 'Gingee earned "Troy of the East" due to its near-impregnability. Three citadels on steep rocky hills, triple defensive walls, and Rajagiri with sheer 150-foot cliffs made it extremely difficult to capture.', ta: 'மூன்று மலைகளில் கட்டப்பட்ட இந்த கோட்டை அதன் கட்டுக்கோப்பான தன்மையால் "கிழக்கின் ட்ராய்" என்று அழைக்கப்படுகிறது.' },
  },
  'site-004': {
    'who built': { en: 'The original Meenakshi Temple was built by Kulashekhara Pandya around the 6th century BCE. The current structure was mainly built by Vishwanatha Nayak and Tirumalai Nayak in the 16th–17th centuries CE.', ta: 'அசல் கோயில் கி.மு. 6ஆம் நூற்றாண்டில் குலசேகர பாண்டியனால் கட்டப்பட்டது. நவீன கட்டமைப்பு 16-17ஆம் நூற்றாண்டில் நாயக்க ஆட்சியாளர்களால் கட்டப்பட்டது.' },
    'gopuram': { en: 'The Meenakshi Temple has 14 gopurams (gateway towers). The tallest rises 52 meters. They are covered with thousands of colorful stucco sculptures of deities and celestial beings.', ta: 'மீனாட்சி கோயிலில் 14 கோபுரங்கள் உள்ளன. மிக உயரமானது 52 மீட்டர். ஆயிரக்கணக்கான வண்ணமயமான சிற்பங்கள் மூடியுள்ளன.' },
  },
};

function knowledgeBaseResponse(question: string, siteId: string, lang: Language): AIGuideResponse {
  const siteKB = KB[siteId];
  const site = DEMO_SITES.find((s) => s.id === siteId);
  const q = question.toLowerCase();

  if (siteKB) {
    for (const key of Object.keys(siteKB)) {
      if (q.includes(key)) {
        return { answer: siteKB[key][lang] || siteKB[key].en, confidence: 'high', sources: ['ASI Documentation', 'UNESCO World Heritage Records'], suggestions: getSuggestions(siteId, lang), isDemo: true };
      }
    }
  }

  if (site) {
    const name = lang === 'ta' ? site.name_ta : site.name_en;
    return {
      answer: lang === 'ta'
        ? `${name} பற்றி கேட்பதற்கு நன்றி. இது ${site.historical_period} காலத்தில் ${site.dynasty || site.builder || 'பண்டைய கட்டிடக்கலைஞர்கள்'} ஆல் ${site.location_name} இல் கட்டப்பட்டது. கட்டிடக்கலை, வரலாற்று நிகழ்வுகள் அல்லது அருகிலுள்ள தளங்கள் பற்றி கேட்கலாம்.`
        : `Thank you for asking about ${name}. This site dates to the ${site.historical_period} and was built by ${site.dynasty || site.builder || 'ancient craftsmen'} in ${site.location_name}. Ask me about its architecture, historical events, or nearby places.`,
      confidence: 'medium', suggestions: getSuggestions(siteId, lang), isDemo: true,
    };
  }
  return { answer: 'I don\'t have information about this site in my knowledge base. Please refer to ASI documentation or heritage boards at the site.', confidence: 'low', isDemo: true };
}

function getSuggestions(siteId: string, lang: Language): string[] {
  const map: Record<string, { en: string[]; ta: string[] }> = {
    'site-001': { en: ['Who built this temple?', 'How tall is the vimana?', 'What can I see nearby?', 'Tell me about Chola history', 'Explain the architecture'], ta: ['இந்த கோயிலை யார் கட்டினார்கள்?', 'விமானம் எவ்வளவு உயரம்?', 'அருகில் என்ன காணலாம்?'] },
    'site-002': { en: ['Who built the Shore Temple?', 'What are the Seven Pagodas?', 'Tell me about Pallava dynasty'], ta: ['கடற்கரை கோயிலை யார் கட்டினார்கள்?', 'ஏழு தேவாலயங்கள் என்றால் என்ன?'] },
    'site-003': { en: ['Why is it called Troy of the East?', 'Who built Gingee Fort?', 'Tell me about the Maratha siege'], ta: ['இது ஏன் கிழக்கின் ட்ராய் என்று அழைக்கப்படுகிறது?'] },
    'site-004': { en: ['How many gopurams does Meenakshi Temple have?', 'Who built this temple?', 'Tell me about the musical pillars'], ta: ['மீனாட்சி கோயிலில் எத்தனை கோபுரங்கள் உள்ளன?'] },
  };
  return map[siteId]?.[lang] ?? (lang === 'ta' ? ['யார் இதை கட்டினார்கள்?', 'இது எப்போது கட்டப்பட்டது?'] : ['Who built this?', 'When was this built?', 'What can I see nearby?']);
}

export async function askHeritageGuide(req: AIGuideRequest): Promise<AIGuideResponse> {
  const aiApiUrl = import.meta.env.VITE_AI_API_URL;
  if (aiApiUrl) {
    try {
      const res = await fetch(`${aiApiUrl}/guide`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(req) });
      if (res.ok) return { ...(await res.json()), isDemo: false };
    } catch { /* fall through */ }
  }
  await new Promise((r) => setTimeout(r, 800 + Math.random() * 400));
  return knowledgeBaseResponse(req.question, req.siteId, req.language);
}

export function getDefaultSuggestions(siteId: string, lang: Language): string[] {
  return getSuggestions(siteId, lang);
}
