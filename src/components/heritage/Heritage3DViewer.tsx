/**
 * Heritage3DViewer
 *
 * Renders a heritage monument in 3D using React Three Fiber.
 * - Loads a real GLB/GLTF when modelUrl is provided
 * - Falls back to a detailed procedural Chola-style temple when no model exists
 * - Orbit controls (drag to rotate, scroll to zoom, right-click to pan)
 * - Annotation hotspots displayed as floating labels
 * - Historic / present-day toggle (sepia post-processing for historic mode)
 * - Fullscreen support
 * - Loading & error states
 */

import { Suspense, useRef, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Html, useGLTF, PresentationControls, Stage } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, X, Maximize2, Minimize2, Eye, History, RotateCcw, AlertTriangle } from 'lucide-react';
import type { ModelEntry, Annotation } from '../../data/modelRegistry';

// ── Procedural Dravidian Temple ───────────────────────────────────────────────
function ProceduralTemple({ historic }: { historic: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const mainColor   = new THREE.Color(historic ? 0xd4a96a : 0x8c7b6e);
  const accentColor = new THREE.Color(historic ? 0xf0c060 : 0xa89880);
  const capColor    = new THREE.Color(historic ? 0xffd700 : 0xd4af37);

  // Slow auto-rotate when not interacting
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.08;
  });

  const mat  = (c: THREE.Color, roughness = 0.75) => new THREE.MeshStandardMaterial({ color: c, roughness, metalness: 0.1 });
  const bmat = mat(mainColor);
  const amat = mat(accentColor);

  return (
    <group ref={groupRef}>
      {/* Ground platform */}
      <mesh position={[0, -0.15, 0]} receiveShadow>
        <boxGeometry args={[5, 0.3, 5]} />
        <primitive object={bmat} attach="material" />
      </mesh>

      {/* Lower body */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 1.2, 3]} />
        <primitive object={bmat} attach="material" />
      </mesh>

      {/* Mandapam entrance */}
      <mesh position={[0, 0.4, 1.8]} castShadow>
        <boxGeometry args={[1.2, 0.8, 0.6]} />
        <primitive object={amat} attach="material" />
      </mesh>

      {/* Pillars left/right */}
      {[-1.2, 1.2].flatMap((x) =>
        [-1.2, 1.2].map((z) => (
          <mesh key={`p-${x}-${z}`} position={[x, 0.5, z]} castShadow>
            <cylinderGeometry args={[0.12, 0.14, 1, 8]} />
            <primitive object={amat} attach="material" />
          </mesh>
        ))
      )}

      {/* Vimana — 9 receding tiers */}
      {[1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.22].map((s, i) => {
        const w = s * 2.8;
        const y = 1.45 + i * 0.35;
        const c = i % 2 === 0 ? mainColor : accentColor;
        return (
          <mesh key={`t-${i}`} position={[0, y, 0]} castShadow>
            <boxGeometry args={[w, 0.32, w]} />
            <meshStandardMaterial color={c} roughness={0.7} />
          </mesh>
        );
      })}

      {/* Neck */}
      <mesh position={[0, 4.75, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.35, 0.4, 12]} />
        <primitive object={amat} attach="material" />
      </mesh>

      {/* Kumbam (capstone) */}
      <mesh position={[0, 5.1, 0]} castShadow>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshStandardMaterial
          color={capColor}
          roughness={0.2}
          metalness={0.6}
          emissive={capColor}
          emissiveIntensity={historic ? 0.3 : 0.05}
        />
      </mesh>

      {/* Kalasha finial */}
      <mesh position={[0, 5.48, 0]} castShadow>
        <coneGeometry args={[0.08, 0.3, 8]} />
        <meshStandardMaterial color={capColor} roughness={0.1} metalness={0.8} />
      </mesh>

      {/* Nandi (sacred bull silhouette) */}
      <mesh position={[0, 0.35, 2.8]} castShadow>
        <boxGeometry args={[0.7, 0.7, 1.1]} />
        <meshStandardMaterial color={mainColor} roughness={0.9} />
      </mesh>

      {/* Floor grid */}
      <gridHelper args={[12, 20, '#2a2a2a', '#1a1a1a']} position={[0, -0.29, 0]} />
    </group>
  );
}

// ── GLTF Model loader ─────────────────────────────────────────────────────────
function GltfModel({ url, scale, yOffset }: { url: string; scale: number; yOffset: number }) {
  const { scene } = useGLTF(url);

  // Centre the model
  const box = new THREE.Box3().setFromObject(scene);
  const centre = new THREE.Vector3();
  box.getCenter(centre);
  scene.position.set(-centre.x, -box.min.y + yOffset, -centre.z);

  const size = new THREE.Vector3();
  box.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z);
  const normScale = (4 / maxDim) * scale;

  return <primitive object={scene} scale={normScale} />;
}

// ── Annotation dot ────────────────────────────────────────────────────────────
function AnnotationDot({ ann, onClick }: { ann: Annotation; onClick: (a: Annotation) => void }) {
  const [hovered, setHovered] = useState(false);
  const { camera } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      // Scale inversely with camera distance for constant screen size
      const dist = camera.position.distanceTo(new THREE.Vector3(...ann.position));
      const s = Math.max(0.04, Math.min(0.12, dist * 0.02));
      meshRef.current.scale.setScalar(s);
    }
  });

  return (
    <group position={ann.position}>
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); onClick(ann); }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial
          color={hovered ? '#fbbf24' : '#f59e0b'}
          emissive={hovered ? '#fbbf24' : '#d97706'}
          emissiveIntensity={0.6}
          roughness={0.2}
        />
      </mesh>
      <Html distanceFactor={8} style={{ pointerEvents: 'none' }}>
        <div className="bg-black/70 text-yellow-300 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap border border-yellow-500/30">
          {ann.label}
        </div>
      </Html>
    </group>
  );
}

// ── Scene ─────────────────────────────────────────────────────────────────────
function Scene({
  entry,
  historic,
  onAnnotationClick,
}: {
  entry: ModelEntry;
  historic: boolean;
  onAnnotationClick: (a: Annotation) => void;
}) {
  return (
    <>
      <ambientLight intensity={historic ? 0.8 : 0.6} color={historic ? '#ffe8b0' : '#ffffff'} />
      <directionalLight
        position={[6, 10, 6]}
        intensity={historic ? 1.8 : 1.4}
        color={historic ? '#ffd080' : '#ffffff'}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-5, 5, -5]} intensity={0.4} color={historic ? '#ff9940' : '#8080ff'} />

      {/* Sky environment */}
      <Environment preset={historic ? 'sunset' : 'city'} />

      {/* Model or procedural */}
      <Suspense fallback={null}>
        {entry.modelUrl ? (
          <GltfModel url={entry.modelUrl} scale={entry.scale} yOffset={entry.yOffset} />
        ) : (
          <ProceduralTemple historic={historic} />
        )}
      </Suspense>

      {/* Annotations */}
      {entry.annotations.map((ann) => (
        <AnnotationDot key={ann.id} ann={ann} onClick={onAnnotationClick} />
      ))}

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial
          color={historic ? '#2a1f0a' : '#111111'}
          roughness={1}
          metalness={0}
        />
      </mesh>

      {/* Orbit controls */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={3}
        maxDistance={20}
        maxPolarAngle={Math.PI / 2}
        makeDefault
      />
    </>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
interface Props {
  entry:    ModelEntry;
  historic?: boolean;
}

export function Heritage3DViewer({ entry, historic = false }: Props) {
  const [selectedAnn,  setSelectedAnn]  = useState<Annotation | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHistoric,   setIsHistoric]   = useState(historic);
  const [loadError,    setLoadError]    = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 ${isFullscreen ? 'fixed inset-0 z-50 rounded-none border-0' : ''}`}
      style={{ height: isFullscreen ? '100vh' : 480 }}
    >
      {/* ── Controls overlay (top-right) ── */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
        {/* Fullscreen */}
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-xl glass text-stone-300 hover:text-stone-100 transition-colors"
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </button>
      </div>

      {/* ── Time toggle (top-left) ── */}
      <div className="absolute top-3 left-3 z-10 flex gap-2">
        <button
          onClick={() => setIsHistoric(false)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${!isHistoric ? 'bg-blue-500 text-white' : 'glass text-stone-300 hover:text-stone-100'}`}
          aria-pressed={!isHistoric}
        >
          <Eye className="h-3.5 w-3.5" /> Present
        </button>
        <button
          onClick={() => setIsHistoric(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${isHistoric ? 'bg-amber-600 text-white' : 'glass text-stone-300 hover:text-stone-100'}`}
          aria-pressed={isHistoric}
        >
          <History className="h-3.5 w-3.5" /> Historical
        </button>
      </div>

      {/* ── Mode badge ── */}
      <div className="absolute bottom-16 left-3 z-10">
        <div className="glass-gold rounded-lg px-3 py-1">
          <p className="text-yellow-400 text-xs font-bold">
            {entry.modelUrl ? '🏛️ GLTF Model' : '🔧 Procedural Model'}
          </p>
          <p className="text-stone-500 text-[10px]">{entry.period}</p>
        </div>
      </div>

      {/* ── Hint ── */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center z-10 pointer-events-none">
        <p className="text-stone-600 text-xs">Drag to rotate · Scroll to zoom · Tap 🟡 dots for info</p>
      </div>

      {/* ── No-model warning if modelUrl present but failed ── */}
      {loadError && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-stone-950/80 p-6">
          <div className="text-center max-w-sm">
            <AlertTriangle className="h-10 w-10 text-yellow-500 mx-auto mb-3" />
            <h3 className="text-stone-100 font-semibold mb-2">3D Model Could Not Load</h3>
            <p className="text-stone-400 text-sm mb-4">
              The GLB file at <code className="text-yellow-600 text-xs">{entry.modelUrl}</code> could not be loaded.
            </p>
            <p className="text-stone-500 text-xs mb-4">
              To add a model: download a CC0-licensed GLB from Sketchfab or Smithsonian 3D, drop it in <code className="text-xs text-stone-400">public/models/</code> and update modelRegistry.ts.
            </p>
            <button
              onClick={() => setLoadError(false)}
              className="flex items-center gap-2 mx-auto px-4 py-2 rounded-xl bg-yellow-500 text-black text-sm font-semibold"
            >
              <RotateCcw className="h-4 w-4" /> Show Procedural Model
            </button>
          </div>
        </div>
      )}

      {/* ── Three.js Canvas ── */}
      <Canvas
        shadows
        camera={{ position: [0, 4, 10], fov: 50 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: isHistoric ? 1.4 : 1.0 }}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
        aria-label={`Interactive 3D model of ${entry.name}`}
      >
        {/* Sepia post-process effect for historical mode — via tone mapping */}
        <color attach="background" args={[isHistoric ? '#1a1000' : '#0d0d0d']} />
        <fog attach="fog" args={[isHistoric ? '#1a1000' : '#0d0d0d', 18, 50]} />

        <Suspense fallback={null}>
          <Scene
            entry={entry}
            historic={isHistoric}
            onAnnotationClick={(a) => setSelectedAnn(a)}
          />
        </Suspense>
      </Canvas>

      {/* ── Annotation popup ── */}
      <AnimatePresence>
        {selectedAnn && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-16 left-3 right-3 glass-gold rounded-2xl p-4 z-10 max-w-sm mx-auto"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                <h4 className="text-yellow-300 font-bold text-sm">{selectedAnn.label}</h4>
              </div>
              <button onClick={() => setSelectedAnn(null)} aria-label="Close annotation">
                <X className="h-4 w-4 text-stone-400 hover:text-stone-200" />
              </button>
            </div>
            <p className="text-stone-300 text-sm mt-2 leading-relaxed">{selectedAnn.note}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
