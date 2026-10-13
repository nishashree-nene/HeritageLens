/**
 * Model Registry
 *
 * Each entry can point to:
 *   modelUrl  — a GLB/GLTF file (local public/ path or remote CDN)
 *   fallback  — "procedural" | "placeholder"
 *
 * To add a new model:
 *   1. Drop the .glb file into /public/models/
 *   2. Add an entry here with modelUrl: '/models/yourfile.glb'
 *
 * Free heritage models:
 *   - Sketchfab (CC0 / CC-BY): https://sketchfab.com/search?q=heritage&features=downloadable
 *   - Smithsonian Open Access: https://3d.si.edu/
 *   - Google Arts & Culture: https://artsandculture.google.com/project/cyark
 */

export interface ModelEntry {
  id:          string;
  name:        string;
  siteId:      string;
  modelUrl:    string | null;   // null = use procedural fallback
  thumbnailUrl: string;
  description: string;
  period:      string;
  style:       string;
  scale:       number;          // normalised scale applied after load
  yOffset:     number;          // vertical offset to ground the model
  /** Array of annotation hotspots */
  annotations: Annotation[];
  license?:    string;
  source?:     string;
  isHistoric?: boolean;         // true = this is a historical reconstruction
}

export interface Annotation {
  id:       string;
  label:    string;
  position: [number, number, number];   // world-space XYZ
  note:     string;
}

export const MODEL_REGISTRY: ModelEntry[] = [
  {
    id:          'brihadeeswarar-procedural',
    name:        'Brihadeeswarar Temple (3D)',
    siteId:      'site-001',
    modelUrl:    null,  // procedural — replace with '/models/brihadeeswarar.glb' when available
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Brihadeeswarar_temple_in_Thanjavur.jpg/640px-Brihadeeswarar_temple_in_Thanjavur.jpg',
    description:  'Procedural 3D representation of Brihadeeswarar Temple. The 66-metre vimana rising in 13 receding tiers, the monolithic Nandi mandapam, and the outer compound wall.',
    period:       'Chola Period — 1010 CE',
    style:        'Dravidian',
    scale:        1,
    yOffset:      0,
    annotations: [
      { id: 'a1', label: 'Vimana', position: [0, 3.5, 0],    note: '66-metre granite tower — tallest temple tower in South India at its time' },
      { id: 'a2', label: 'Kumbam',  position: [0, 4.2, 0],   note: '80-tonne monolithic granite capstone — placed via a 6 km ramp' },
      { id: 'a3', label: 'Gopura',  position: [0, 1.2, 2.5], note: 'Eastern entrance gopuram with ornate sculpted panels' },
      { id: 'a4', label: 'Nandi',   position: [0, 0.5, 3.5], note: 'Monolithic Nandi (sacred bull) — 6 metres long, carved from a single granite block' },
    ],
    source: 'Procedural model — replace with verified GLB for production',
  },
  {
    id:          'shore-temple-procedural',
    name:        'Shore Temple (3D)',
    siteId:      'site-002',
    modelUrl:    null,
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Shore_Temple_2.jpg/640px-Shore_Temple_2.jpg',
    description:  'Procedural 3D representation of the Shore Temple at Mahabalipuram, showing the twin shikhara towers and the compound facing the Bay of Bengal.',
    period:       'Pallava Period — 700–728 CE',
    style:        'Early Dravidian (Pallava)',
    scale:        1,
    yOffset:      0,
    annotations: [
      { id: 'a1', label: 'Main Shikhara', position: [0.8, 2.5, 0],  note: 'Tallest of the two towers, dedicated to Shiva (Somaskanda)' },
      { id: 'a2', label: 'Second Tower',  position: [-0.8, 1.5, 0], note: 'Smaller tower also dedicated to Shiva; unique double-tower plan' },
      { id: 'a3', label: 'Vishnu Shrine', position: [0, 0.5, 1],    note: 'Recumbent Vishnu (Anantasayi) shrine — unusual combination with Shiva shrines' },
    ],
    source: 'Procedural model',
  },
  {
    id:          'gingee-fort-procedural',
    name:        'Gingee Fort (3D)',
    siteId:      'site-003',
    modelUrl:    null,
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Rajagiri_citadel_of_Gingee_Fort.jpg/640px-Rajagiri_citadel_of_Gingee_Fort.jpg',
    description:  'Procedural 3D representation of the Rajagiri citadel of Gingee Fort, showing the stepped granite hilltop fortification with watchtowers.',
    period:       'Multi-period: 9th–18th Century CE',
    style:        'Military fortification',
    scale:        1,
    yOffset:      0,
    annotations: [
      { id: 'a1', label: 'Rajagiri Citadel', position: [0, 3, 0],   note: 'The highest of the three hills — sheer 150-ft cliffs on three sides' },
      { id: 'a2', label: 'Outer Walls',       position: [2, 0.5, 0], note: 'Triple concentric walls up to 18 metres high in sections' },
      { id: 'a3', label: 'Granary',           position: [-1, 0.8, 1], note: '7-year food storage — key to surviving the 8-year Mughal siege' },
    ],
    source: 'Procedural model',
  },
  {
    id:          'meenakshi-procedural',
    name:        'Meenakshi Temple (3D)',
    siteId:      'site-004',
    modelUrl:    null,
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Madurai_Meenakshi_Amman_Temple.jpg/640px-Madurai_Meenakshi_Amman_Temple.jpg',
    description:  'Procedural 3D representation of the Meenakshi Amman Temple complex showing the 14 gopuram towers and the tank.',
    period:       'Nayak Period — 16th–17th Century CE',
    style:        'Dravidian (Nayak elaboration)',
    scale:        1,
    yOffset:      0,
    annotations: [
      { id: 'a1', label: 'South Gopuram',     position: [0, 4, 2.5],  note: 'Tallest gopuram — 52 metres, ~33,000 coloured stucco sculptures' },
      { id: 'a2', label: '1000-Pillar Hall',  position: [2, 0.8, 0],  note: 'Actually 985 pillars, each producing a distinct musical note when struck' },
      { id: 'a3', label: 'Golden Lotus Tank', position: [0, 0.2, -2], note: 'Sacred tank — pilgrims take ritual dip before entering the inner sanctum' },
    ],
    source: 'Procedural model',
  },
];

export function getModelForSite(siteId: string): ModelEntry | undefined {
  return MODEL_REGISTRY.find((m) => m.siteId === siteId);
}

export function getModelById(id: string): ModelEntry | undefined {
  return MODEL_REGISTRY.find((m) => m.id === id);
}
