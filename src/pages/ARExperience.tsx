import { useState, useRef, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { ArrowLeft, Info, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { DEMO_SITES, getArtifactsForSite } from '../data/demo/heritage-sites';
import { useAppStore } from '../store/appStore';

function buildScene(historic: boolean): THREE.Scene {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(historic ? 0x1a1000 : 0x0d0d0d);
  scene.fog = new THREE.Fog(scene.background as THREE.Color, 20, 60);
  const main = historic ? 0xd97706 : 0x78716c, accent = historic ? 0xf59e0b : 0xa8a29e, glow = historic ? 0xfbbf24 : 0xd6d3d1;
  scene.add(new THREE.AmbientLight(0xffffff, historic ? 1.0 : 0.7));
  const dl = new THREE.DirectionalLight(historic ? 0xfbbf24 : 0xffffff, historic ? 1.5 : 1.2);
  dl.position.set(5, 10, 5); scene.add(dl);
  const pl = new THREE.PointLight(0xf59e0b, 0.5, 20); pl.position.set(-5, 5, -5); scene.add(pl);
  scene.add(new THREE.GridHelper(20, 20, 0x2a2a2a, 0x1a1a1a) as unknown as THREE.Object3D);
  const g = new THREE.Group();
  const bm = new THREE.MeshStandardMaterial({ color: main, roughness: 0.8 });
  g.add(Object.assign(new THREE.Mesh(new THREE.BoxGeometry(4, 0.3, 4), bm)));
  const body = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.2, 2.5), new THREE.MeshStandardMaterial({ color: main, roughness: 0.7 }));
  body.position.y = 0.75; g.add(body);
  [1, 0.85, 0.7, 0.55, 0.4, 0.3, 0.22, 0.15].forEach((s, i) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(s * 2.5, 0.25, s * 2.5), new THREE.MeshStandardMaterial({ color: i % 2 === 0 ? main : accent, roughness: 0.6 }));
    m.position.y = 1.35 + i * 0.28; g.add(m);
  });
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), new THREE.MeshStandardMaterial({ color: glow, emissive: new THREE.Color(glow), emissiveIntensity: historic ? 0.5 : 0.1, roughness: 0.3 }));
  cap.position.y = 3.8; g.add(cap);
  [-1.5, 1.5].forEach((x) => { const p = new THREE.Mesh(new THREE.BoxGeometry(0.3, 2, 0.3), new THREE.MeshStandardMaterial({ color: accent, roughness: 0.7 })); p.position.set(x, 0.8, 2.2); g.add(p); });
  scene.add(g);
  return scene;
}

function ThreeCanvas({ mode }: { mode: 'current' | 'past' | 'compare' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const rotRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const w = canvas.parentElement?.clientWidth || 800, h = canvas.parentElement?.clientHeight || 500;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio); renderer.setSize(w, h);
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
    camera.position.set(0, 4, 10); camera.lookAt(0, 2, 0);
    let isDragging = false, prevX = 0, extraRot = 0;
    const onDown = (e: MouseEvent) => { isDragging = true; prevX = e.clientX; };
    const onMove = (e: MouseEvent) => { if (isDragging) { extraRot += (e.clientX - prevX) * 0.01; prevX = e.clientX; } };
    const onUp = () => { isDragging = false; };
    canvas.addEventListener('mousedown', onDown); window.addEventListener('mousemove', onMove); window.addEventListener('mouseup', onUp);
    const scenes = mode === 'compare' ? [buildScene(false), buildScene(true)] : [buildScene(mode === 'past')];
    const animate = () => {
      animRef.current = requestAnimationFrame(animate);
      rotRef.current += 0.003;
      const r = rotRef.current + extraRot;
      camera.position.set(Math.sin(r) * 8, 4, Math.cos(r) * 8); camera.lookAt(0, 2, 0);
      if (mode === 'compare' && scenes.length === 2) {
        renderer.setScissorTest(true);
        const half = Math.floor(w / 2);
        renderer.setViewport(0, 0, half, h); renderer.setScissor(0, 0, half, h); renderer.render(scenes[0], camera);
        renderer.setViewport(half, 0, half, h); renderer.setScissor(half, 0, half, h); renderer.render(scenes[1], camera);
        renderer.setScissorTest(false);
      } else { renderer.render(scenes[0], camera); }
    };
    animate();
    const onResize = () => { const nw = canvas.parentElement?.clientWidth || 800, nh = canvas.parentElement?.clientHeight || 500; renderer.setSize(nw, nh); camera.aspect = nw / nh; camera.updateProjectionMatrix(); };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(animRef.current); canvas.removeEventListener('mousedown', onDown); window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); window.removeEventListener('resize', onResize); renderer.dispose(); };
  }, [mode]);

  return <canvas ref={canvasRef} className="w-full h-full" aria-label="3D heritage model — drag to rotate" />;
}

export default function ARExperience() {
  const [searchParams] = useSearchParams();
  const siteId = searchParams.get('site') || 'site-001';
  const { language, earnBadge } = useAppStore();
  const site = DEMO_SITES.find((s) => s.id === siteId) || DEMO_SITES[0];
  const artifacts = getArtifactsForSite(site.id);
  const [mode, setMode] = useState<'current' | 'past' | 'compare'>('current');
  const [infoOpen, setInfoOpen] = useState(false);
  const [selectedArtifact, setSelectedArtifact] = useState<string | null>(null);
  const name = language === 'ta' ? site.name_ta : site.name_en;
  useEffect(() => { earnBadge('badge-002'); }, []);

  return (
    <div className="min-h-screen pt-16 pb-24 bg-stone-950">
      <div className="flex items-center justify-between px-4 py-3 border-b border-stone-800">
        <Link to={`/heritage/${site.slug}`} className="flex items-center gap-2 text-stone-400 hover:text-stone-200 text-sm"><ArrowLeft className="h-4 w-4" />Back</Link>
        <div className="flex items-center gap-2"><span className="text-stone-400 text-sm hidden sm:block">{name}</span><Badge variant="ar">AR / 3D Demo</Badge></div>
        <button onClick={() => setInfoOpen(true)} className="p-2 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-white/5" aria-label="Info"><Info className="h-4 w-4" /></button>
      </div>
      <div className="px-4 py-2 bg-stone-900/60 border-b border-stone-800"><p className="text-xs text-stone-500 text-center">🔮 <strong>3D Demo</strong> — Procedural Three.js model. Replace with real GLB/GLTF models for production.</p></div>
      <div className="relative h-[55vh] bg-gradient-to-b from-stone-950 to-stone-950 overflow-hidden">
        <ThreeCanvas mode={mode} />
        <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none"><div className="glass rounded-full px-4 py-2"><p className="text-yellow-400 text-xs font-bold uppercase tracking-wider">{mode === 'current' ? '📅 Current State' : mode === 'past' ? `🏛️ ${site.construction_date || 'Historical'}` : '⚖️ Compare View'}</p></div></div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none"><p className="text-stone-600 text-xs">Drag to rotate</p></div>
      </div>
      <div className="px-4 py-4 border-b border-stone-800">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {(['current', 'past', 'compare'] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)} className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${mode === m ? 'bg-yellow-500 text-black' : 'glass text-stone-300 hover:text-stone-100'}`}>{m === 'current' ? '📅 Current' : m === 'past' ? '🏛️ Historical' : '⚖️ Compare'}</button>
          ))}
          <Link to={`/see-the-past/${site.slug}`}><button className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold glass text-yellow-400 hover:text-yellow-300 transition-all">🎬 See the Past</button></Link>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <div className="heritage-card p-5">
          <h2 className="font-serif text-stone-100 text-lg mb-2">{name}</h2>
          <p className="text-stone-400 text-sm leading-relaxed">{language === 'ta' ? site.description_ta : site.description_en}</p>
          <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-stone-500"><div>📅 {site.historical_period}</div><div>👷 {site.builder}</div><div>🏛️ {site.dynasty}</div><div>📍 {site.location_name}</div></div>
        </div>
        {artifacts.length > 0 && (
          <div>
            <h3 className="font-serif text-stone-100 text-base mb-3">Artifacts & Elements</h3>
            <div className="grid grid-cols-2 gap-3">
              {artifacts.map((art) => (
                <button key={art.id} onClick={() => setSelectedArtifact(art.id)} className="heritage-card p-3 text-left group">
                  <div className="relative overflow-hidden rounded-lg h-28 mb-2"><img src={art.image_url} alt={language === 'ta' ? art.name_ta : art.name_en} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1590169786462-7d54566b25b1?w=300&q=80'; }} /></div>
                  <p className="text-stone-200 text-xs font-semibold">{language === 'ta' ? art.name_ta : art.name_en}</p>
                  <p className="text-stone-600 text-xs">{art.historical_period}</p>
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5"><p className="text-blue-400 text-xs font-semibold mb-1">WebXR AR Mode</p><p className="text-stone-500 text-xs">On supported devices (Chrome on Android), WebXR places the 3D model in your real environment. The Three.js viewer works as fallback on all devices.</p></div>
      </div>

      <AnimatePresence>
        {selectedArtifact && (() => {
          const art = artifacts.find((a) => a.id === selectedArtifact);
          if (!art) return null;
          return (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/70" onClick={() => setSelectedArtifact(null)} />
              <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }} className="relative w-full max-w-md glass rounded-2xl overflow-hidden">
                <img src={art.image_url} alt={language === 'ta' ? art.name_ta : art.name_en} className="w-full h-52 object-cover" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1590169786462-7d54566b25b1?w=600&q=80'; }} />
                <button onClick={() => setSelectedArtifact(null)} className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/50 text-white" aria-label="Close"><X className="h-4 w-4" /></button>
                <div className="p-5"><h3 className="font-serif text-stone-100 text-lg mb-1">{language === 'ta' ? art.name_ta : art.name_en}</h3><p className="text-yellow-500 text-xs mb-3">{art.historical_period}</p><p className="text-stone-300 text-sm leading-relaxed">{language === 'ta' ? art.description_ta : art.description_en}</p>{art.source_reference && <p className="text-stone-600 text-xs mt-3">📚 {art.source_reference}</p>}</div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      <AnimatePresence>
        {infoOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60" onClick={() => setInfoOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-md glass rounded-2xl p-6">
              <h3 className="font-serif text-stone-100 text-lg mb-3">AR / 3D Architecture</h3>
              <div className="space-y-3 text-sm text-stone-400">
                <p><strong className="text-stone-200">Level 1:</strong> Camera-style AR simulation</p>
                <p><strong className="text-stone-200">Level 2:</strong> Three.js 3D viewer (active)</p>
                <p><strong className="text-stone-200">Level 3:</strong> WebXR AR (requires HTTPS + compatible device)</p>
                <div className="p-3 rounded-lg bg-stone-900 border border-stone-800 text-xs">Procedural model shown for demo. Replace with real .glb/.gltf via THREE.GLTFLoader.</div>
              </div>
              <Button variant="gold" className="w-full mt-4" onClick={() => setInfoOpen(false)}>Got it</Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
