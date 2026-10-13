/**
 * Curated heritage site database used by the backend.
 * IDs match the frontend DEMO_SITES for cross-linking.
 */

export const HERITAGE_DB = [
  {
    id: 'site-001',
    name: 'Brihadeeswarar Temple',
    location: 'Thanjavur, Tamil Nadu, India',
    period: 'Chola Period (985–1014 CE)',
    style: 'Dravidian',
    builder: 'Raja Raja Chola I',
    date: '1010 CE',
    overview: 'The Brihadeeswarar Temple in Thanjavur is a masterpiece of Chola architecture, built by Raja Raja Chola I in 1010 CE. Its vimana rises 66 meters — the tallest in South India at the time — using interlocking granite blocks without mortar. A UNESCO World Heritage Site since 1987.',
    facts: [
      'The 80-tonne capstone was placed using a ramp stretching 6 km',
      'Built without mortar — interlocking granite blocks have stood 1,000+ years',
      'Inscriptions record salaries of 600+ temple staff in the 11th century',
    ],
    significance: 'The spiritual and administrative center of the Chola Empire, representing the peak of Tamil art, architecture, and engineering.',
    visitor_info: 'Open daily 6 AM – 12:30 PM and 4 PM – 8:30 PM. Entry free (foreigners: ₹50 camera fee). Best visited early morning.',
  },
  {
    id: 'site-002',
    name: 'Shore Temple, Mahabalipuram',
    location: 'Mahabalipuram, Tamil Nadu, India',
    period: 'Pallava Period (700–728 CE)',
    style: 'Dravidian (Early Pallava)',
    builder: 'Narasimhavarman II (Rajasimha)',
    date: '700–728 CE',
    overview: 'The Shore Temple is one of the oldest structural stone temples of South India, standing on the Bay of Bengal. Built around 700 CE by the Pallava king Rajasimha, it is part of the UNESCO World Heritage Group of Monuments at Mahabalipuram (1984).',
    facts: [
      'One of the oldest structural (not rock-cut) temples in South India',
      'The 2004 tsunami briefly exposed ancient ruins offshore, supporting the "Seven Pagodas" legend',
      'Contains shrines to both Shiva and Vishnu — unusual for a single complex',
    ],
    significance: 'The Shore Temple marks the transition from rock-cut to free-standing stone temple architecture in South India.',
    visitor_info: 'Open daily 6 AM – 6 PM. Entry ₹40 (Indians), ₹600 (foreigners). 60 km from Chennai.',
  },
  {
    id: 'site-003',
    name: 'Gingee Fort',
    location: 'Gingee, Villupuram District, Tamil Nadu, India',
    period: 'Multi-period: 9th–18th Century CE',
    style: 'Military fortification — Dravidian/Maratha',
    builder: 'Chola dynasty (original); expanded by Vijayanagara, Maratha, Mughal, French',
    date: '9th Century CE onward',
    overview: 'Gingee Fort, spread across three rocky hills and 11 sq km, is one of India\'s most formidable fortresses. Called "Troy of the East" by the Marathas, it withstood an 8-year Mughal siege (1689–1698). Built by multiple dynasties including Chola, Vijayanagara, Maratha, Mughal, and French.',
    facts: [
      'Rajaram held it against Aurangzeb\'s full army for 8 years — one of the longest sieges',
      'The fort spans three hills: Rajagiri (sheer 150-ft cliffs), Krishnagiri, and Chandrayandurg',
      'French East India Company used it as their South India headquarters (1750–1761)',
    ],
    significance: 'A remarkable example of military architecture and one of the most strategically significant forts in South Indian history.',
    visitor_info: 'Open daily 9 AM – 5:30 PM. Entry ₹25 (Indians), ₹300 (foreigners). Strenuous climb — wear sturdy shoes.',
  },
  {
    id: 'site-004',
    name: 'Meenakshi Amman Temple',
    location: 'Madurai, Tamil Nadu, India',
    period: 'Ancient to Nayak Period (6th century BCE – 17th century CE)',
    style: 'Dravidian — Nayak elaboration',
    builder: 'Kulashekhara Pandya (original); Nayak rulers (current structure)',
    date: 'Original: 6th cent BCE; Current: 16th–17th cent CE',
    overview: 'The Meenakshi Amman Temple in Madurai is one of the world\'s great Hindu temples, covering 45 acres with 14 towering gopurams (the tallest at 52 m). Its 1,000-pillar hall contains musical pillars that produce distinct tones when struck. The temple receives 15,000–30,000 visitors daily.',
    facts: [
      'The "1000-pillar hall" actually has 985 pillars — each carved to produce musical tones',
      '14 gopurams decorated with ~33,000 colorful stucco sculptures',
      'The temple runs its own gold and jewelry museum with centuries-old artifacts',
    ],
    significance: 'The living heart of Madurai city for 2,000+ years, the temple defines Dravidian architecture and remains one of the most visited pilgrimage sites in India.',
    visitor_info: 'Open daily 5 AM – 12:30 PM and 4 PM – 10 PM. Entry free (museum: ₹50). Non-Hindus may access outer areas.',
  },
  {
    id: 'site-005',
    name: 'Thanjavur Maratha Palace',
    location: 'Thanjavur, Tamil Nadu, India',
    period: 'Nayak/Maratha Period (16th–19th Century CE)',
    style: 'Hybrid: Dravidian + Maratha + European',
    builder: 'Achuthappa Nayak (original); expanded by Maratha kings',
    date: 'c. 1550 CE onward',
    overview: 'The Thanjavur Palace is a sprawling royal complex adjacent to the Brihadeeswarar Temple. Built by the Nayak dynasty and later expanded by Maratha rulers, it houses the Royal Museum (Chola bronzes), Saraswati Mahal Library (50,000+ manuscripts), and the Art Gallery.',
    facts: [
      'Saraswati Mahal Library holds 50,000+ manuscripts including rare palm-leaf records',
      'The Art Gallery displays over 1,000 Chola bronze statues — the world\'s finest collection',
      'The 7-storey Goodagopuram (Bell Tower) offers panoramic views of Thanjavur',
    ],
    significance: 'The palace complex preserves the administrative, cultural, and artistic legacy of the Chola, Nayak, and Maratha dynasties in a single site.',
    visitor_info: 'Palace open daily 9 AM – 6 PM (closed Fridays). Museum entry ₹10 (Indians), ₹250 (foreigners). Photography allowed.',
  },
  {
    id: 'site-006',
    name: 'Taj Mahal',
    location: 'Agra, Uttar Pradesh, India',
    period: 'Mughal Period (1632–1653 CE)',
    style: 'Mughal — Persian and Indian synthesis',
    builder: 'Mughal Emperor Shah Jahan',
    date: '1632–1653 CE',
    overview: 'The Taj Mahal is an ivory-white marble mausoleum built by Mughal Emperor Shah Jahan in memory of his wife Mumtaz Mahal. Completed in 1653 CE, it stands on the southern bank of the Yamuna river in Agra and is a UNESCO World Heritage Site.',
    facts: [
      '20,000 artisans from across India, Persia, and Central Asia worked for 21 years',
      'The minarets are slightly angled outward to fall away from the tomb in an earthquake',
      'The marble changes color through the day — pinkish at dawn, white at noon, golden at sunset',
    ],
    significance: 'Widely regarded as the finest example of Mughal architecture and a universal symbol of love, the Taj Mahal is India\'s most visited monument.',
    visitor_info: 'Open Sat–Thu, sunrise to sunset. Closed Fridays. Entry ₹50 (Indians), ₹1,100 (foreigners). No photography inside the mausoleum.',
  },
];

// ── Bilingual knowledge base (keyword → answer) ───────────────────────────────
export const KNOWLEDGE_BASE = {
  'site-001': {
    'who built': {
      en: 'Brihadeeswarar Temple was built by Raja Raja Chola I of the Chola dynasty, completed in 1010 CE. He was the most powerful ruler of the Chola Empire and dedicated this temple to Lord Shiva. The temple is also known as Peruvudaiyar Kovil or the "Big Temple."',
      ta: 'பிரகதீஸ்வரர் கோயில் சோழ வம்சத்தின் ராஜராஜ சோழன் I ஆல் 1010 CE இல் கட்டப்பட்டது. இந்த கோயில் "பெரிய கோவில்" என்றும் அழைக்கப்படுகிறது மற்றும் சிவபெருமானுக்கு அர்ப்பணிக்கப்பட்டது.',
    },
    'how tall': {
      en: 'The vimana (main tower) of Brihadeeswarar Temple rises to 66 meters (216 feet), making it one of the tallest temple towers in South India. It has 13 progressively receding stories and is topped by an 80-tonne monolithic granite capstone called the kumbam.',
      ta: 'பிரகதீஸ்வரர் கோயிலின் விமானம் 66 மீட்டர் (216 அடி) உயரமுள்ளது. 13 படிகட்டு கட்டமைப்புகள் மற்றும் 80 டன் கிரானைட் கும்பம் உச்சியில் உள்ளது.',
    },
    'architecture': {
      en: 'Brihadeeswarar Temple is a masterpiece of Dravidian architecture. It was built using interlocking granite blocks without mortar — a technique that has kept the structure standing for 1,000+ years. The base platform is 6.3m high, the tower has 13 stories, and the 80-tonne capstone was placed via a 6km-long ramp.',
      ta: 'இந்த கோயில் திராவிட கட்டிடக்கலையின் மேதைத்துவமான படைப்பு. சாந்து இல்லாமல் ஒன்றினொன்று பிணைந்த கிரானைட் கற்களால் கட்டப்பட்டது.',
    },
    'when': {
      en: 'The temple was built between approximately 1003 CE and 1010 CE during the reign of Raja Raja Chola I. It has stood for over 1,000 years and is still an active place of worship.',
      ta: 'கோயில் 1003 CE மற்றும் 1010 CE இடையில் ராஜராஜ சோழன் I ஆட்சியில் கட்டப்பட்டது. 1000 ஆண்டுகளுக்கும் மேலாக நிலைத்து நிற்கிறது.',
    },
    'nearby': {
      en: 'Nearby attractions in Thanjavur: (1) Thanjavur Palace & Royal Museum (Chola bronzes), (2) Saraswati Mahal Library (50,000+ manuscripts), (3) Thanjavur Art Gallery, (4) Schwartz Church, (5) Sangeetha Mahal. The palace is a 10-minute walk from the temple.',
      ta: 'அருகில்: தஞ்சாவூர் அரண்மனை அருங்காட்சியகம், சரஸ்வதி மகால் நூலகம், கலை திரட்டகம். கோயிலிலிருந்து 10 நிமிட நடை தூரம்.',
    },
    'unesco': {
      en: 'Brihadeeswarar Temple was inscribed as a UNESCO World Heritage Site in 1987 as part of the "Great Living Chola Temples" cluster, along with Gangaikonda Cholapuram and Airavatesvara Temple.',
      ta: '1987 ஆம் ஆண்டு "உயிருள்ள சோழ கோயில்கள்" கொத்தில் ஒன்றாக யுனெஸ்கோ உலக பாரம்பரிய தளமாக நியமிக்கப்பட்டது.',
    },
    'visit': {
      en: 'Visiting hours: 6 AM – 12:30 PM and 4 PM – 8:30 PM daily. Entry is free for all visitors. Camera fee ₹50 for foreigners. Dress code: modest clothing required. Best time to visit: early morning or post-5 PM for the golden light.',
      ta: 'திறந்திருக்கும் நேரம்: காலை 6 மணி – மதியம் 12:30 மற்றும் மாலை 4 மணி – இரவு 8:30. நுழைவு இலவசம். பண்டிகை காலங்களில் ஆயிரக்கணக்கான பக்தர்கள் வருவார்கள்.',
    },
  },
  'site-002': {
    'who built': {
      en: 'The Shore Temple was built by Narasimhavarman II (also called Rajasimha) of the Pallava dynasty around 700–728 CE. He was a great patron of arts and architecture who initiated the shift from rock-cut to free-standing stone temples.',
      ta: 'கடற்கரை கோயில் பல்லவ வம்சத்தின் நரசிம்மவர்மன் II (ராஜசிம்மன்) ஆல் 700-728 CE இல் கட்டப்பட்டது.',
    },
    'seven pagodas': {
      en: 'Ancient texts and 17th-century European sailors mentioned "Seven Pagodas" at Mahabalipuram, suggesting a cluster of temples existed. The 2004 Indian Ocean Tsunami temporarily exposed stone walls and structural remains on the seabed, supporting this legend. Underwater surveys found granite blocks and carved pillars offshore.',
      ta: '2004 சுனாமி கடலடியில் பழங்கால கட்டமைப்புகளை வெளிப்படுத்தியது, ஏழு தேவாலயங்களின் புராணக்கதையை உறுதிப்படுத்துகிறது.',
    },
    'tsunami': {
      en: 'Following the devastating 2004 Indian Ocean Tsunami, the sea temporarily receded at Mahabalipuram, revealing ancient stone walls, carved blocks, and structural foundations on the seabed. Archaeological Survey teams confirmed these as 7th–8th century CE ruins, supporting the "Seven Pagodas" legend.',
      ta: '2004 சுனாமிக்குப் பிறகு கடல் பின்வாங்கி 7-8ஆம் நூற்றாண்டு சிதைவுகளை வெளிப்படுத்தியது.',
    },
  },
  'site-003': {
    'troy': {
      en: 'Gingee earned the name "Troy of the East" due to its near-impregnability. The fort spans three rocky hills with sheer 150-foot cliffs, triple defensive walls, a granary that stored 7 years of provisions, and a well designed to resist poisoning. Aurangzeb\'s full Mughal army besieged it for 8 years without success.',
      ta: 'மூன்று மலைகளில் கட்டப்பட்டது, 150 அடி செங்குத்தான பாறைகள் மற்றும் மூன்று நிலை பாதுகாப்பு சுவர்கள் உடையது. ஔரங்கசீப்பின் முழு படையும் 8 ஆண்டுகள் முற்றுகையிட்டும் கைப்பற்ற முடியவில்லை.',
    },
    'maratha': {
      en: 'In 1677, Chhatrapati Shivaji captured Gingee Fort. After Shivaji\'s death, his son Rajaram used Gingee as his capital while evading Mughal Emperor Aurangzeb\'s forces. The Mughal siege lasted 8 years (1689–1698) — one of the longest in South Indian history — and the fort finally fell when Rajaram escaped to Satara.',
      ta: '1677 இல் சிவாஜி கோட்டையை கைப்பற்றினார். அவரது மகன் ராஜாராம் 1689-1698 வரை ஔரங்கசீப்பின் படையிடமிருந்து இந்த கோட்டையை பாதுகாத்தார்.',
    },
  },
  'site-004': {
    'gopuram': {
      en: 'The Meenakshi Temple has 14 gopurams (gateway towers). The four outer gopurams are the tallest: the tallest (south) is 52 meters (170 ft). All gopurams are covered with thousands of brightly painted stucco sculptures of deities, mythological figures, and animals.',
      ta: 'மீனாட்சி கோவிலில் 14 கோபுரங்கள் உள்ளன. மிக உயரமான தென் கோபுரம் 52 மீட்டர் (170 அடி) உயரமுள்ளது. ஆயிரக்கணக்கான வண்ணமயமான சிற்பங்கள் மூடியுள்ளன.',
    },
    'musical pillars': {
      en: 'The "1000-pillar Hall" (actually 985 pillars) was built around 1569 CE. Each pillar is carved from a single granite block and produces a distinct musical tone when struck gently — believed to represent the 7 musical notes (saptaswara). This unique acoustic property has never been fully explained.',
      ta: 'ஆயிரம் தூண்கள் மண்டபம் (உண்மையில் 985 தூண்கள்) 1569 CE இல் கட்டப்பட்டது. ஒவ்வொரு தூணும் தட்டப்படும்போது தனித்துவமான இசை ஒலியை தருகிறது.',
    },
    'who is meenakshi': {
      en: 'Meenakshi is the presiding deity of Madurai — a form of Parvati (consort of Shiva) described in Tamil texts as a warrior princess born to the Pandya king. The name "Meenakshi" means "fish-eyed" — symbolizing divine beauty in classical Tamil literature.',
      ta: 'மீனாட்சி என்பது மதுரையின் தெய்வம் — பார்வதியின் ஒரு வடிவம். "மீனாட்சி" என்பது "மீன் கண்களை கொண்டவள்" என்று பொருள்படும்.',
    },
  },
  'site-005': {
    'library': {
      en: 'Saraswati Mahal Library, founded in the 16th century, is one of Asia\'s oldest libraries still in use. It houses over 50,000 manuscripts — palm-leaf, paper, and vellum — in Sanskrit, Tamil, Telugu, Marathi, and other languages. Rare texts include Ayurvedic medicine treatises, astronomical charts, and illustrated botanical works.',
      ta: 'சரஸ்வதி மகால் நூலகம் 16ஆம் நூற்றாண்டில் நிறுவப்பட்டது. 50,000+ கையெழுத்துப் பிரதிகளை கொண்டுள்ளது — ஓலைச்சுவடி, காகிதம் மற்றும் தோல் வடிவங்களில்.',
    },
    'bronzes': {
      en: 'The Thanjavur Art Gallery inside the palace houses one of the world\'s finest collections of Chola bronze sculptures (9th–12th century CE). Over 1,000 bronzes are on display, including famous Nataraja (Shiva as Lord of Dance) figures, Parvati sculptures, and rare Vishnu forms. These were cast using the lost-wax (cire perdue) process.',
      ta: 'அரண்மனையில் உள்ள கலை திரட்டகம் 1,000+ சோழ வெண்கல சிலைகளை கொண்டுள்ளது. நடராஜர், பார்வதி மற்றும் விஷ்ணு சிலைகள் குறிப்பிடத்தக்கவை.',
    },
  },
};
