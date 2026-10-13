/**
 * Heritage Recognition Service
 *
 * Sends an image to the backend /api/recognize endpoint.
 * Falls back to the curated demo database when no backend is reachable.
 */

import type { RecognitionResult } from '../../types';
import { DEMO_SITES } from '../../data/demo/heritage-sites';

const API_BASE = import.meta.env.VITE_AI_API_URL || 'http://localhost:3001';

export const PROCESSING_STAGES = [
  { id: 'upload',   label: 'Uploading image…',              duration: 400 },
  { id: 'visual',   label: 'Analysing visual features…',    duration: 600 },
  { id: 'matching', label: 'Matching heritage database…',   duration: 700 },
  { id: 'context',  label: 'Preparing historical context…', duration: 400 },
];

// ── Backend call ──────────────────────────────────────────────────────────────
async function callBackend(imageData: Blob | string): Promise<RecognitionResult | null> {
  const formData = new FormData();

  if (imageData instanceof Blob) {
    formData.append('image', imageData, 'capture.jpg');
  } else {
    // base64 string
    formData.append('image_base64', imageData);
  }

  const response = await fetch(`${API_BASE}/api/recognize`, {
    method: 'POST',
    body: formData,
    signal: AbortSignal.timeout(30_000),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || `HTTP ${response.status}`);
  }

  const data = await response.json();

  // Normalise into RecognitionResult shape
  return {
    siteId:       data.siteId  ?? null,
    siteName:     data.siteName,
    confidence:   Math.round((data.confidence ?? 0.88) * 100),
    location:     data.location ?? '',
    period:       data.historical_period ?? '',
    overview:     data.overview ?? null,
    notable_facts: data.notable_facts ?? [],
    architectural_style: data.architectural_style ?? null,
    builder:      data.builder ?? null,
    cultural_significance: data.cultural_significance ?? null,
    visitor_info: data.visitor_info ?? null,
    is_heritage_site: data.is_heritage_site !== false,
    isDemo:       data.isDemo ?? false,
    matchMethod:  data.matchMethod ?? 'vision-ai',
    provider:     data.provider ?? 'backend',
  };
}

// ── Demo fallback ─────────────────────────────────────────────────────────────
let demoIdx = 0;

function demoResult(siteId?: string): RecognitionResult {
  const site = siteId
    ? DEMO_SITES.find((s) => s.id === siteId) ?? DEMO_SITES[0]
    : DEMO_SITES[demoIdx++ % DEMO_SITES.length];

  return {
    siteId:     site.id,
    siteName:   site.name_en,
    confidence: 88 + Math.floor(Math.random() * 10),
    location:   site.location_name,
    period:     site.historical_period,
    overview:   (site.history_en ?? '').split('\n')[0] ?? null,
    notable_facts: [],
    architectural_style: null,
    builder:    site.builder ?? null,
    cultural_significance: null,
    visitor_info: null,
    is_heritage_site: true,
    isDemo:     true,
    matchMethod: 'demo',
    provider:   'demo',
  };
}

// ── Public API ────────────────────────────────────────────────────────────────
export async function identifyHeritage(imageData: Blob | string): Promise<RecognitionResult | null> {
  try {
    return await callBackend(imageData);
  } catch (err) {
    console.warn('[recognition] Backend unavailable, using demo fallback:', err);
    return demoResult();
  }
}

export async function recognizeFromDemoImage(siteId: string): Promise<RecognitionResult | null> {
  // Still try backend — it accepts demo images fine
  try {
    // Fetch the demo thumbnail and send it
    const site = DEMO_SITES.find((s) => s.id === siteId);
    if (site?.featured_image) {
      const resp = await fetch(site.featured_image, { signal: AbortSignal.timeout(8_000) });
      if (resp.ok) {
        const blob = await resp.blob();
        return await callBackend(blob);
      }
    }
  } catch {
    // fall through
  }
  return demoResult(siteId);
}
