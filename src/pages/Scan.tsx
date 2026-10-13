
/**
 * HeritageLens — Scan Page
 *
 * Flow:
 * idle → camera/upload/demo
 * processing → recognition pipeline
 * result → monument details
 * error → error message and retry
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import {
  CheckCircle,
  MapPin,
  Clock,
  ChevronRight,
  AlertCircle,
  X,
  Info,
  Star,
  Cpu,
  Camera,
  Upload,
} from 'lucide-react';

import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import MonumentCamera from '../components/heritage/MonumentCamera';
import { DEMO_SITES } from '../data/demo/heritage-sites';

import {
  identifyHeritage,
  recognizeFromDemoImage,
  PROCESSING_STAGES,
} from '../services/ai/heritageRecognition';

import { useAppStore } from '../store/appStore';
import type { RecognitionResult } from '../types';

type PageState = 'idle' | 'processing' | 'result' | 'error';

export default function Scan() {
  const { language } = useAppStore();

  const [pageState, setPageState] = useState<PageState>('idle');
  const [result, setResult] = useState<RecognitionResult | null>(null);
  const [stage, setStage] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Run the heritage recognition pipeline.
  const runRecognition = async (imageData: File | Blob | string) => {
    setPageState('processing');
    setStage(0);
    setResult(null);
    setError(null);

    try {
      for (let i = 0; i < PROCESSING_STAGES.length; i++) {
        setStage(i);

        await new Promise<void>((resolve) => {
          window.setTimeout(
            resolve,
            PROCESSING_STAGES[i].duration,
          );
        });
      }

      const response = await identifyHeritage(imageData);

      if (response && response.is_heritage_site !== false) {
        setResult(response);
        setPageState('result');
      } else if (response?.is_heritage_site === false) {
        setError(
          'No heritage monument was detected. Try photographing a temple, fort, or historical structure.',
        );
        setPageState('error');
      } else {
        setError(
          'No heritage match was found. Try moving closer or uploading a clearer image.',
        );
        setPageState('error');
      }
    } catch (err) {
      console.error('Heritage recognition failed:', err);

      setError(
        'The recognition service is unavailable. Check your backend connection and try again.',
      );
      setPageState('error');
    }
  };

  // Handle a captured camera image.
  const handleCapture = (image: File) => {
    setPreviewUrl(URL.createObjectURL(image));
    void runRecognition(image);
  };

  // Handle image uploads.
  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.currentTarget.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      setPageState('error');
      event.currentTarget.value = '';
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
    void runRecognition(file);

    // Allow the same image to be selected again.
    event.currentTarget.value = '';
  };

  // Run a demo monument scan.
  const handleDemo = async (siteId: string) => {
    const site = DEMO_SITES.find((item) => item.id === siteId);

    if (!site) {
      setError('The selected demo monument could not be found.');
      setPageState('error');
      return;
    }

    setPreviewUrl(site.featured_image);
    setPageState('processing');
    setStage(0);
    setResult(null);
    setError(null);

    try {
      for (let i = 0; i < PROCESSING_STAGES.length; i++) {
        setStage(i);

        await new Promise<void>((resolve) => {
          window.setTimeout(
            resolve,
            PROCESSING_STAGES[i].duration,
          );
        });
      }

      const response = await recognizeFromDemoImage(siteId);

      if (response) {
        setResult(response);
        setPageState('result');
      } else {
        setError('No demo result was returned. Please try again.');
        setPageState('error');
      }
    } catch (err) {
      console.error('Demo recognition failed:', err);

      setError('Unable to load the demo result. Please try again.');
      setPageState('error');
    }
  };

  // Release preview URLs and reset the page.
  const reset = () => {
    if (previewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    setPageState('idle');
    setResult(null);
    setPreviewUrl(null);
    setError(null);
    setStage(0);
  };

  // Find local information for a recognized monument.
  const matchedSite = result?.siteId
    ? DEMO_SITES.find((site) => site.id === result.siteId)
    : null;

  return (
    <div className="min-h-screen pt-16 pb-28">
      {/* Header */}
      <div className="bg-gradient-to-b from-stone-900 to-transparent py-8 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-yellow-500 text-xs font-bold tracking-[0.2em] uppercase mb-2">
            AI Recognition
          </p>

          <h1 className="font-serif text-3xl md:text-4xl text-stone-100 mb-2">
            {language === 'ta'
              ? 'பாரம்பரிய தளத்தை ஸ்கேன் செய்யுங்கள்'
              : 'Scan Heritage Site'}
          </h1>

          <p className="text-stone-400 text-sm">
            {language === 'ta'
              ? 'உங்கள் கேமராவை கோயில் அல்லது நினைவுச்சின்னத்தை நோக்கி வைக்கவும்'
              : 'Use your camera or upload a photo to identify a heritage monument.'}
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <AnimatePresence mode="wait">
          {/* IDLE: Camera, upload and demo */}
          {pageState === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Camera */}
              <div className="heritage-card p-4 space-y-3">
                <div>
                  <h2 className="text-stone-100 font-semibold text-lg">
                    Scan a Heritage Monument
                  </h2>

                  <p className="text-stone-400 text-sm mt-1">
                    Open your camera, point it at a monument, and capture
                    an image.
                  </p>
                </div>

                <MonumentCamera onCapture={handleCapture} />
              </div>

              {/* Upload */}
              <div className="heritage-card p-4">
                <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-stone-700 text-stone-300 hover:text-white hover:bg-stone-800/50 cursor-pointer transition-colors">
                  <Upload className="h-4 w-4" />

                  <span>Upload a monument image</span>

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>

              {/* Demo monuments */}
              <div className="heritage-card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="gold">Demo Scan</Badge>

                  <p className="text-stone-400 text-xs">
                    Try the sample monuments.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {DEMO_SITES.filter(
                    (site) => site.ar_available,
                  ).map((site) => (
                    <button
                      key={site.id}
                      type="button"
                      onClick={() => void handleDemo(site.id)}
                      className="group relative rounded-xl overflow-hidden h-24 border border-stone-700 hover:border-yellow-500/50 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500"
                      aria-label={`Demo scan ${site.name_en}`}
                    >
                      <img
                        src={site.featured_image}
                        alt={site.name_en}
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.style.opacity = '0.2';
                        }}
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />

                      <p className="absolute bottom-1.5 left-2 right-2 text-xs text-stone-100 font-medium text-left leading-tight">
                        {site.name_en.split(',')[0]}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Architecture information */}
              <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/40">
                <p className="text-stone-500 text-xs leading-relaxed">
                  <strong className="text-stone-400">
                    How it works:
                  </strong>{' '}
                  Your image is passed to the heritage recognition service.
                  The service identifies the monument and returns historical
                  information. Live recognition requires a working backend
                  and valid AI credentials.
                </p>
              </div>
            </motion.div>
          )}

          {/* PROCESSING */}
          {pageState === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              {previewUrl && (
                <div className="relative w-56 h-40 mx-auto mb-6 rounded-xl overflow-hidden">
                  <img
                    src={previewUrl}
                    alt="Monument being analysed"
                    className="w-full h-full object-cover opacity-50"
                  />

                  <div className="absolute inset-0 border-2 border-yellow-500/60 rounded-xl animate-pulse" />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border-2 border-yellow-500/30 border-t-yellow-500 animate-spin" />
                  </div>
                </div>
              )}

              <h2 className="text-stone-100 font-semibold text-lg mb-6">
                Identifying Monument
              </h2>

              <div className="space-y-3 max-w-xs mx-auto text-left">
                {PROCESSING_STAGES.map((item, index) => (
                  <div
                    key={item.id}
                    className={`flex items-center gap-3 transition-all ${
                      index <= stage ? 'opacity-100' : 'opacity-30'
                    }`}
                  >
                    {index < stage ? (
                      <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    ) : index === stage ? (
                      <div className="w-4 h-4 rounded-full border-2 border-yellow-500/30 border-t-yellow-500 animate-spin flex-shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-stone-700 flex-shrink-0" />
                    )}

                    <span
                      className={`text-sm ${
                        index === stage
                          ? 'text-yellow-400'
                          : index < stage
                            ? 'text-stone-400'
                            : 'text-stone-700'
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* RESULT */}
          {pageState === 'result' && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="heritage-card overflow-hidden">
                {/* Monument image */}
                <div className="relative h-52">
                  <img
                    src={
                      matchedSite?.featured_image ??
                      previewUrl ??
                      ''
                    }
                    alt={result.siteName}
                    className="w-full h-full object-cover"
                    onError={(event) => {
                      event.currentTarget.style.opacity = '0.2';
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                  <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                    <Badge variant="gold">
                      {result.is_heritage_site
                        ? '🏛️ Heritage Identified'
                        : '⚠️ Uncertain'}
                    </Badge>

                    {result.isDemo && (
                      <Badge variant="stone">Demo</Badge>
                    )}

                    {matchedSite?.is_unesco && (
                      <Badge variant="unesco">UNESCO</Badge>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-end justify-between gap-2">
                      <h2 className="font-serif text-stone-100 text-xl font-semibold leading-tight">
                        {result.siteName}
                      </h2>

                      <div className="flex-shrink-0 text-right">
                        <div
                          className={`font-bold text-2xl ${
                            result.confidence >= 80
                              ? 'text-emerald-400'
                              : result.confidence >= 60
                                ? 'text-yellow-400'
                                : 'text-orange-400'
                          }`}
                        >
                          {result.confidence}%
                        </div>

                        <div className="text-stone-400 text-xs">
                          confidence
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Monument details */}
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    {result.location && (
                      <div className="flex items-start gap-2 text-stone-400">
                        <MapPin className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <span>{result.location}</span>
                      </div>
                    )}

                    {result.period && (
                      <div className="flex items-start gap-2 text-stone-400">
                        <Clock className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <span>{result.period}</span>
                      </div>
                    )}

                    {result.architectural_style && (
                      <div className="flex items-start gap-2 text-stone-400">
                        <Info className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <span>{result.architectural_style}</span>
                      </div>
                    )}

                    {result.builder && (
                      <div className="flex items-start gap-2 text-stone-400">
                        <Cpu className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <span>{result.builder}</span>
                      </div>
                    )}
                  </div>

                  {/* Overview */}
                  {result.overview && (
                    <p className="text-stone-300 text-sm leading-relaxed border-t border-stone-800 pt-3">
                      {result.overview}
                    </p>
                  )}

                  {/* Notable facts */}
                  {(result.notable_facts?.length ?? 0) > 0 && (
                    <div className="border-t border-stone-800 pt-3">
                      <p className="text-stone-500 text-xs font-semibold uppercase tracking-wider mb-2">
                        Notable Facts
                      </p>

                      <ul className="space-y-2">
                        {result.notable_facts!.map((fact, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-stone-300 text-sm"
                          >
                            <Star className="h-3.5 w-3.5 text-yellow-500 flex-shrink-0 mt-0.5" />
                            <span>{fact}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex gap-2 pt-1 flex-wrap">
                    {matchedSite ? (
                      <>
                        <Link
                          to={`/heritage/${matchedSite.slug}`}
                          className="flex-1 min-w-[120px]"
                        >
                          <Button
                            variant="gold"
                            className="w-full"
                            icon={<ChevronRight className="h-4 w-4" />}
                          >
                            Full History
                          </Button>
                        </Link>

                        <Link to={`/see-the-past/${matchedSite.slug}`}>
                          <Button
                            variant="ghost"
                            icon={<Clock className="h-4 w-4" />}
                          >
                            Past
                          </Button>
                        </Link>

                        <Link to={`/ar?site=${matchedSite.id}`}>
                          <Button
                            variant="ghost"
                            icon={<Cpu className="h-4 w-4" />}
                          >
                            3D
                          </Button>
                        </Link>
                      </>
                    ) : (
                      <Link to="/chat" className="flex-1">
                        <Button
                          variant="gold"
                          className="w-full"
                          icon={<ChevronRight className="h-4 w-4" />}
                        >
                          Ask AI Guide
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                className="w-full"
                onClick={reset}
                icon={<X className="h-4 w-4" />}
              >
                Scan Another Monument
              </Button>
            </motion.div>
          )}

          {/* ERROR */}
          {pageState === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-7 w-7 text-red-400" />
              </div>

              <h3 className="font-serif text-stone-100 text-xl mb-2">
                Identification Failed
              </h3>

              <p className="text-stone-400 text-sm mb-2">
                {error}
              </p>

              <p className="text-stone-600 text-xs mb-6">
                For best results, use good lighting and keep the monument
                clearly visible in the image.
              </p>

              <div className="flex gap-3 justify-center flex-wrap">
                <Button
                  variant="gold"
                  onClick={reset}
                  icon={<Camera className="h-4 w-4" />}
                >
                  Try Again
                </Button>

                <Button
                  variant="ghost"
                  onClick={reset}
                  icon={<X className="h-4 w-4" />}
                >
                  Reset
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
