import type { RecognitionResult } from '../../types';
import { DEMO_SITES } from '../../data/demo/heritage-sites';

const DEMO_MAP = [
  { siteId: 'site-001', confidence: 94 },
  { siteId: 'site-002', confidence: 89 },
  { siteId: 'site-003', confidence: 85 },
  { siteId: 'site-004', confidence: 92 },
  { siteId: 'site-005', confidence: 81 },
];
let demoIndex = 0;

export const PROCESSING_STAGES = [
  { id: 'visual', label: 'Analyzing visual features...', duration: 600 },
  { id: 'matching', label: 'Matching heritage database...', duration: 700 },
  { id: 'location', label: 'Checking location context...', duration: 500 },
  { id: 'context', label: 'Preparing historical context...', duration: 400 },
];

export async function identifyHeritage(imageData: string | File): Promise<RecognitionResult | null> {
  const aiApiUrl = import.meta.env.VITE_AI_API_URL;
  if (aiApiUrl) {
    try {
      const formData = new FormData();
      if (imageData instanceof File) formData.append('image', imageData);
      else formData.append('image_base64', imageData);
      const res = await fetch(`${aiApiUrl}/recognize`, { method: 'POST', body: formData });
      if (res.ok) return { ...(await res.json()), isDemo: false, matchMethod: 'visual' };
    } catch { /* fall through */ }
  }
  await new Promise((r) => setTimeout(r, 2400));
  const sample = DEMO_MAP[demoIndex % DEMO_MAP.length];
  demoIndex++;
  const site = DEMO_SITES.find((s) => s.id === sample.siteId);
  if (!site) return null;
  return { siteId: site.id, siteName: site.name_en, confidence: sample.confidence + Math.floor(Math.random() * 5) - 2, location: site.location_name, period: site.historical_period, isDemo: true, matchMethod: 'demo' };
}

export async function recognizeFromDemoImage(siteId: string): Promise<RecognitionResult | null> {
  await new Promise((r) => setTimeout(r, 2400));
  const site = DEMO_SITES.find((s) => s.id === siteId);
  if (!site) return null;
  return { siteId: site.id, siteName: site.name_en, confidence: 92 + Math.floor(Math.random() * 7), location: site.location_name, period: site.historical_period, isDemo: true, matchMethod: 'demo' };
}
