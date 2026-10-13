/**
 * CameraCapture — live getUserMedia camera with capture / retake / upload.
 *
 * - Requests camera permission on mount.
 * - Falls back gracefully to file-upload if camera is unavailable.
 * - Stops all media tracks when unmounted or when user leaves the view.
 * - Supports both desktop and mobile (uses `facingMode: environment` on mobile).
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, RotateCcw, Upload, AlertTriangle, SwitchCamera, X } from 'lucide-react';
import { Button } from '../ui/Button';

type CameraState = 'requesting' | 'live' | 'captured' | 'no-camera' | 'error';

interface Props {
  onCapture: (blob: Blob, previewUrl: string) => void;
  onClose?: () => void;
}

export function CameraCapture({ onCapture, onClose }: Props) {
  const videoRef    = useRef<HTMLVideoElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const streamRef   = useRef<MediaStream | null>(null);
  const fileRef     = useRef<HTMLInputElement>(null);

  const [state,      setState]      = useState<CameraState>('requesting');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [errorMsg,   setErrorMsg]   = useState('');
  const [preview,    setPreview]    = useState<string | null>(null);

  // ── Start camera stream ──────────────────────────────────────────────────────
  const startCamera = useCallback(async (facing: 'environment' | 'user') => {
    // Stop any existing stream first
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    setState('requesting');
    setErrorMsg('');

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facing },
          width:  { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setState('live');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);

      if (msg.includes('NotAllowedError') || msg.includes('Permission')) {
        setErrorMsg('Camera permission denied. Please allow camera access in your browser settings, or upload an image instead.');
      } else if (msg.includes('NotFoundError') || msg.includes('DevicesNotFound')) {
        setErrorMsg('No camera found on this device.');
      } else if (msg.includes('NotReadableError') || msg.includes('TrackStart')) {
        setErrorMsg('Camera is in use by another application.');
      } else {
        setErrorMsg(`Camera unavailable: ${msg}`);
      }
      setState('no-camera');
    }
  }, []);

  // ── Mount / unmount ──────────────────────────────────────────────────────────
  useEffect(() => {
    startCamera(facingMode);

    return () => {
      // Always stop tracks when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // ── Capture still from video ─────────────────────────────────────────────────
  const capturePhoto = () => {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width  = video.videoWidth  || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        setPreview(url);
        setState('captured');

        // Stop the live stream — no longer needed
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
          streamRef.current = null;
        }
      },
      'image/jpeg',
      0.92,
    );
  };

  // ── Retake ───────────────────────────────────────────────────────────────────
  const retake = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    startCamera(facingMode);
  };

  // ── File upload fallback ──────────────────────────────────────────────────────
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    const url = URL.createObjectURL(file);
    setPreview(url);
    setState('captured');

    // Convert File → Blob (they share the same interface, cast directly)
    onCapture(file as Blob, url);
  };

  // ── Flip camera (front/back) ─────────────────────────────────────────────────
  const flipCamera = () => {
    const next = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(next);
    startCamera(next);
  };

  // ── Confirm captured image ────────────────────────────────────────────────────
  const confirmCapture = () => {
    if (!preview) return;
    // Re-create blob from canvas
    canvasRef.current?.toBlob(
      (blob) => {
        if (blob) onCapture(blob, preview);
      },
      'image/jpeg',
      0.92,
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-stone-900 border border-stone-700">
      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-1.5 rounded-lg bg-black/60 text-stone-300 hover:text-white transition-colors"
          aria-label="Close camera"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {/* Hidden canvas for snapshot */}
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      {/* ── Live preview ── */}
      <AnimatePresence mode="wait">
        {state === 'requesting' && (
          <motion.div
            key="requesting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 gap-4"
          >
            <div className="w-10 h-10 rounded-full border-2 border-yellow-500/30 border-t-yellow-500 animate-spin" />
            <p className="text-stone-400 text-sm">Requesting camera access…</p>
          </motion.div>
        )}

        {state === 'live' && (
          <motion.div key="live" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Video stream */}
            <div className="relative" style={{ aspectRatio: '4/3' }}>
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted
                aria-label="Live camera preview"
              />

              {/* Scan overlay corners */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-6 border-2 border-yellow-500/40 rounded-2xl" />
                {/* Corner brackets */}
                {[
                  'top-6 left-6 border-t-2 border-l-2 rounded-tl-lg',
                  'top-6 right-6 border-t-2 border-r-2 rounded-tr-lg',
                  'bottom-6 left-6 border-b-2 border-l-2 rounded-bl-lg',
                  'bottom-6 right-6 border-b-2 border-r-2 rounded-br-lg',
                ].map((cls, i) => (
                  <div key={i} className={`absolute w-6 h-6 border-yellow-400 ${cls}`} />
                ))}
                {/* Scan line */}
                <div
                  className="absolute left-6 right-6 h-0.5 bg-yellow-400/60"
                  style={{ top: '50%', boxShadow: '0 0 12px 2px rgba(251,191,36,0.5)', animation: 'scanLine 2s ease-in-out infinite' }}
                />
              </div>

              {/* Hint text */}
              <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
                <p className="text-stone-300/80 text-xs">Point at a heritage monument</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between px-4 py-4 bg-stone-950">
              {/* Upload fallback */}
              <button
                onClick={() => fileRef.current?.click()}
                className="flex flex-col items-center gap-1 text-stone-500 hover:text-stone-300 transition-colors"
                aria-label="Upload from device"
              >
                <Upload className="h-5 w-5" />
                <span className="text-[10px]">Upload</span>
              </button>

              {/* Capture */}
              <button
                onClick={capturePhoto}
                className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                aria-label="Capture photo"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600" />
              </button>

              {/* Flip camera */}
              <button
                onClick={flipCamera}
                className="flex flex-col items-center gap-1 text-stone-500 hover:text-stone-300 transition-colors"
                aria-label="Flip camera"
              >
                <SwitchCamera className="h-5 w-5" />
                <span className="text-[10px]">Flip</span>
              </button>
            </div>
          </motion.div>
        )}

        {state === 'captured' && preview && (
          <motion.div key="captured" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="relative" style={{ aspectRatio: '4/3' }}>
              <img src={preview} alt="Captured" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            </div>
            <div className="flex gap-3 px-4 py-4 bg-stone-950">
              <Button variant="ghost" className="flex-1" icon={<RotateCcw className="h-4 w-4" />} onClick={retake}>
                Retake
              </Button>
              <Button variant="gold" className="flex-1" icon={<Camera className="h-4 w-4" />} onClick={confirmCapture}>
                Identify Monument
              </Button>
            </div>
          </motion.div>
        )}

        {(state === 'no-camera' || state === 'error') && (
          <motion.div
            key="no-camera"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-16 px-6 text-center gap-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <AlertTriangle className="h-7 w-7 text-red-400" />
            </div>
            <div>
              <h3 className="text-stone-200 font-semibold mb-1">Camera Unavailable</h3>
              <p className="text-stone-500 text-sm leading-relaxed">{errorMsg}</p>
            </div>
            <div className="flex flex-col gap-2 w-full max-w-xs">
              <Button variant="gold" className="w-full" icon={<Upload className="h-4 w-4" />} onClick={() => fileRef.current?.click()}>
                Upload Image Instead
              </Button>
              <Button variant="ghost" className="w-full" icon={<RotateCcw className="h-4 w-4" />} onClick={() => startCamera(facingMode)}>
                Retry Camera
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
        aria-label="Upload image from device"
      />
    </div>
  );
}
