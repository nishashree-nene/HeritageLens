/**
 * AR Experience / 3D Explorer Page — Feature D
 *
 * Uses React Three Fiber (Heritage3DViewer) with:
 * - Model registry (GLTF or procedural fallback)
 * - Annotation hotspots
 * - Historic / present toggle
 * - Fullscreen
 * - Site selector
 */

import { useEffect, Suspense } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Info, MapPin, Clock, User, Box, ChevronRight } from 'lucide-react';
import { Button }             from '../components/ui/Button';
import { Badge }              from '../components/ui/Badge';
import { Heritage3DViewer }   from '../components/heritage/Heritage3DViewer';
import { DEMO_SITES, getArtifactsForSite } from '../data/demo/heritage-sites';
import { MODEL_REGISTRY, getModelForSite } from '../data/modelRegistry';
import { useAppStore }        from '../store/appStore';

function Loader() {
  return (
    <div className="flex items-center justify-center h-[480px] rounded-2xl border border-stone-800 bg-stone-950">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-yellow-500/30 border-t-yellow-500 animate-spin" />
        <p className="text-stone-500 text-sm">Loading 3D scene…</p>
      </div>
    </div>
  );
}

export default function ARExperience() {
  const [searchParams] = useSearchParams();
  const siteId = searchParams.get('site') || 'site-001';
  const { language, earnBadge } = useAppStore();

  const site  = DEMO_SITES.find((s) => s.id === siteId) ?? DEMO_SITES[0];
  const entry = getModelForSite(site.id) ?? MODEL_REGISTRY[0];
  const artifacts = getArtifactsForSite(site.id);
  const name  = language === 'ta' ? site.name_ta : site.name_en;

  useEffect(() => { earnBadge('badge-002'); }, []);   // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen pt-16 pb-28 bg-stone-950">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-stone-800">
        <Link to={`/heritage/${site.slug}`} className="flex items-center gap-2 text-stone-400 hover:text-stone-200 text-sm transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-stone-400 text-sm hidden sm:block truncate max-w-[200px]">{name}</span>
          <Badge variant="ar">3D Explorer</Badge>
        </div>
        <Link to={`/see-the-past/${site.slug}`} className="text-yellow-400 hover:text-yellow-300 text-xs font-semibold transition-colors">
          See the Past →
        </Link>
      </div>

      {/* Notice bar */}
      <div className="px-4 py-2 bg-stone-900/60 border-b border-stone-800">
        <p className="text-xs text-stone-500 text-center">
          {entry.modelUrl
            ? `🏛️ GLTF model loaded · ${entry.license ?? 'Licensed for educational use'}`
            : '🔧 Procedural model shown. Drop a real .glb into public/models/ and update modelRegistry.ts.'}
        </p>
      </div>

      {/* 3D Viewer */}
      <div className="px-4 pt-4 pb-2">
        <Suspense fallback={<Loader />}>
          <Heritage3DViewer entry={entry} />
        </Suspense>
      </div>

      {/* Site selector tabs */}
      <div className="px-4 py-3 border-b border-stone-800 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {DEMO_SITES.map((s) => (
            <Link
              key={s.id}
              to={`/ar?site=${s.id}`}
              className={`flex-shrink-0 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                s.id === siteId
                  ? 'bg-yellow-500 text-black'
                  : 'glass text-stone-300 hover:text-stone-100'
              }`}
            >
              {(language === 'ta' ? s.name_ta : s.name_en).split(',')[0]}
            </Link>
          ))}
        </div>
      </div>

      {/* Info + annotations */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Site info card */}
        <div className="heritage-card p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h2 className="font-serif text-stone-100 text-lg">{name}</h2>
            {site.is_unesco && <Badge variant="unesco">UNESCO</Badge>}
          </div>
          <p className="text-stone-400 text-sm leading-relaxed mb-4">
            {language === 'ta' ? site.description_ta : site.description_en}
          </p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-stone-500"><MapPin className="h-4 w-4 text-yellow-600" />{site.location_name}</div>
            <div className="flex items-center gap-2 text-stone-500"><Clock className="h-4 w-4 text-yellow-600" />{site.historical_period}</div>
            {site.builder && <div className="flex items-center gap-2 text-stone-500"><User className="h-4 w-4 text-yellow-600" />{site.builder}</div>}
            <div className="flex items-center gap-2 text-stone-500"><Box className="h-4 w-4 text-yellow-600" />{entry.style}</div>
          </div>
        </div>

        {/* Annotations list */}
        {entry.annotations.length > 0 && (
          <div>
            <h3 className="font-serif text-stone-100 text-base mb-3 flex items-center gap-2">
              <Info className="h-4 w-4 text-yellow-500" />
              Architectural Elements
            </h3>
            <div className="space-y-2">
              {entry.annotations.map((ann) => (
                <motion.div
                  key={ann.id}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex gap-3 p-3 rounded-xl bg-stone-900 border border-stone-800"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="text-yellow-400 text-xs font-bold uppercase tracking-wider mb-0.5">{ann.label}</p>
                    <p className="text-stone-300 text-sm">{ann.note}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Model info */}
        <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/40">
          <p className="text-stone-400 text-xs font-semibold mb-1">3D Model Info</p>
          <p className="text-stone-500 text-xs leading-relaxed">
            {entry.modelUrl
              ? `Source: ${entry.source ?? 'External'} · ${entry.license ?? ''}`
              : `Procedural model for ${entry.name}. To use a real GLTF: download a CC0 model from Sketchfab or Smithsonian 3D, place it in public/models/, and set modelUrl in src/data/modelRegistry.ts.`}
          </p>
        </div>

        {/* CTA row */}
        <div className="flex gap-3 flex-wrap">
          <Link to={`/see-the-past/${site.slug}`} className="flex-1 min-w-[140px]">
            <Button variant="gold" className="w-full" icon={<ChevronRight className="h-4 w-4" />}>
              See the Past
            </Button>
          </Link>
          <Link to="/chat" className="flex-1 min-w-[140px]">
            <Button variant="ghost" className="w-full">
              Ask AI Guide
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
