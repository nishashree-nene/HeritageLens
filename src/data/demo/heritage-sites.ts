import type { HeritageSite, HeritageTimeline, Artifact, Story, Quiz, NearbyPlace, HeritageSource, Reconstruction } from '../../types';

export const DEMO_SITES: HeritageSite[] = [
  {
    id: 'site-001', name_en: 'Brihadeeswarar Temple', name_ta: 'பெரிய கோவில் (பிரகதீஸ்வரர் கோயில்)',
    slug: 'brihadeeswarar-temple',
    description_en: 'The Brihadeeswarar Temple, also known as the "Big Temple" of Thanjavur, is a masterpiece of Dravidian architecture built by Raja Raja Chola I in 1010 CE. It is a UNESCO World Heritage Site and represents the pinnacle of Tamil architecture, art, and engineering.',
    description_ta: 'பிரகதீஸ்வரர் கோயில், தஞ்சாவூரின் "பெரிய கோவில்" என்றும் அழைக்கப்படுகிறது. இது 1010 CE இல் ராஜராஜ சோழன் I ஆல் கட்டப்பட்ட திராவிட கட்டிடக்கலையின் ஒரு மேதைத்துவமான படைப்பு.',
    history_en: `The Brihadeeswarar Temple was commissioned by Raja Raja Chola I and completed around 1010 CE. The temple complex stands as a testament to the Chola Empire's architectural genius and religious devotion.

The vimana (temple tower) rises to approximately 66 meters, making it one of the tallest in South India at the time of construction. The temple was built using interlocking granite stones without mortar — a technique that has kept the structure standing for over a thousand years.

The capstone (kumbam) at the top is believed to weigh 80 tonnes and was placed using an ingeniously constructed ramp. Raja Raja Chola I dedicated this temple to Lord Shiva and it became the spiritual center of the Chola Empire.

The temple walls contain inscriptions detailing administrative records — land grants, temple staff salaries, and cultural endowments. In 1987, the temple was declared a UNESCO World Heritage Site as part of the "Great Living Chola Temples" cluster.`,
    history_ta: `பிரகதீஸ்வரர் கோயில் ராஜராஜ சோழன் I ஆல் கட்டளையிடப்பட்டு சுமார் 1010 CE இல் நிறைவடைந்தது. விமானம் சுமார் 66 மீட்டர் உயரம் வரை எழுகிறது. கோயில் சாந்து இல்லாமல் ஒன்றினொன்று பிணைந்த கிரானைட் கற்களால் கட்டப்பட்டது. 1987 இல் யுனெஸ்கோ உலக பாரம்பரிய தளமாக அறிவிக்கப்பட்டது.`,
    location_name: 'Thanjavur, Tamil Nadu', latitude: 10.7828, longitude: 79.1318,
    heritage_type: 'temple', historical_period: 'Chola Period (985–1014 CE)',
    construction_date: '1010 CE', builder: 'Raja Raja Chola I', dynasty: 'Chola Dynasty',
    current_condition: 'Exceptionally well preserved. Active place of worship maintained by the Archaeological Survey of India.',
    preservation_status: 'excellent',
    featured_image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Brihadeeswarar_temple_in_Thanjavur.jpg/1280px-Brihadeeswarar_temple_in_Thanjavur.jpg',
    ar_available: true, model_available: true, verification_status: 'verified', is_unesco: true,
    tags: ['UNESCO', 'Chola', 'Temple', 'Granite', 'Dravidian Architecture'],
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Brihadeeswarar_temple_in_Thanjavur.jpg/1280px-Brihadeeswarar_temple_in_Thanjavur.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Thanjavur_Brihadeeswarar_Temple_1.jpg/1280px-Thanjavur_Brihadeeswarar_Temple_1.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Brihadeeswara_Temple%2C_Thanjavur.jpg/1280px-Brihadeeswara_Temple%2C_Thanjavur.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Shiva_as_the_Lord_of_Dance_LACMA_edit.jpg/800px-Shiva_as_the_Lord_of_Dance_LACMA_edit.jpg',
    ],
    past_image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Brihadeeswara_Temple%2C_Thanjavur.jpg/1280px-Brihadeeswara_Temple%2C_Thanjavur.jpg',
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'site-002', name_en: 'Shore Temple, Mahabalipuram', name_ta: 'கடற்கரை கோயில், மாமல்லபுரம்',
    slug: 'shore-temple-mahabalipuram',
    description_en: 'The Shore Temple of Mahabalipuram is one of the oldest structural stone temples of South India, built during the reign of Narasimhavarman II (Rajasimha) of the Pallava dynasty around 700 CE. Standing on the shores of the Bay of Bengal, it is a UNESCO World Heritage Site.',
    description_ta: 'மாமல்லபுரத்தின் கடற்கரை கோயில் தென்னிந்தியாவின் மிகவும் பழமையான கட்டமைப்பு கல் கோயில்களில் ஒன்றாகும். இது சுமார் 700 CE இல் பல்லவ வம்சத்தின் நரசிம்மவர்மன் II ஆட்சியில் கட்டப்பட்டது.',
    history_en: `The Shore Temple was built around 700–728 CE during the reign of Narasimhavarman II (also called Rajasimha) using granite blocks, making it one of the earliest examples of Dravidian stone architecture.

Ancient texts and 17th-century European sailors' accounts mention "Seven Pagodas" at Mahabalipuram. Following the 2004 Indian Ocean Tsunami, the sea temporarily receded, revealing ancient stone walls and structural remains on the seabed — supporting the legend of submerged temples.

The site was designated a UNESCO World Heritage Site in 1984 as part of the "Group of Monuments at Mahabalipuram."`,
    history_ta: `கடற்கரை கோயில் நரசிம்மவர்மன் II (ராஜசிம்மன்) ஆட்சியில் சுமார் 700-728 CE இல் கட்டப்பட்டது. 2004 சுனாமியைத் தொடர்ந்து கடல் பின்வாங்கி பழங்கால கட்டமைப்பு எச்சங்களை வெளிப்படுத்தியது.`,
    location_name: 'Mahabalipuram, Tamil Nadu', latitude: 12.6173, longitude: 80.1993,
    heritage_type: 'temple', historical_period: 'Pallava Period (700–728 CE)',
    construction_date: '700–728 CE', builder: 'Narasimhavarman II (Rajasimha)', dynasty: 'Pallava Dynasty',
    current_condition: 'Weathered but structurally sound. Significant erosion from sea exposure. Ongoing ASI conservation.',
    preservation_status: 'good',
    featured_image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Shore_Temple_2.jpg/1280px-Shore_Temple_2.jpg',
    ar_available: true, model_available: true, verification_status: 'verified', is_unesco: true,
    tags: ['UNESCO', 'Pallava', 'Coastal', 'Dravidian'],
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Shore_Temple_2.jpg/1280px-Shore_Temple_2.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Shore_temple_1.jpg/1280px-Shore_temple_1.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Pancha_Rathas_Mahabalipuram_2007.jpg/1280px-Pancha_Rathas_Mahabalipuram_2007.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Arjuna%27s_Penance.jpg/1280px-Arjuna%27s_Penance.jpg',
    ],
    past_image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Pancha_Rathas_Mahabalipuram_2007.jpg/1280px-Pancha_Rathas_Mahabalipuram_2007.jpg',
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'site-003', name_en: 'Gingee Fort', name_ta: 'செஞ்சி கோட்டை',
    slug: 'gingee-fort',
    description_en: 'Gingee Fort, known as the "Troy of the East," is one of the most impregnable fortresses in India. Spread across three hills — Rajagiri, Krishnagiri and Chandrayandurg — the fort complex spans over 11 square kilometers.',
    description_ta: 'கிழக்கின் ட்ராய் என்று அழைக்கப்படும் செஞ்சி கோட்டை மூன்று மலைகளில் பரந்து விரிந்திருக்கிறது.',
    history_en: `The origins of Gingee Fort date back to the 9th century CE under the Chola dynasty. The fort gained prominence under the Vijayanagara Empire in the 15th century.

In 1677, Chhatrapati Shivaji captured the fort. His son Rajaram held it against Mughal Emperor Aurangzeb's forces for eight years (1689–1698) — one of the longest sieges in South Indian history.

The French East India Company controlled the fort from 1750–1761, making it the seat of French power in South India. The fort finally passed to British control in 1761.`,
    history_ta: `செஞ்சி கோட்டையின் தோற்றம் 9ஆம் நூற்றாண்டில் சோழர் காலத்தில் தொடங்குகிறது. 1677 இல் சிவாஜி இந்த கோட்டையை கைப்பற்றினார். ஔரங்கசீப்பின் படைகளுக்கு எதிராக ராஜாராம் 8 ஆண்டுகள் இந்த கோட்டையை பாதுகாத்தார்.`,
    location_name: 'Gingee, Villupuram, Tamil Nadu', latitude: 12.2508, longitude: 79.4158,
    heritage_type: 'fort', historical_period: 'Multi-period: Chola to British (9th–18th Century)',
    construction_date: '9th Century CE', builder: 'Multiple dynasties', dynasty: 'Chola / Vijayanagara / Maratha / Mughal / French',
    current_condition: 'Partially ruined but structurally significant. Several structures well preserved. ASI protected monument.',
    preservation_status: 'fair',
    featured_image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Rajagiri_citadel_of_Gingee_Fort.jpg/1280px-Rajagiri_citadel_of_Gingee_Fort.jpg',
    ar_available: true, model_available: false, verification_status: 'verified', is_unesco: false,
    tags: ['Fort', 'Military', 'Maratha', 'Mughal', 'Multi-dynasty'],
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Rajagiri_citadel_of_Gingee_Fort.jpg/1280px-Rajagiri_citadel_of_Gingee_Fort.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Gingee_Fort_Krishnagiri.jpg/1280px-Gingee_Fort_Krishnagiri.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Rajagiri_citadel_of_Gingee_Fort.jpg/800px-Rajagiri_citadel_of_Gingee_Fort.jpg',
    ],
    past_image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Gingee_Fort_Krishnagiri.jpg/1280px-Gingee_Fort_Krishnagiri.jpg',
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'site-004', name_en: 'Meenakshi Amman Temple', name_ta: 'மீனாட்சி அம்மன் கோவில்',
    slug: 'meenakshi-amman-temple',
    description_en: 'The Meenakshi Amman Temple in Madurai is one of the greatest Hindu temples in the world. The temple complex covers 45 acres and features 14 gateway towers (gopurams), with the tallest reaching 52 meters, all covered with thousands of multi-colored sculptures.',
    description_ta: 'மதுரையில் உள்ள மீனாட்சி அம்மன் கோவில் உலகின் மிகப்பெரிய இந்து கோயில்களில் ஒன்றாகும். 45 ஏக்கரில் பரந்து விரிந்திருக்கும் இந்த கோயில் வளாகத்தில் 14 நுழைவாயில் கோபுரங்கள் உள்ளன.',
    history_en: `The history of the Meenakshi Temple stretches back over 2,000 years. The original temple was built by Kulashekhara Pandya around the 6th century BCE.

The current structure dates primarily to the 16th and 17th centuries when the Nayak rulers significantly expanded it. The famous 1000-pillar hall (actually 985 pillars), built around 1569 CE, contains musical pillars — each producing distinct musical tones when struck. The temple receives 20,000–30,000 visitors daily.`,
    history_ta: `மீனாட்சி கோவிலின் வரலாறு 2,000 ஆண்டுகளுக்கும் மேல் நீண்டுள்ளது. நவீன கட்டமைப்பு 16-17ஆம் நூற்றாண்டில் நாயக்க ஆட்சியாளர்களால் விரிவுபடுத்தப்பட்டது. புகழ்பெற்ற இசை தூண்கள் தனித்துவமான இசை ஒலிகளை உருவாக்குகின்றன.`,
    location_name: 'Madurai, Tamil Nadu', latitude: 9.9195, longitude: 78.1193,
    heritage_type: 'temple', historical_period: 'Ancient to Nayak Period (6th century BCE – 17th century CE)',
    construction_date: 'Original: 6th century BCE; Current: 16th–17th CE',
    builder: 'Kulashekhara Pandya (original); Vishwanatha Nayak (current)', dynasty: 'Pandya / Nayak Dynasty',
    current_condition: 'Excellent condition. Highly active religious site with continuous maintenance.',
    preservation_status: 'excellent',
    featured_image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Madurai_Meenakshi_Amman_Temple.jpg/1280px-Madurai_Meenakshi_Amman_Temple.jpg',
    ar_available: true, model_available: true, verification_status: 'verified', is_unesco: false,
    tags: ['Temple', 'Nayak', 'Pandya', 'Gopuram', 'Dravidian'],
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Madurai_Meenakshi_Amman_Temple.jpg/1280px-Madurai_Meenakshi_Amman_Temple.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Meenakshi_amman_temple_madurai.jpg/1280px-Meenakshi_amman_temple_madurai.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Gopuram_detail%2C_Meenakshi_Amman_Temple.jpg/1280px-Gopuram_detail%2C_Meenakshi_Amman_Temple.jpg',
    ],
    past_image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Meenakshi_amman_temple_madurai.jpg/1280px-Meenakshi_amman_temple_madurai.jpg',
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'site-005', name_en: 'Thanjavur Palace', name_ta: 'தஞ்சாவூர் மராட்டியர் அரண்மனை',
    slug: 'thanjavur-palace',
    description_en: 'The Thanjavur Maratha Palace served as the official residence of the Bhonsle rulers. The palace contains the famous Saraswati Mahal Library with over 50,000 manuscripts, and the Royal Museum with Chola bronzes.',
    description_ta: 'தஞ்சாவூர் மராட்டியர் அரண்மனையில் 50,000-க்கும் மேற்பட்ட கையெழுத்துப் பிரதிகளுடன் சரஸ்வதி மகால் நூலகம் உள்ளது.',
    history_en: `The Thanjavur Palace was originally built by the Nayak rulers in the 16th century. The Marathas, who took over in 1674 under Venkoji (half-brother of Shivaji), expanded the palace significantly.

The Bhonsle Maratha dynasty ruled Thanjavur for over 200 years (1674–1855 CE) transforming it into a center of culture and scholarship. The Saraswati Mahal Library contains over 50,000 manuscripts in Tamil, Sanskrit, Marathi and Telugu — one of the rarest collections in Asia.`,
    history_ta: `அரண்மனை வளாகம் ஆரம்பத்தில் 16ஆம் நூற்றாண்டில் நாயக்க ஆட்சியாளர்களால் கட்டப்பட்டது. மராட்டியர்கள் 1674 இல் தஞ்சாவூரை கைப்பற்றி அரண்மனையை விரிவுபடுத்தினர்.`,
    location_name: 'Thanjavur, Tamil Nadu', latitude: 10.7878, longitude: 79.1376,
    heritage_type: 'palace', historical_period: 'Nayak and Maratha Period (16th–19th Century)',
    construction_date: '16th century CE', builder: 'Thanjavur Nayaks / Bhonsle Marathas', dynasty: 'Nayak / Bhonsle Maratha Dynasty',
    current_condition: 'Partially restored. Royal Museum and Saraswati Mahal well maintained.',
    preservation_status: 'fair',
    featured_image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Thanjavur_Palace_art_gallery.jpg/1280px-Thanjavur_Palace_art_gallery.jpg',
    ar_available: false, model_available: false, verification_status: 'verified', is_unesco: false,
    tags: ['Palace', 'Maratha', 'Library', 'Manuscripts', 'Museum'],
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Thanjavur_Palace_art_gallery.jpg/1280px-Thanjavur_Palace_art_gallery.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Thanjavur_Maratha_Palace.jpg/1280px-Thanjavur_Maratha_Palace.jpg',
    ],
    past_image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Thanjavur_Maratha_Palace.jpg/1280px-Thanjavur_Maratha_Palace.jpg',
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
  },
];

export const DEMO_TIMELINES: HeritageTimeline[] = [
  { id: 't-001', heritage_site_id: 'site-001', year_label: '985 CE', sort_order: 1,
    title_en: 'Raja Raja Chola I Ascends', title_ta: 'ராஜராஜ சோழன் I சிம்மாசனம்',
    description_en: 'Raja Raja Chola I becomes king and begins consolidating the Chola empire across South India and Sri Lanka.', description_ta: 'ராஜராஜ சோழன் I அரசராகி தென்னிந்தியா மற்றும் இலங்கையில் சோழ சாம்ராஜ்யத்தை ஒருங்கிணைக்கத் தொடங்குகிறார்.' },
  { id: 't-002', heritage_site_id: 'site-001', year_label: '1003 CE', sort_order: 2,
    title_en: 'Temple Construction Begins', title_ta: 'கோயில் கட்டுமானம் தொடங்கியது',
    description_en: 'Construction of the Brihadeeswarar Temple begins. Thousands of granite blocks are transported from quarries near Trichy.', description_ta: 'பிரகதீஸ்வரர் கோயிலின் கட்டுமானம் தொடங்குகிறது. திருச்சி அருகே கிரானைட் தொகுதிகள் கொண்டுவரப்படுகின்றன.' },
  { id: 't-003', heritage_site_id: 'site-001', year_label: '1010 CE', sort_order: 3,
    title_en: 'Temple Consecration', title_ta: 'கோயில் கும்பாபிஷேகம்',
    description_en: 'The temple is consecrated. The 80-tonne capstone is placed atop the vimana using a brilliantly engineered ramp system.', description_ta: 'கோயில் கும்பாபிஷேகம் செய்யப்படுகிறது. 80 டன் உச்சிக்கல் விமானத்தின் மேல் வைக்கப்படுகிறது.' },
  { id: 't-004', heritage_site_id: 'site-001', year_label: '1012 CE', sort_order: 4,
    title_en: 'Royal Inscriptions Added', title_ta: 'அரசகீய கல்வெட்டுகள் சேர்க்கப்பட்டன',
    description_en: 'Inscriptions recording 107 devadasis, musicians, priests and administrative staff are carved into the temple walls.', description_ta: 'கோயில் சுவர்களில் கல்வெட்டுகள் செதுக்கப்படுகின்றன.' },
  { id: 't-005', heritage_site_id: 'site-001', year_label: '1600s CE', sort_order: 5,
    title_en: 'Nayak Additions', title_ta: 'நாயக்கர் கூட்டுதல்கள்',
    description_en: 'The Nayak rulers add outer compound walls and smaller shrines to the temple complex.', description_ta: 'நாயக்க ஆட்சியாளர்கள் வெளி சுவர்கள் மற்றும் சிறிய ஆலயங்களைச் சேர்க்கிறார்கள்.' },
  { id: 't-006', heritage_site_id: 'site-001', year_label: '1987 CE', sort_order: 6,
    title_en: 'UNESCO World Heritage Site', title_ta: 'யுனெஸ்கோ உலக பாரம்பரிய தளம்',
    description_en: 'The temple is designated a UNESCO World Heritage Site as part of the "Great Living Chola Temples."', description_ta: '"மகத்தான வாழும் சோழ கோயில்கள்" என்ற பட்டியலில் சேர்க்கப்படுகிறது.' },
  { id: 't-007', heritage_site_id: 'site-001', year_label: '2010 CE', sort_order: 7,
    title_en: 'Millennium Celebration', title_ta: 'ஆயிரமாண்டு விழா',
    description_en: 'The 1000th year of the temple\'s consecration is celebrated with international recognition.', description_ta: 'கோயிலின் கும்பாபிஷேகத்தின் 1000ஆம் ஆண்டு சர்வதேச அங்கீகாரத்துடன் கொண்டாடப்படுகிறது.' },
  { id: 't-008', heritage_site_id: 'site-002', year_label: '600 CE', sort_order: 1,
    title_en: 'Pallava Port City Established', title_ta: 'பல்லவ துறைமுக நகரம் நிறுவப்பட்டது',
    description_en: 'Narasimhavarman I establishes Mahabalipuram as a major port and begins rock-cut architecture.', description_ta: 'நரசிம்மவர்மன் I மாமல்லபுரத்தை துறைமுக நகரமாக நிறுவுகிறார்.' },
  { id: 't-009', heritage_site_id: 'site-002', year_label: '700 CE', sort_order: 2,
    title_en: 'Shore Temple Construction', title_ta: 'கடற்கரை கோயில் கட்டுமானம்',
    description_en: 'Narasimhavarman II begins construction of the Shore Temple using granite, pioneering structural stone architecture.', description_ta: 'நரசிம்மவர்மன் II கடற்கரை கோயிலின் கட்டுமானத்தை தொடங்குகிறார்.' },
  { id: 't-010', heritage_site_id: 'site-002', year_label: '2004 CE', sort_order: 3,
    title_en: 'Tsunami Reveals Ancient Structures', title_ta: 'சுனாமி பழங்கால கட்டமைப்புகளை வெளிப்படுத்துகிறது',
    description_en: 'The 2004 Indian Ocean Tsunami temporarily exposes ancient stone walls on the seabed near the temple.', description_ta: '2004 சுனாமி கடலடியில் பழங்கால கல் சுவர்களை வெளிப்படுத்துகிறது.' },
];

export const DEMO_ARTIFACTS: Artifact[] = [
  {
    id: 'art-001', heritage_site_id: 'site-001', name_en: 'Nandi (Sacred Bull)', name_ta: 'நந்தி (புனித காளை)',
    description_en: 'The large monolithic Nandi in the Brihadeeswarar Temple faces the main shrine. Carved from a single granite block, it measures 6 meters in length and 2.5 meters in height. Added in the 16th century by the Nayak rulers, it is one of the largest Nandi sculptures in India.',
    description_ta: 'பிரகதீஸ்வரர் கோயிலில் உள்ள பெரிய ஒற்றைக்கல் நந்தி முதன்மை ஆலயத்தை நோக்கியிருக்கிறது. 6 மீட்டர் நீளம் மற்றும் 2.5 மீட்டர் உயரம் கொண்டது.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Brihadeeswarar_temple_in_Thanjavur.jpg/800px-Brihadeeswarar_temple_in_Thanjavur.jpg',
    historical_period: '16th Century CE (Nayak)', source_reference: 'Archaeological Survey of India, Thanjavur Circle',
  },
  {
    id: 'art-002', heritage_site_id: 'site-001', name_en: 'Vimana Tower (66m)', name_ta: 'விமானம் (66 மீட்டர்)',
    description_en: 'The vimana of Brihadeeswarar Temple rises 66 meters — the tallest in South India when built. The tower has 13 progressively receding stories. The topmost monolithic capstone weighs approximately 80 tonnes.',
    description_ta: 'பிரகதீஸ்வரர் கோயிலின் விமானம் 66 மீட்டர் உயரத்தில் எழுகிறது. கோபுரம் 13 படிகளைக் கொண்டுள்ளது. உச்சிக்கல் சுமார் 80 டன் எடை கொண்டது.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Brihadeeswarar_temple_in_Thanjavur.jpg/800px-Brihadeeswarar_temple_in_Thanjavur.jpg',
    historical_period: '1010 CE (Chola)', source_reference: 'UNESCO World Heritage Documentation, 1987',
  },
  {
    id: 'art-003', heritage_site_id: 'site-001', name_en: 'Chola Bronze — Nataraja', name_ta: 'சோழர் வெண்கலம் — நடராஜர்',
    description_en: 'Chola bronzes from Thanjavur represent the pinnacle of Indian metal casting. The Nataraja (dancing Shiva) depicts the cosmic dance of creation and destruction. Lost-wax (cire-perdue) technique was used to achieve intricate detailing.',
    description_ta: 'சோழர் வெண்கலங்கள் இந்திய உலோக வார்ப்பின் உச்சத்தை பிரதிநிதித்துவப்படுத்துகின்றன. நடராஜர் படைப்பு மற்றும் அழிவின் அண்டவெளி நடனத்தை சித்தரிக்கிறது.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Shiva_as_the_Lord_of_Dance_LACMA_edit.jpg/800px-Shiva_as_the_Lord_of_Dance_LACMA_edit.jpg',
    historical_period: '10th–11th Century CE (Chola)', source_reference: 'Thanjavur Art Gallery; T.A. Gopinatha Rao, Elements of Hindu Iconography',
  },
  {
    id: 'art-004', heritage_site_id: 'site-002', name_en: 'Pancha Rathas (Five Rathas)', name_ta: 'பஞ்ச ரதங்கள்',
    description_en: 'Five monolithic rock-cut temples carved from single boulders during the reign of Narasimhavarman I (7th century CE). Each is named after a Pandava brother. They were never completed and likely served as architectural prototypes.',
    description_ta: 'ஒற்றை பாறைகளில் இருந்து செதுக்கப்பட்ட பஞ்ச ரதங்கள் 7ஆம் நூற்றாண்டில் நரசிம்மவர்மன் I ஆட்சியில் கட்டப்பட்டன.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Pancha_Rathas_Mahabalipuram_2007.jpg/1280px-Pancha_Rathas_Mahabalipuram_2007.jpg',
    historical_period: '7th Century CE (Pallava)', source_reference: 'UNESCO World Heritage Documentation; K.R. Srinivasan',
  },
];

export const DEMO_STORIES: Story[] = [
  {
    id: 'story-001', heritage_site_id: 'site-001',
    title_en: 'The Legend of the Floating Capstone', title_ta: 'மிதக்கும் உச்சிக்கல்லின் புராணக்கதை',
    content_en: `Welcome to the Brihadeeswarar Temple — one of the greatest architectural achievements in human history.

Stand here and look up at the vimana rising 66 meters above you. Over a thousand years ago, Raja Raja Chola I looked at this same earth and decided to build something that would defy time itself.

The year was approximately 1003 CE. The king had already conquered much of South India and Sri Lanka. But his greatest ambition was spiritual and artistic — he wanted to build a temple worthy of Lord Shiva.

The engineering challenge was immense. How do you place an 80-tonne capstone at the top of a 66-meter tower without cranes or machines?

Ancient Tamil engineers solved this with brilliant ingenuity. They constructed a ramp — some accounts say it stretched 6 kilometers — gradually rising to the height of the tower.

The temple was built without a single drop of mortar. The granite blocks interlock with such precision that a sheet of paper cannot be inserted between them. They have held together through earthquakes, floods, invasions, and a thousand years of monsoons.

As you explore the carvings on the walls, remember: each figure was made by a sculptor who knew they were creating something eternal.`,
    content_ta: `பிரகதீஸ்வரர் கோயிலுக்கு வரவேற்கிறோம் — மனித வரலாற்றில் மிகப்பெரிய கட்டிடக்கலை சாதனைகளில் ஒன்று.

உங்களுக்கு மேலே 66 மீட்டர் உயரத்தில் எழும் விமானத்தை பாருங்கள். ஆயிரம் ஆண்டுகளுக்கு முன்பு, ராஜராஜ சோழன் I இதே மண்ணைப் பார்த்து காலத்தை சவால் செய்யும் ஒன்றை கட்ட முடிவு செய்தார்.

பழைய தமிழ் பொறியாளர்கள் ஒரு சாய்வு பாதை கட்டி 80 டன் உச்சிக்கல்லை மேலே கொண்டு சென்றனர்.

சாந்து இல்லாமல் ஒன்றினொன்று பிணைந்த கிரானைட் கற்கள் ஆயிரம் ஆண்டுகளாக நிலைத்திருக்கின்றன.`,
    verification_status: 'verified', author: 'Archaeological Survey of India',
  },
  {
    id: 'story-002', heritage_site_id: 'site-002',
    title_en: 'The Mystery of the Seven Pagodas', title_ta: 'ஏழு தேவாலயங்களின் மர்மம்',
    content_en: `The Shore Temple stands at the edge of the Bay of Bengal. For centuries, sailors used it as a landmark to find the port of Mahabalipuram.

But there is a mystery here — one that the ocean revealed after 1,300 years of silence.

Ancient texts and 17th-century European sailors mentioned "Seven Pagodas" at Mahabalipuram. Only the Shore Temple was visible. The others, people thought, were myth.

Then came December 26, 2004.

When the great Indian Ocean Tsunami struck, the sea retreated dramatically. Fishermen on the shore saw something impossible: ancient carved walls, temple foundations, and stone structures emerging from the seabed.

The water returned, the tsunami crashed, and those structures vanished again. But archaeologists had seen enough. Subsequent underwater surveys confirmed ancient structural remains extending from the shore.

The "Seven Pagodas" of ancient texts may not have been a myth at all.`,
    content_ta: `கடற்கரை கோயில் வங்காள விரிகுடாவின் விளிம்பில் நிற்கிறது. பழங்கால நூல்கள் மாமல்லபுரத்தில் "ஏழு தேவாலயங்கள்" பற்றி குறிப்பிடுகின்றன.

2004 சுனாமியின் போது கடல் பின்வாங்கி பழங்கால கல் சுவர்களை வெளிப்படுத்தியது. இது ஏழு தேவாலயங்களின் புராணக்கதை உண்மையாக இருக்கலாம் என்ற நம்பிக்கையை வலுப்படுத்தியது.`,
    verification_status: 'verified', author: 'HeritageLens Research Team',
  },
];

export const DEMO_QUIZZES: Quiz[] = [
  {
    id: 'quiz-001', heritage_site_id: 'site-001',
    title: 'Brihadeeswarar Temple — Heritage Quiz',
    description: 'Test your knowledge of one of the greatest temples in India',
    questions: [
      {
        id: 'q-001', quiz_id: 'quiz-001', question_type: 'multiple_choice', sort_order: 1,
        question: 'Who commissioned the construction of the Brihadeeswarar Temple?',
        question_ta: 'பிரகதீஸ்வரர் கோயிலின் கட்டுமானத்தை யார் கட்டளையிட்டார்கள்?',
        explanation: 'Raja Raja Chola I commissioned the temple, completed in 1010 CE. He dedicated it to Lord Shiva.',
        options: [
          { id: 'o-001', question_id: 'q-001', option_text: 'Raja Raja Chola I', option_text_ta: 'ராஜராஜ சோழன் I', is_correct: true },
          { id: 'o-002', question_id: 'q-001', option_text: 'Rajendra Chola I', option_text_ta: 'ராஜேந்திர சோழன் I', is_correct: false },
          { id: 'o-003', question_id: 'q-001', option_text: 'Kulottunga Chola', option_text_ta: 'குலோத்துங்க சோழன்', is_correct: false },
          { id: 'o-004', question_id: 'q-001', option_text: 'Vijayalaya Chola', option_text_ta: 'விஜயாலய சோழன்', is_correct: false },
        ],
      },
      {
        id: 'q-002', quiz_id: 'quiz-001', question_type: 'multiple_choice', sort_order: 2,
        question: 'Approximately how tall is the vimana (main tower) of Brihadeeswarar Temple?',
        question_ta: 'பிரகதீஸ்வரர் கோயிலின் விமானம் தோராயமாக எவ்வளவு உயரம்?',
        explanation: 'The vimana rises approximately 66 meters (216 feet), making it one of the tallest in South India when built.',
        options: [
          { id: 'o-005', question_id: 'q-002', option_text: '30 meters', option_text_ta: '30 மீட்டர்', is_correct: false },
          { id: 'o-006', question_id: 'q-002', option_text: '66 meters', option_text_ta: '66 மீட்டர்', is_correct: true },
          { id: 'o-007', question_id: 'q-002', option_text: '100 meters', option_text_ta: '100 மீட்டர்', is_correct: false },
          { id: 'o-008', question_id: 'q-002', option_text: '45 meters', option_text_ta: '45 மீட்டர்', is_correct: false },
        ],
      },
      {
        id: 'q-003', quiz_id: 'quiz-001', question_type: 'true_false', sort_order: 3,
        question: 'The Brihadeeswarar Temple was built WITHOUT any mortar between the granite stones.',
        question_ta: 'பிரகதீஸ்வரர் கோயில் கிரானைட் கற்களுக்கிடையில் சாந்து இல்லாமல் கட்டப்பட்டது.',
        explanation: 'TRUE. The temple uses interlocking granite stones without mortar — this technique has kept it standing for 1,000+ years.',
        options: [
          { id: 'o-009', question_id: 'q-003', option_text: 'True', option_text_ta: 'உண்மை', is_correct: true },
          { id: 'o-010', question_id: 'q-003', option_text: 'False', option_text_ta: 'பொய்', is_correct: false },
        ],
      },
      {
        id: 'q-004', quiz_id: 'quiz-001', question_type: 'multiple_choice', sort_order: 4,
        question: 'In which year was the Brihadeeswarar Temple declared a UNESCO World Heritage Site?',
        question_ta: 'பிரகதீஸ்வரர் கோயில் எந்த ஆண்டில் யுனெஸ்கோ உலக பாரம்பரிய தளமாக அறிவிக்கப்பட்டது?',
        explanation: 'The temple was declared a UNESCO World Heritage Site in 1987 as part of the "Great Living Chola Temples."',
        options: [
          { id: 'o-011', question_id: 'q-004', option_text: '1987', option_text_ta: '1987', is_correct: true },
          { id: 'o-012', question_id: 'q-004', option_text: '1995', option_text_ta: '1995', is_correct: false },
          { id: 'o-013', question_id: 'q-004', option_text: '2000', option_text_ta: '2000', is_correct: false },
          { id: 'o-014', question_id: 'q-004', option_text: '1972', option_text_ta: '1972', is_correct: false },
        ],
      },
      {
        id: 'q-005', quiz_id: 'quiz-001', question_type: 'multiple_choice', sort_order: 5,
        question: 'What architectural style does the Brihadeeswarar Temple represent?',
        question_ta: 'பிரகதீஸ்வரர் கோயில் எந்த கட்டிடக்கலை பாணியை பிரதிநிதித்துவப்படுத்துகிறது?',
        explanation: 'The temple represents Dravidian architecture, characterized by pyramid-shaped towers and elaborate granite carvings.',
        options: [
          { id: 'o-015', question_id: 'q-005', option_text: 'Dravidian Architecture', option_text_ta: 'திராவிட கட்டிடக்கலை', is_correct: true },
          { id: 'o-016', question_id: 'q-005', option_text: 'Nagara Architecture', option_text_ta: 'நாகர கட்டிடக்கலை', is_correct: false },
          { id: 'o-017', question_id: 'q-005', option_text: 'Mughal Architecture', option_text_ta: 'முகலாய கட்டிடக்கலை', is_correct: false },
          { id: 'o-018', question_id: 'q-005', option_text: 'Vesara Architecture', option_text_ta: 'வேசர கட்டிடக்கலை', is_correct: false },
        ],
      },
    ],
  },
  {
    id: 'quiz-002', heritage_site_id: 'site-002',
    title: 'Shore Temple — Heritage Quiz',
    description: 'Discover the secrets of the Pallava shore temple',
    questions: [
      {
        id: 'q-006', quiz_id: 'quiz-002', question_type: 'multiple_choice', sort_order: 1,
        question: 'The Shore Temple was built by which Pallava king?',
        question_ta: 'கடற்கரை கோயில் எந்த பல்லவ அரசனால் கட்டப்பட்டது?',
        explanation: 'The Shore Temple was built by Narasimhavarman II (Rajasimha) around 700–728 CE.',
        options: [
          { id: 'o-019', question_id: 'q-006', option_text: 'Narasimhavarman II (Rajasimha)', option_text_ta: 'நரசிம்மவர்மன் II (ராஜசிம்மன்)', is_correct: true },
          { id: 'o-020', question_id: 'q-006', option_text: 'Narasimhavarman I (Mamalla)', option_text_ta: 'நரசிம்மவர்மன் I (மாமல்லன்)', is_correct: false },
          { id: 'o-021', question_id: 'q-006', option_text: 'Mahendravarman I', option_text_ta: 'மகேந்திரவர்மன் I', is_correct: false },
          { id: 'o-022', question_id: 'q-006', option_text: 'Aparajita Varman', option_text_ta: 'அபராஜித வர்மன்', is_correct: false },
        ],
      },
      {
        id: 'q-007', quiz_id: 'quiz-002', question_type: 'true_false', sort_order: 2,
        question: 'Ancient texts mention "Seven Pagodas" at Mahabalipuram. Only one is visible above water today.',
        question_ta: 'பழைய நூல்கள் மாமல்லபுரத்தில் "ஏழு தேவாலயங்கள்" பற்றி குறிப்பிடுகின்றன.',
        explanation: 'TRUE. The 2004 tsunami temporarily exposed underwater ruins near the Shore Temple, supporting this legend.',
        options: [
          { id: 'o-023', question_id: 'q-007', option_text: 'True', option_text_ta: 'உண்மை', is_correct: true },
          { id: 'o-024', question_id: 'q-007', option_text: 'False', option_text_ta: 'பொய்', is_correct: false },
        ],
      },
    ],
  },
];

export const DEMO_NEARBY: NearbyPlace[] = [
  { id: 'np-001', heritage_site_id: 'site-001', name: 'Thanjavur Royal Palace Museum', category: 'museum', latitude: 10.7878, longitude: 79.1376, distance: 0.8, description: 'Houses Chola bronzes, Nayak paintings, and royal artifacts.', image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Thanjavur_Palace_art_gallery.jpg/800px-Thanjavur_Palace_art_gallery.jpg', opening_info: 'Demo info: ~9AM–6PM. Verify locally.' },
  { id: 'np-002', heritage_site_id: 'site-001', name: 'Saraswati Mahal Library', category: 'museum', latitude: 10.7882, longitude: 79.1380, distance: 1.0, description: 'One of Asia\'s oldest libraries with 50,000+ manuscripts in Tamil, Sanskrit, Marathi and Telugu.' },
  { id: 'np-003', heritage_site_id: 'site-001', name: 'Thanjavur Veena Craftsmen', category: 'artisan', latitude: 10.7800, longitude: 79.1280, distance: 1.5, description: 'Thanjavur is famous for handcrafted veenas. Local artisans continue this centuries-old tradition.' },
  { id: 'np-004', heritage_site_id: 'site-002', name: 'Arjuna\'s Penance', category: 'monument', latitude: 12.6195, longitude: 80.1960, distance: 0.3, description: 'One of the largest open-air rock reliefs in the world (29m × 13m). Depicts scenes from the Mahabharata.', image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Arjuna%27s_Penance.jpg/1280px-Arjuna%27s_Penance.jpg' },
  { id: 'np-005', heritage_site_id: 'site-002', name: 'Five Rathas (Pancha Rathas)', category: 'monument', latitude: 12.6145, longitude: 80.1960, distance: 0.8, description: 'Five monolithic rock-cut temples named after the Pandava brothers.', image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Pancha_Rathas_Mahabalipuram_2007.jpg/1280px-Pancha_Rathas_Mahabalipuram_2007.jpg' },
];

export const DEMO_SOURCES: HeritageSource[] = [
  { id: 'src-001', heritage_site_id: 'site-001', title: 'Thanjavur Temple Inscriptions', source_type: 'inscription', citation: 'South Indian Inscriptions, Volume II. Archaeological Survey of India, 1891.', publisher: 'ASI', year: '1891' },
  { id: 'src-002', heritage_site_id: 'site-001', title: 'UNESCO World Heritage Documentation', source_type: 'scholarly', url: 'https://whc.unesco.org/en/list/250', citation: 'UNESCO WHC. "Great Living Chola Temples." 1987.', publisher: 'UNESCO', year: '1987' },
  { id: 'src-003', heritage_site_id: 'site-002', title: 'Group of Monuments at Mahabalipuram — UNESCO', source_type: 'scholarly', url: 'https://whc.unesco.org/en/list/249', citation: 'UNESCO WHC. "Group of Monuments at Mahabalipuram." 1984.', publisher: 'UNESCO', year: '1984' },
];

export const DEMO_RECONSTRUCTIONS: Reconstruction[] = [
  {
    id: 'rec-001', heritage_site_id: 'site-001', title: 'Brihadeeswarar Temple — Original 1010 CE Appearance',
    thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Brihadeeswarar_temple_in_Thanjavur.jpg/800px-Brihadeeswarar_temple_in_Thanjavur.jpg',
    period: '1010 CE', confidence_level: 'high',
    evidence_summary: 'Based on temple inscriptions, ASI architectural documentation, and comparative Chola temple study. The main vimana and sanctum are as-built.',
    method: 'Architectural analysis + inscription evidence + archaeological documentation',
    verification_status: 'verified', created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'rec-002', heritage_site_id: 'site-002', title: 'Shore Temple — Estimated Original c. 700 CE',
    thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Shore_Temple_2.jpg/800px-Shore_Temple_2.jpg',
    period: '700 CE', confidence_level: 'medium',
    evidence_summary: 'Interpretive reconstruction. Significant erosion means some details are uncertain. Based on Pallava rock-cut temple comparisons and scholarly literature.',
    method: 'Comparative architectural analysis + surviving structural evidence',
    verification_status: 'partial', created_at: '2024-01-01T00:00:00Z',
  },
];

export const getSiteBySlug = (slug: string) => DEMO_SITES.find((s) => s.slug === slug);
export const getTimelinesForSite = (id: string) => DEMO_TIMELINES.filter((t) => t.heritage_site_id === id);
export const getArtifactsForSite = (id: string) => DEMO_ARTIFACTS.filter((a) => a.heritage_site_id === id);
export const getStoriesForSite = (id: string) => DEMO_STORIES.filter((s) => s.heritage_site_id === id);
export const getQuizzesForSite = (id: string) => DEMO_QUIZZES.filter((q) => q.heritage_site_id === id);
export const getNearbyForSite = (id: string) => DEMO_NEARBY.filter((n) => n.heritage_site_id === id);
export const getSourcesForSite = (id: string) => DEMO_SOURCES.filter((s) => s.heritage_site_id === id);
export const getReconstructionsForSite = (id: string) => DEMO_RECONSTRUCTIONS.filter((r) => r.heritage_site_id === id);
