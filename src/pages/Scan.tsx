import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Loader2, CheckCircle, MapPin, Clock, Cpu, ChevronRight, AlertCircle, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { DEMO_SITES } from '../data/demo/heritage-sites';
import { identifyHeritage, recognizeFromDemoImage, PROCESSING_STAGES } from '../services/ai/heritageRecognition';
import { useAppStore } from '../store/appStore';
import type { RecognitionResult } from '../types';
import MonumentCamera from "../components/heritage/MonumentCamera";

type ScanState = 'idle' | 'processing' | 'result' | 'error';

export default function Scan() {
  const { language } = useAppStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<ScanState>('idle');
  const [result, setResult] = useState<RecognitionResult | null>(null);
  const [stage, setStage] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runRecognition = async (data: string | File) => {
    setState('processing'); setStage(0);
    for (let i = 0; i < PROCESSING_STAGES.length; i++) { setStage(i); await new Promise((r) => setTimeout(r, PROCESSING_STAGES[i].duration)); }
    try {
      const res = await identifyHeritage(data);
      if (res) { setResult(res); setState('result'); }
      else { setError('No heritage match found. Try moving closer or use a clearer image.'); setState('error'); }
    } catch { setError('Recognition failed. Please try again.'); setState('error'); }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Please upload an image file.'); setState('error'); return; }
    setPreviewUrl(URL.createObjectURL(file)); runRecognition(file);
  };

  const handleDemo = async (siteId: string) => {
    const site = DEMO_SITES.find((s) => s.id === siteId); if (!site) return;
    setPreviewUrl(site.featured_image); setState('processing'); setStage(0);
    for (let i = 0; i < PROCESSING_STAGES.length; i++) { setStage(i); await new Promise((r) => setTimeout(r, PROCESSING_STAGES[i].duration)); }
    const res = await recognizeFromDemoImage(siteId);
    if (res) { setResult(res); setState('result'); }
  };

  const reset = () => { setState('idle'); setResult(null); setPreviewUrl(null); setError(null); setStage(0); if (fileRef.current) fileRef.current.value = ''; };
  const matchedSite = result ? DEMO_SITES.find((s) => s.id === result.siteId) : null;

  return (
    <div className="min-h-screen pt-16 pb-24">
      <div className="bg-gradient-to-b from-stone-900 to-transparent py-8 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-yellow-500 text-xs font-bold tracking-[0.2em] uppercase mb-2">AI Recognition</p>
          <h1 className="font-serif text-3xl md:text-4xl text-stone-100 mb-2">{language === 'ta' ? 'பாரம்பரிய தளத்தை ஸ்கேன் செய்யுங்கள்' : 'Scan Heritage Site'}</h1>
          <p className="text-stone-400 text-sm">{language === 'ta' ? 'உங்கள் கேமராவை கோயில் அல்லது நினைவுச்சின்னத்தை நோக்கி வைக்கவும்' : 'Point your camera at a heritage site to identify it'}</p>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <AnimatePresence mode="wait">
          {state === 'idle' && (
            <motion.div key="idle" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
              <div className="relative rounded-2xl bg-stone-900/80 border border-stone-700 overflow-hidden" style={{ paddingTop: '70%' }}>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                  <div className="relative w-56 h-40 scan-overlay flex items-center justify-center mb-6">
                    <div className="absolute left-0 right-0 h-0.5 bg-yellow-500/60" style={{ top: '50%', animation: 'scanLine 2s linear infinite' }} />
                    <Camera className="h-12 w-12 text-stone-700" />
                  </div>
                  <p className="text-stone-300 text-base font-semibold mb-1">{language === 'ta' ? 'பாரம்பரிய தளத்தை நோக்கவும்' : 'Point at a heritage site'}</p>
                  <p className="text-stone-600 text-sm text-center mb-6">Camera permission requested on capture</p>
                  <Button variant="gold" className="w-full sm:w-auto" icon={<Camera className="h-4 w-4" />} onClick={() => fileRef.current?.click()}>{language === 'ta' ? 'படம் பதிவேற்றுங்கள்' : 'Upload Image'}</Button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} aria-label="Upload heritage image" />
                </div>
              </div>
              <div className="heritage-card p-4">
                <div className="flex items-center gap-2 mb-3"><Badge variant="gold">Demo Mode</Badge><p className="text-stone-400 text-xs">Try recognizing these demo images</p></div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {DEMO_SITES.filter((s) => s.ar_available).map((site) => (
                    <button key={site.id} onClick={() => handleDemo(site.id)} className="group relative rounded-xl overflow-hidden h-24 border border-stone-700 hover:border-yellow-500/50 transition-all">
                      <img src={site.featured_image} alt={site.name_en} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1590169786462-7d54566b25b1?w=200&q=80'; }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <p className="absolute bottom-1.5 left-2 right-2 text-xs text-stone-200 font-medium leading-tight">{site.name_en.split(',')[0]}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/40"><p className="text-stone-500 text-xs"><strong className="text-stone-400">Architecture:</strong> Camera → Image Recognition → Heritage DB → Result. Demo uses predefined mappings. Connect a real CV model via VITE_AI_API_URL.</p></div>
            </motion.div>
          )}

          {state === 'processing' && (
            <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-12">
              {previewUrl && (
                <div className="relative w-56 h-40 mx-auto mb-6 rounded-xl overflow-hidden">
                  <img src={previewUrl} alt="Analyzing" className="w-full h-full object-cover opacity-50" />
                  <div className="absolute inset-0 border-2 border-yellow-500/60 rounded-xl animate-pulse" />
                  <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="h-8 w-8 text-yellow-400 animate-spin" /></div>
                </div>
              )}
              <div className="space-y-3 max-w-xs mx-auto">
                {PROCESSING_STAGES.map((s, i) => (
                  <div key={s.id} className={`flex items-center gap-3 transition-all ${i <= stage ? 'opacity-100' : 'opacity-30'}`}>
                    {i < stage ? <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" /> : i === stage ? <Loader2 className="h-4 w-4 text-yellow-400 animate-spin flex-shrink-0" /> : <div className="w-4 h-4 rounded-full border border-stone-700 flex-shrink-0" />}
                    <span className={`text-sm ${i === stage ? 'text-yellow-400' : i < stage ? 'text-stone-400' : 'text-stone-700'}`}>{s.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {state === 'result' && result && matchedSite && (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="heritage-card overflow-hidden">
                <div className="relative h-48">
                  <img src={matchedSite.featured_image} alt={matchedSite.name_en} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1590169786462-7d54566b25b1?w=600&q=80'; }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute top-3 left-3"><Badge variant="gold">Possible Match</Badge></div>
                  {result.isDemo && <div className="absolute top-3 right-3"><Badge variant="stone">Demo Recognition</Badge></div>}
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center justify-between">
                      <h2 className="font-serif text-stone-100 text-lg font-semibold">{matchedSite.name_en}</h2>
                      <div className="text-right"><div className="text-emerald-400 font-bold text-xl">{result.confidence}%</div><div className="text-stone-400 text-xs">confidence</div></div>
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-stone-400"><MapPin className="h-4 w-4 text-yellow-600" />{matchedSite.location_name}</div>
                    <div className="flex items-center gap-2 text-stone-400"><Clock className="h-4 w-4 text-yellow-600" />{matchedSite.historical_period}</div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Link to={`/heritage/${matchedSite.slug}`} className="flex-1"><Button variant="gold" className="w-full" icon={<ChevronRight className="h-4 w-4" />}>View Heritage</Button></Link>
                    <Link to={`/see-the-past/${matchedSite.slug}`}><Button variant="ghost" icon={<Clock className="h-4 w-4" />}>Past</Button></Link>
                    {matchedSite.ar_available && <Link to={`/ar?site=${matchedSite.id}`}><Button variant="ghost" icon={<Cpu className="h-4 w-4" />}>AR</Button></Link>}
                  </div>
                </div>
              </div>
              <Button variant="ghost" className="w-full" onClick={reset} icon={<X className="h-4 w-4" />}>Scan Another</Button>
            </motion.div>
          )}

          {state === 'error' && (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h3 className="font-serif text-stone-100 text-xl mb-2">No Match Found</h3>
              <p className="text-stone-400 text-sm mb-2">{error}</p>
              <p className="text-stone-600 text-xs mb-6">Try moving closer or use a clearer image.</p>
              <Button variant="gold" onClick={reset} icon={<Camera className="h-4 w-4" />}>Try Again</Button>
            </motion.div>
          )}
          <MonumentCamera
  onCapture={(image) => {
    // The next step sends this File to your AI recognition API.
    console.log("Captured image:", image.name, image.size);
  }}
/>
        </AnimatePresence>
      </div>
    </div>
  );
}
