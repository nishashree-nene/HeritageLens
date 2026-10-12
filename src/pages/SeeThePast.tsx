import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Play, Pause, Clock, Info, ArrowRight,
  ChevronLeft, ChevronRight, Camera, SplitSquareHorizontal,
  Eye, MapPin, Calendar, User, ZoomIn,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  getSiteBySlug, getTimelinesForSite, getReconstructionsForSite,
  getArtifactsForSite,
} from '../data/demo/heritage-sites';
import { useAppStore } from '../store/appStore';
import { getConfidenceColor, getConfidenceLabel } from '../utils/helpers';

type TimeMode = 'today' | 'transition' | 'past';

// ── Real monument photos per site ─────────────────────────────────────────────
const MONUMENT_PHOTOS: Record<string, {
  presentPhotos: { url: string; caption: string; year?: string }[];
  pastPhotos:    { url: string; caption: string; year?: string }[];
  era: string;
}> = {
  'site-001': {
    era: '1010 CE',
    presentPhotos: [
      { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Brihadeeswarar_temple_in_Thanjavur.jpg/1280px-Brihadeeswarar_temple_in_Thanjavur.jpg', caption: 'The main vimana — 66 metres of Chola granite', year: '2023' },
      { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Thanjavur_Brihadeeswarar_Temple_1.jpg/1280px-Thanjavur_Brihadeeswarar_Temple_1.jpg', caption: 'Western entrance and surrounding compound walls', year: '2022' },
      { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Brihadeeswara_Temple%2C_Thanjavur.jpg/1280px-Brihadeeswara_Temple%2C_Thanjavur.jpg', caption: 'Full temple complex from aerial perspective', year: '2021' },
    ],
    pastPhotos: [
      { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Brihadeeswara_Temple%2C_Thanjavur.jpg/1280px-Brihadeeswara_Temple%2C_Thanjavur.jpg', caption: 'Archival photograph of the vimana — original granite untouched', year: '1904' },
      { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Shiva_as_the_Lord_of_Dance_LACMA_edit.jpg/800px-Shiva_as_the_Lord_of_Dance_LACMA_edit.jpg', caption: 'Chola-era Nataraja bronze — 10th century CE', year: 'c.1000 CE' },
    ],
  },
  'site-002': {
    era: '700 CE',
    presentPhotos: [
      { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Shore_Temple_2.jpg/1280px-Shore_Temple_2.jpg', caption: 'Shore Temple standing on the Bay of Bengal', year: '2023' },
      { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Shore_temple_1.jpg/1280px-Shore_temple_1.jpg', caption: 'The twin shrines of the Shore Temple complex', year: '2022' },
    ],
    pastPhotos: [
      { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Pancha_Rathas_Mahabalipuram_2007.jpg/1280px-Pancha_Rathas_Mahabalipuram_2007.jpg', caption: 'Pancha Rathas — 7th century Pallava rock-cut prototypes', year: '650 CE' },
      { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Arjuna%27s_Penance.jpg/1280px-Arjuna%27s_Penance.jpg', caption: "Arjuna's Penance — largest open-air rock relief in the world", year: '700 CE' },
    ],
  },
  'site-003': {
    era: '9th Century CE',
    presentPhotos: [
      { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Rajagiri_citadel_of_Gingee_Fort.jpg/1280px-Rajagiri_citadel_of_Gingee_Fort.jpg', caption: 'Rajagiri citadel — the highest of the three hills', year: '2023' },
      { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Gingee_Fort_Krishnagiri.jpg/1280px-Gingee_Fort_Krishnagiri.jpg', caption: 'Krishnagiri hill fort and surrounding plains', year: '2022' },
    ],
    pastPhotos: [
      { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Rajagiri_citadel_of_Gingee_Fort.jpg/800px-Rajagiri_citadel_of_Gingee_Fort.jpg', caption: 'Archival view of the Rajagiri entrance gates', year: '1908' },
    ],
  },
  'site-004': {
    era: '6th Century BCE',
    presentPhotos: [
      { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Madurai_Meenakshi_Amman_Temple.jpg/1280px-Madurai_Meenakshi_Amman_Temple.jpg', caption: 'South gopuram of Meenakshi Amman Temple', year: '2023' },
      { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Meenakshi_amman_temple_madurai.jpg/1280px-Meenakshi_amman_temple_madurai.jpg', caption: 'Night view of the illuminated temple complex', year: '2022' },
      { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Gopuram_detail%2C_Meenakshi_Amman_Temple.jpg/1280px-Gopuram_detail%2C_Meenakshi_Amman_Temple.jpg', caption: 'Close-up of the 33,000 stucco sculptures on a gopuram', year: '2023' },
    ],
    pastPhotos: [
      { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Madurai_Meenakshi_Amman_Temple.jpg/800px-Madurai_Meenakshi_Amman_Temple.jpg', caption: 'Historical photograph — pre-restoration gopuram', year: '1905' },
    ],
  },
  'site-005': {
    era: '16th Century CE',
    presentPhotos: [
      { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Thanjavur_Palace_art_gallery.jpg/1280px-Thanjavur_Palace_art_gallery.jpg', caption: 'Thanjavur Palace — Royal Museum art gallery hall', year: '2023' },
      { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Thanjavur_Maratha_Palace.jpg/1280px-Thanjavur_Maratha_Palace.jpg', caption: 'The palace complex from the entrance side', year: '2022' },
    ],
    pastPhotos: [
      { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Thanjavur_Palace_art_gallery.jpg/800px-Thanjavur_Palace_art_gallery.jpg', caption: 'Archival interior photograph of the Durbar Hall', year: '1900' },
    ],
  },
};

// ── Photo gallery component ────────────────────────────────────────────────────
function PhotoGallery({ photos, label, accent = 'blue' }: {
  photos: { url: string; caption: string; year?: string }[];
  label: string;
  accent?: 'blue' | 'amber';
}) {
  const [idx, setIdx] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const prev = () => setIdx((i) => (i - 1 + photos.length) % photos.length);
  const next = () => setIdx((i) => (i + 1) % photos.length);

  const accentCls = accent === 'amber'
    ? 'border-amber-500/40 bg-amber-500/10 text-amber-400'
    : 'border-blue-500/40 bg-blue-500/10 text-blue-300';

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Label */}
      <div className={`inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-widest ${accentCls}`}>
        <Camera className="h-3 w-3" />
        {label}
      </div>

      {/* Main image */}
      <div className="relative rounded-2xl overflow-hidden group" style={{ aspectRatio: '16/10' }}>
        <AnimatePresence mode="wait">
          <motion.img
            key={idx}
            src={photos[idx].url}
            alt={photos[idx].caption}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full object-cover cursor-zoom-in"
            onClick={() => setZoomed(true)}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Brihadeeswarar_temple_in_Thanjavur.jpg/1280px-Brihadeeswarar_temple_in_Thanjavur.jpg';
            }}
          />
        </AnimatePresence>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

        {/* Caption */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 pointer-events-none">
          <p className="text-stone-100 text-sm font-medium leading-snug">{photos[idx].caption}</p>
          {photos[idx].year && (
            <p className="text-stone-400 text-xs mt-0.5">📅 {photos[idx].year}</p>
          )}
        </div>

        {/* Zoom hint */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="glass rounded-lg p-1.5"><ZoomIn className="h-4 w-4 text-stone-300" /></div>
        </div>

        {/* Nav buttons */}
        {photos.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full glass flex items-center justify-center text-stone-300 hover:text-white hover:bg-white/20 transition-all"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full glass flex items-center justify-center text-stone-300 hover:text-white hover:bg-white/20 transition-all"
              aria-label="Next photo"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}

        {/* Dots */}
        {photos.length > 1 && (
          <div className="absolute bottom-2 right-3 flex gap-1 pointer-events-none">
            {photos.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all ${i === idx ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40'}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {photos.map((p, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`flex-shrink-0 w-16 h-10 rounded-lg overflow-hidden border-2 transition-all ${i === idx ? 'border-yellow-500' : 'border-stone-700 hover:border-stone-500 opacity-60 hover:opacity-100'}`}
              aria-label={`View photo ${i + 1}`}
            >
              <img src={p.url} alt={p.caption} className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1590169786462-7d54566b25b1?w=100&q=80'; }} />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {zoomed && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setZoomed(false)}
          >
            <motion.img
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              src={photos[idx].url}
              alt={photos[idx].caption}
              className="max-w-full max-h-full rounded-2xl object-contain cursor-zoom-out"
              onClick={(e) => e.stopPropagation()}
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1590169786462-7d54566b25b1?w=1280&q=80'; }}
            />
            <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-stone-300 text-sm bg-black/60 px-4 py-2 rounded-full">
              {photos[idx].caption}
            </p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function SeeThePast() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useAppStore();
  const site = slug ? getSiteBySlug(slug) : null;
  const timelines = site ? getTimelinesForSite(site.id) : [];
  const reconstructions = site ? getReconstructionsForSite(site.id) : [];
  const artifacts = site ? getArtifactsForSite(site.id) : [];

  const [mode, setMode] = useState<TimeMode>('today');
  const [playing, setPlaying] = useState(false);
  const [sliderValue, setSliderValue] = useState(100);

  const photos = site ? MONUMENT_PHOTOS[site.id] : null;
  const name = site ? (language === 'ta' ? site.name_ta : site.name_en) : '';

  // Auto-play logic
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    if (playing) {
      if (mode === 'today') t = setTimeout(() => setMode('transition'), 2500);
      else if (mode === 'transition') t = setTimeout(() => setMode('past'), 3000);
      else if (mode === 'past') { setPlaying(false); }
    }
    return () => clearTimeout(t);
  }, [playing, mode]);

  // Slider animation during transition
  useEffect(() => {
    if (mode === 'transition') {
      const iv = setInterval(() => setSliderValue((v) => {
        if (v <= 0) { clearInterval(iv); return 0; }
        return v - 2;
      }), 60);
      return () => clearInterval(iv);
    }
    if (mode === 'today') setSliderValue(100);
    if (mode === 'past') setSliderValue(0);
  }, [mode]);

  if (!site) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone-400 mb-4">Site not found</p>
          <Link to="/explore"><Button variant="gold">Explore Heritage</Button></Link>
        </div>
      </div>
    );
  }

  const storyCards = [
    { emoji: '🏗️', title: 'Who Built It?', content: `${site.builder || 'Unknown builders'} — ${site.dynasty || 'ancient craftsmen'}.` },
    { emoji: '📅', title: 'When?', content: site.construction_date || site.historical_period },
    { emoji: '🪨', title: 'How Was It Built?', content: 'Interlocking granite blocks without mortar, using ramps and rollers. No modern machinery.' },
    { emoji: '⚔️', title: 'What Happened Here?', content: (language === 'ta' ? site.history_ta : site.history_en).slice(0, 200) + '...' },
    { emoji: '🔄', title: 'What Has Changed?', content: site.current_condition },
    { emoji: '💾', title: 'Digital Preservation', content: 'HeritageLens documents this site with photogrammetry, 3D scanning and expert verification.' },
  ];

  return (
    <div className="min-h-screen bg-stone-950 overflow-x-hidden">
      {/* Back button */}
      <div className="fixed top-4 left-4 z-30">
        <Link
          to={`/heritage/${site.slug}`}
          className="flex items-center gap-2 px-3 py-2 rounded-xl glass text-stone-300 hover:text-stone-100 text-sm transition-all"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
      </div>

      {/* Mode indicator */}
      <div className="fixed top-4 right-4 z-30">
        <div className="glass-gold rounded-xl px-4 py-2">
          <p className="text-yellow-400 text-xs font-bold uppercase tracking-wider">
            {mode === 'today' ? '📅 Present Day' : mode === 'transition' ? '⏳ Traveling Back...' : `🏛️ ${photos?.era || site.construction_date}`}
          </p>
        </div>
      </div>

      {/* ── HERO: Full-screen cinematic view ── */}
      <div className="relative h-screen overflow-hidden">
        {/* Present-day image */}
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: mode === 'past' ? 0 : 1 }}
          transition={{ duration: 2.5, ease: 'easeInOut' }}
        >
          <img
            src={site.featured_image}
            alt={`${name} — Present Day`}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1590169786462-7d54566b25b1?w=1280&q=80'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/30 via-transparent to-stone-950" />
        </motion.div>

        {/* Historical image (fades in) */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: mode === 'past' ? 1 : mode === 'transition' ? (100 - sliderValue) / 100 : 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        >
          <img
            src={site.past_image || (photos?.pastPhotos[0]?.url) || site.featured_image}
            alt={`${name} — Historical`}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1590169786462-7d54566b25b1?w=1280&q=80'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/40 via-amber-950/10 to-stone-950" />
          {/* Sepia/warm overlay for "past" feel */}
          <div
            className="absolute inset-0 mix-blend-color"
            style={{
              background: 'linear-gradient(135deg, rgba(180,120,40,0.3), rgba(120,80,20,0.2))',
              opacity: mode === 'past' ? 0.6 : 0,
              transition: 'opacity 1.5s ease',
            }}
          />
        </motion.div>

        {/* Vertical split line during transition */}
        <AnimatePresence>
          {mode === 'transition' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none"
            >
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-yellow-400/80 shadow-[0_0_20px_4px_rgba(251,191,36,0.5)]"
                style={{ left: `${sliderValue}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 glass-gold rounded-full w-8 h-8 flex items-center justify-center"
                style={{ left: `${sliderValue}%` }}
              >
                <SplitSquareHorizontal className="h-4 w-4 text-yellow-400" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero text overlay */}
        <AnimatePresence mode="wait">
          {mode === 'today' && (
            <motion.div
              key="today-text"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
              className="absolute bottom-40 left-0 right-0 text-center px-6"
            >
              <p className="text-stone-400 text-sm uppercase tracking-[0.3em] mb-3 font-semibold">Present Day</p>
              <h1 className="font-serif text-4xl md:text-6xl text-stone-100 leading-tight drop-shadow-lg">{name}</h1>
              <div className="flex items-center justify-center gap-4 mt-4 text-stone-400 text-sm">
                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-yellow-600" />{site.location_name}</span>
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-yellow-600" />{site.historical_period}</span>
                {site.builder && <span className="flex items-center gap-1.5"><User className="h-4 w-4 text-yellow-600" />{site.builder}</span>}
              </div>
            </motion.div>
          )}

          {mode === 'transition' && (
            <motion.div
              key="transition-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-40 left-0 right-0 text-center px-6"
            >
              <p className="font-serif text-3xl md:text-5xl text-yellow-400 drop-shadow-lg">
                Traveling back in time...
              </p>
              <p className="text-stone-400 text-sm mt-3 tracking-widest uppercase">
                {site.historical_period}
              </p>
            </motion.div>
          )}

          {mode === 'past' && (
            <motion.div
              key="past-text"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute bottom-40 left-0 right-0 text-center px-6"
            >
              <p className="text-amber-500/80 text-sm uppercase tracking-[0.3em] mb-3 font-semibold">
                {photos?.era || site.construction_date}
              </p>
              <h1 className="font-serif text-4xl md:text-6xl text-amber-100 leading-tight drop-shadow-lg">{name}</h1>
              <p className="text-amber-300/70 text-sm mt-3">
                As it stood when first built · {site.dynasty}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-3 px-4">
          {/* PAST ←──────→ PRESENT slider */}
          <div className="flex items-center gap-4 glass rounded-full px-5 py-2.5">
            <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">Past</span>
            <input
              type="range" min={0} max={100} value={sliderValue}
              onChange={(e) => {
                const v = Number(e.target.value);
                setSliderValue(v);
                if (v === 100) setMode('today');
                else if (v === 0) setMode('past');
                else setMode('transition');
                setPlaying(false);
              }}
              className="w-36 md:w-52 accent-yellow-500 cursor-pointer"
              aria-label="Time travel slider — drag between Past and Present"
            />
            <span className="text-xs text-blue-400 font-bold uppercase tracking-wider">Present</span>
          </div>

          {/* Mode + play buttons */}
          <div className="flex gap-2 flex-wrap justify-center">
            <button
              onClick={() => { setMode('today'); setPlaying(false); setSliderValue(100); }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${mode === 'today' ? 'bg-blue-500 text-white' : 'glass text-stone-300 hover:text-white'}`}
            >
              📅 Present
            </button>
            <button
              onClick={() => { setMode('past'); setPlaying(false); setSliderValue(0); }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${mode === 'past' ? 'bg-amber-600 text-white' : 'glass text-stone-300 hover:text-white'}`}
            >
              🏛️ Historical
            </button>
            <button
              onClick={() => {
                if (playing) { setPlaying(false); }
                else { setMode('today'); setSliderValue(100); setPlaying(true); }
              }}
              className="flex items-center gap-2 px-5 py-2 rounded-xl glass-gold text-yellow-400 text-xs font-bold"
            >
              {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {playing ? 'Pause' : 'Play Story'}
            </button>
          </div>
        </div>
      </div>

      {/* ── PHOTO COMPARISON SECTION ── */}
      {photos && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
          <div className="mb-8 text-center">
            <Badge variant="gold" className="mb-3">📸 Real Monument Photos</Badge>
            <h2 className="font-serif text-3xl text-stone-100">Then & Now</h2>
            <p className="text-stone-400 text-sm mt-2">Real photographic documentation of {name}</p>
          </div>

          {/* Reconstruction disclaimer */}
          {reconstructions[0] && (
            <div className="mb-8 p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-amber-300 text-sm font-semibold mb-1">
                    Reconstruction Confidence:{' '}
                    <span className={getConfidenceColor(reconstructions[0].confidence_level)}>
                      {getConfidenceLabel(reconstructions[0].confidence_level)}
                    </span>
                  </p>
                  <p className="text-stone-500 text-xs leading-relaxed">{reconstructions[0].evidence_summary}</p>
                  <p className="text-stone-600 text-xs mt-1">
                    ⚠️ Historical photos show the monument as-is. Interpretive reconstructions of the original appearance are labeled separately.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Side-by-side galleries */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PhotoGallery
              photos={photos.presentPhotos}
              label="Present Day"
              accent="blue"
            />
            <PhotoGallery
              photos={photos.pastPhotos}
              label={`Historical — ${photos.era}`}
              accent="amber"
            />
          </div>
        </section>
      )}

      {/* ── STORY CARDS ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-12">
        <h2 className="font-serif text-2xl text-stone-100 mb-6 text-center">The Story Behind the Stone</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {storyCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.09 }}
              className="heritage-card p-5"
            >
              <div className="text-2xl mb-3">{card.emoji}</div>
              <h3 className="text-yellow-400 text-xs font-bold uppercase tracking-wider mb-2">{card.title}</h3>
              <p className="text-stone-300 text-sm leading-relaxed">{card.content}</p>
            </motion.div>
          ))}
        </div>

        {/* ── ARTIFACT GALLERY ── */}
        {artifacts.length > 0 && (
          <div className="mb-10">
            <h2 className="font-serif text-xl text-stone-100 mb-5">Key Artifacts & Elements</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {artifacts.map((art, i) => (
                <motion.div
                  key={art.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="relative rounded-xl overflow-hidden group cursor-pointer"
                  style={{ aspectRatio: '1' }}
                >
                  <img
                    src={art.image_url}
                    alt={language === 'ta' ? art.name_ta : art.name_en}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                    loading="lazy"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1590169786462-7d54566b25b1?w=300&q=80'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-stone-100 text-xs font-semibold leading-tight">
                      {language === 'ta' ? art.name_ta : art.name_en}
                    </p>
                    <p className="text-stone-400 text-[10px]">{art.historical_period}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ── TIMELINE ── */}
        {timelines.length > 0 && (
          <div className="mb-10">
            <h2 className="font-serif text-xl text-stone-100 mb-5">Historical Timeline</h2>
            <div className="relative">
              {/* vertical rule */}
              <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-yellow-500/80 via-yellow-500/30 to-transparent" />
              <div className="space-y-4 pl-12">
                {timelines.map((tl, i) => (
                  <motion.div
                    key={tl.id}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="relative"
                  >
                    <div className="absolute -left-12 top-3 timeline-dot" />
                    <div className="heritage-card p-4">
                      <div className="flex items-center gap-3 mb-1.5">
                        <span className="text-yellow-400 font-bold text-sm flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />{tl.year_label}
                        </span>
                        <div className="h-px flex-1 gold-line" />
                      </div>
                      <h3 className="font-serif text-stone-100 text-sm font-semibold mb-1">
                        {language === 'ta' ? tl.title_ta : tl.title_en}
                      </h3>
                      <p className="text-stone-400 text-xs leading-relaxed">
                        {language === 'ta' ? tl.description_ta : tl.description_en}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {site.ar_available && (
            <Link to={`/ar?site=${site.id}`}>
              <Button variant="gold" size="lg" icon={<Eye className="h-4 w-4" />}>
                Explore in AR / 3D
              </Button>
            </Link>
          )}
          <Link to={`/heritage/${site.slug}`}>
            <Button variant="ghost" size="lg" iconRight={<ArrowRight className="h-4 w-4" />}>
              Full Heritage Profile
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
