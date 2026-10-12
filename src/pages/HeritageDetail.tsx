import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, User, Building, Heart, Share2, Volume2, Clock, CheckCircle, Info, ExternalLink, BookOpen, Camera, ArrowLeft, Cpu, Box } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { AIHeritageGuide } from '../components/heritage/AIHeritageGuide';
import { QuizSection } from '../components/quiz/QuizSection';
import { getSiteBySlug, getTimelinesForSite, getArtifactsForSite, getStoriesForSite, getQuizzesForSite, getNearbyForSite, getSourcesForSite, getReconstructionsForSite } from '../data/demo/heritage-sites';
import { useAppStore } from '../store/appStore';
import { speechService } from '../services/speech/speechService';
import { getPreservationColor, getPreservationLabel, getVerificationLabel, getConfidenceColor, getConfidenceLabel } from '../utils/helpers';
import toast from 'react-hot-toast';

const TABS = ['Overview', 'Timeline', 'Artifacts', 'Stories', 'Nearby', 'Sources'];

export default function HeritageDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { language, isFavorite, addFavorite, removeFavorite, addVisit } = useAppStore();
  const navigate = useNavigate();
  const site = slug ? getSiteBySlug(slug) : null;
  const [activeTab, setActiveTab] = useState('Overview');
  const [guideOpen, setGuideOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => { if (site) { addVisit(site.id); window.scrollTo({ top: 0 }); } }, [site?.id]);

  if (!site) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center"><div className="text-5xl mb-4">🏛️</div><h2 className="font-serif text-2xl text-stone-300 mb-2">Heritage site not found</h2><p className="text-stone-500 mb-6">This site isn't in our demo database.</p><Link to="/explore"><Button variant="gold">Explore Heritage</Button></Link></div>
    </div>
  );

  const name = language === 'ta' ? site.name_ta : site.name_en;
  const description = language === 'ta' ? site.description_ta : site.description_en;
  const history = language === 'ta' ? site.history_ta : site.history_en;
  const timelines = getTimelinesForSite(site.id);
  const artifacts = getArtifactsForSite(site.id);
  const stories = getStoriesForSite(site.id);
  const quizzes = getQuizzesForSite(site.id);
  const nearby = getNearbyForSite(site.id);
  const sources = getSourcesForSite(site.id);
  const reconstructions = getReconstructionsForSite(site.id);
  const fav = isFavorite(site.id);

  const handleListen = () => {
    if (speaking) { speechService.stop(); setSpeaking(false); }
    else { speechService.speak(`${name}. ${description}. ${history}`, { lang: language === 'ta' ? 'ta-IN' : 'en-IN', rate: 0.9 }); setSpeaking(true); toast.success('Playing audio narration...'); }
  };
  const handleShare = () => {
    if (navigator.share) navigator.share({ title: name, url: window.location.href });
    else { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="fixed top-20 left-4 z-30">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-3 py-2 rounded-xl glass text-stone-300 hover:text-stone-100 text-sm transition-all" aria-label="Go back"><ArrowLeft className="h-4 w-4" /><span className="hidden sm:inline">Back</span></button>
      </div>
      {/* Hero */}
      <div className="relative h-[60vh] overflow-hidden">
        <img src={site.featured_image} alt={name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1590169786462-7d54566b25b1?w=1280&q=80'; }} />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/60 to-transparent" />
        <div className="absolute top-6 right-6 flex gap-2 flex-wrap justify-end">
          {site.is_unesco && <Badge variant="unesco">UNESCO World Heritage</Badge>}
          {site.ar_available && <Badge variant="ar"><Cpu className="h-2.5 w-2.5" />AR Available</Badge>}
          {site.model_available && <Badge variant="3d"><Box className="h-2.5 w-2.5" />3D Model</Badge>}
        </div>
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 pb-8 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-yellow-500 text-xs font-bold tracking-[0.2em] uppercase mb-2">{site.heritage_type.replace('_', ' ')} · {site.historical_period}</p>
            <h1 className="font-serif text-3xl md:text-5xl text-stone-100 mb-3 leading-tight">{name}</h1>
            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1.5 text-stone-300 text-sm"><MapPin className="h-4 w-4 text-yellow-600" />{site.location_name}</span>
              {site.builder && <span className="flex items-center gap-1.5 text-stone-400 text-sm"><User className="h-4 w-4" />{site.builder}</span>}
              {site.dynasty && <span className="flex items-center gap-1.5 text-stone-400 text-sm"><Building className="h-4 w-4" />{site.dynasty}</span>}
              <span className={`text-sm font-semibold ${getPreservationColor(site.preservation_status)}`}>● {getPreservationLabel(site.preservation_status, language)}</span>
            </div>
          </motion.div>
        </div>
      </div>
      {/* Action bar */}
      <div className="sticky top-16 z-20 bg-stone-950/90 backdrop-blur-xl border-b border-stone-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 overflow-x-auto">
          {site.ar_available && <Link to={`/ar?site=${site.id}`}><Button variant="gold" size="sm" icon={<Cpu className="h-3.5 w-3.5" />}>Explore in AR</Button></Link>}
          <Link to={`/see-the-past/${site.slug}`}><Button variant="ghost" size="sm" icon={<Clock className="h-3.5 w-3.5" />}>See the Past</Button></Link>
          <Button variant="ghost" size="sm" icon={<Volume2 className={`h-3.5 w-3.5 ${speaking ? 'text-yellow-400' : ''}`} />} onClick={handleListen}>{speaking ? 'Stop' : 'Listen'}</Button>
          <Button variant="ghost" size="sm" icon={<Heart className={`h-3.5 w-3.5 ${fav ? 'fill-yellow-400 text-yellow-400' : ''}`} />} onClick={() => { fav ? removeFavorite(site.id) : addFavorite(site.id); toast.success(fav ? 'Removed' : 'Saved!'); }}>{fav ? 'Saved' : 'Save'}</Button>
          <Button variant="ghost" size="sm" icon={<Share2 className="h-3.5 w-3.5" />} onClick={handleShare}>Share</Button>
          <Button variant="ghost" size="sm" icon={<BookOpen className="h-3.5 w-3.5 text-yellow-400" />} onClick={() => setGuideOpen(true)}>Ask AI Guide</Button>
          {quizzes.length > 0 && <Button variant="ghost" size="sm" icon={<CheckCircle className="h-3.5 w-3.5" />} onClick={() => setQuizOpen(true)}>Take Quiz</Button>}
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto mb-8 pb-1">
          {TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30' : 'text-stone-500 hover:text-stone-300 hover:bg-white/5'}`}>{tab}</button>
          ))}
        </div>

        {/* OVERVIEW */}
        {activeTab === 'Overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="heritage-card p-6"><h2 className="font-serif text-xl text-stone-100 mb-4">Overview</h2><p className="text-stone-300 leading-relaxed">{description}</p></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[{ label: 'Built By', value: site.builder || 'Unknown', icon: User }, { label: 'Dynasty', value: site.dynasty || 'N/A', icon: Building }, { label: 'Period', value: site.construction_date || site.historical_period, icon: Calendar }, { label: 'Location', value: site.location_name, icon: MapPin }].map(({ label, value, icon: Icon }) => (
                <div key={label} className="heritage-card p-4"><Icon className="h-4 w-4 text-yellow-600 mb-2" /><p className="text-stone-500 text-xs mb-1">{label}</p><p className="text-stone-200 text-sm font-semibold leading-tight">{value}</p></div>
              ))}
            </div>
            <div className="heritage-card p-6"><h2 className="font-serif text-xl text-stone-100 mb-4">Historical Background</h2><div className="text-stone-300 leading-relaxed whitespace-pre-line text-sm">{history}</div></div>
            {reconstructions.length > 0 && (
              <div className="heritage-card p-6">
                <div className="flex items-center justify-between mb-4"><h2 className="font-serif text-xl text-stone-100">Historical Reconstruction</h2><Link to={`/see-the-past/${site.slug}`}><Button variant="ghost" size="sm" icon={<Clock className="h-3.5 w-3.5" />}>See the Past</Button></Link></div>
                {reconstructions.map((rec) => (
                  <div key={rec.id} className="p-4 bg-stone-900/50 rounded-xl border border-stone-800">
                    <div className="flex items-start justify-between mb-3"><div><h3 className="text-stone-200 font-semibold text-sm">{rec.title}</h3><p className="text-stone-500 text-xs mt-0.5">Period: {rec.period}</p></div><span className={`text-xs font-semibold ${getConfidenceColor(rec.confidence_level)}`}>{getConfidenceLabel(rec.confidence_level)}</span></div>
                    <p className="text-stone-400 text-xs leading-relaxed mb-3">{rec.evidence_summary}</p>
                    <div className="flex items-center gap-1.5 text-xs text-stone-600"><Info className="h-3 w-3" /><span>Method: {rec.method}</span></div>
                    <div className="mt-3 p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/15"><p className="text-amber-600 text-xs">⚠️ Interpretive digital reconstruction based on available historical evidence. Not a confirmed historical record.</p></div>
                  </div>
                ))}
              </div>
            )}
            <div className="heritage-card p-6">
              <h2 className="font-serif text-xl text-stone-100 mb-4">Preservation & Condition</h2>
              <div className="flex items-center gap-3 mb-3"><span className={`text-base font-bold ${getPreservationColor(site.preservation_status)}`}>● {getPreservationLabel(site.preservation_status, language)}</span><Badge variant="gold">{getVerificationLabel(site.verification_status, language)}</Badge></div>
              <p className="text-stone-400 text-sm">{site.current_condition}</p>
            </div>
          </motion.div>
        )}

        {/* TIMELINE */}
        {activeTab === 'Timeline' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {timelines.length === 0 ? <div className="text-center py-16 text-stone-600">No timeline data available.</div> : (
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-yellow-500/60 via-yellow-500/30 to-transparent" />
                <div className="space-y-6 pl-10">
                  {timelines.map((tl, i) => (
                    <motion.div key={tl.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="relative">
                      <div className="absolute -left-10 top-1.5 timeline-dot" />
                      <div className="heritage-card p-5">
                        <div className="flex items-center gap-3 mb-2"><span className="text-yellow-400 font-bold text-sm">{tl.year_label}</span><div className="h-px flex-1 gold-line" /></div>
                        <h3 className="font-serif text-stone-100 text-base font-semibold mb-1">{language === 'ta' ? tl.title_ta : tl.title_en}</h3>
                        <p className="text-stone-400 text-sm leading-relaxed">{language === 'ta' ? tl.description_ta : tl.description_en}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ARTIFACTS */}
        {activeTab === 'Artifacts' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {artifacts.length === 0 ? <div className="text-center py-16 text-stone-600">No artifacts documented yet.</div> : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {artifacts.map((art) => (
                  <div key={art.id} className="heritage-card overflow-hidden">
                    <div className="relative h-52 overflow-hidden"><img src={art.image_url} alt={language === 'ta' ? art.name_ta : art.name_en} className="w-full h-full object-cover" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1590169786462-7d54566b25b1?w=600&q=80'; }} /><div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" /></div>
                    <div className="p-4">
                      <h3 className="font-serif text-stone-100 font-semibold mb-1">{language === 'ta' ? art.name_ta : art.name_en}</h3>
                      <p className="text-stone-500 text-xs mb-2 flex items-center gap-1"><Clock className="h-3 w-3" />{art.historical_period}</p>
                      <p className="text-stone-400 text-sm leading-relaxed">{language === 'ta' ? art.description_ta : art.description_en}</p>
                      {art.source_reference && <p className="text-stone-600 text-xs mt-3">📚 {art.source_reference}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* STORIES */}
        {activeTab === 'Stories' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {stories.length === 0 ? <div className="text-center py-16 text-stone-600">No stories available yet.</div> : stories.map((story) => (
              <div key={story.id} className="heritage-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-serif text-stone-100 text-lg font-semibold">{language === 'ta' ? story.title_ta : story.title_en}</h3>
                  <Button variant="ghost" size="sm" icon={<Volume2 className="h-3.5 w-3.5" />} onClick={() => { speechService.speak(language === 'ta' ? story.content_ta : story.content_en, { lang: language === 'ta' ? 'ta-IN' : 'en-IN', rate: 0.9 }); toast.success('Audio started...'); }}>Listen</Button>
                </div>
                <div className="text-stone-300 text-sm leading-relaxed whitespace-pre-line">{language === 'ta' ? story.content_ta : story.content_en}</div>
                {story.author && <p className="text-stone-600 text-xs mt-4">— {story.author}</p>}
                <div className="mt-3 flex items-center gap-2"><Badge variant="green"><CheckCircle className="h-2.5 w-2.5" />{getVerificationLabel(story.verification_status, language)}</Badge></div>
              </div>
            ))}
          </motion.div>
        )}

        {/* NEARBY */}
        {activeTab === 'Nearby' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {nearby.length === 0 ? <div className="text-center py-16 text-stone-600">No nearby places documented.</div> : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nearby.map((place) => (
                  <div key={place.id} className="heritage-card p-4 flex gap-4">
                    {place.image_url ? <img src={place.image_url} alt={place.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1590169786462-7d54566b25b1?w=200&q=80'; }} /> : <div className="w-20 h-20 rounded-xl bg-stone-800 flex items-center justify-center flex-shrink-0"><MapPin className="h-6 w-6 text-stone-600" /></div>}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1"><h3 className="text-stone-200 font-semibold text-sm leading-tight">{place.name}</h3><span className="text-yellow-500 text-xs font-semibold whitespace-nowrap">{place.distance} km</span></div>
                      <p className="text-stone-500 text-xs capitalize mb-1">{place.category}</p>
                      <p className="text-stone-500 text-xs leading-relaxed">{place.description}</p>
                      {place.opening_info && <p className="text-stone-600 text-xs mt-1 italic">{place.opening_info}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* SOURCES */}
        {activeTab === 'Sources' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="mb-4 p-4 rounded-xl bg-stone-900/50 border border-stone-800"><p className="text-stone-400 text-sm"><span className="text-stone-300 font-semibold">Source Transparency:</span> Every historical claim is linked to verifiable sources. Content is labeled by confidence level.</p></div>
            <div className="space-y-3">
              {sources.map((src) => (
                <div key={src.id} className="heritage-card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div><h3 className="text-stone-200 font-semibold text-sm">{src.title}</h3><p className="text-stone-500 text-xs mt-0.5">{src.citation}</p>{src.publisher && <p className="text-stone-600 text-xs mt-0.5">{src.publisher}{src.year && ` · ${src.year}`}</p>}</div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0"><Badge variant="stone">{src.source_type.replace('_', ' ')}</Badge>{src.url && <a href={src.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-yellow-500 hover:text-yellow-400">View <ExternalLink className="h-3 w-3" /></a>}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Contribute CTA */}
        <div className="mt-12 heritage-card p-6 flex flex-col sm:flex-row items-center gap-4 justify-between">
          <div><h3 className="font-serif text-stone-100 text-base font-semibold mb-1">Know something about this site?</h3><p className="text-stone-500 text-sm">Share a story, photograph, or historical detail.</p></div>
          <Link to="/community"><Button variant="gold" size="sm" icon={<Camera className="h-3.5 w-3.5" />}>Contribute</Button></Link>
        </div>
      </div>
      {guideOpen && <AIHeritageGuide siteId={site.id} siteName={name} onClose={() => setGuideOpen(false)} />}
      {quizOpen && quizzes[0] && <QuizSection quiz={quizzes[0]} onClose={() => setQuizOpen(false)} />}
    </div>
  );
}
