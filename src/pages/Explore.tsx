import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { HeritageCard } from '../components/heritage/HeritageCard';
import { Button } from '../components/ui/Button';
import { DEMO_SITES } from '../data/demo/heritage-sites';
import { getHeritageTypeIcon } from '../utils/helpers';
import { useAppStore } from '../store/appStore';

const CATEGORIES = [
  { id: 'all', label: 'All Sites', labelTa: 'அனைத்தும்' },
  { id: 'temple', label: 'Temples', labelTa: 'கோயில்கள்' },
  { id: 'fort', label: 'Forts', labelTa: 'கோட்டைகள்' },
  { id: 'palace', label: 'Palaces', labelTa: 'அரண்மனைகள்' },
  { id: 'museum', label: 'Museums', labelTa: 'அருங்காட்சியகங்கள்' },
];

export default function Explore() {
  const { language } = useAppStore();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [arOnly, setArOnly] = useState(false);
  const [modelOnly, setModelOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => DEMO_SITES.filter((site) => {
    const text = `${site.name_en} ${site.name_ta} ${site.description_en} ${site.location_name} ${site.dynasty} ${site.builder}`.toLowerCase();
    if (query && !text.includes(query.toLowerCase())) return false;
    if (category !== 'all' && site.heritage_type !== category) return false;
    if (arOnly && !site.ar_available) return false;
    if (modelOnly && !site.model_available) return false;
    return true;
  }), [query, category, arOnly, modelOnly]);

  const hasFilters = query || category !== 'all' || arOnly || modelOnly;
  const clearFilters = () => { setQuery(''); setCategory('all'); setArOnly(false); setModelOnly(false); };

  return (
    <div className="min-h-screen pt-20 pb-24">
      <div className="bg-gradient-to-b from-stone-900 to-transparent py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <p className="text-yellow-500 text-xs font-bold tracking-[0.2em] uppercase mb-2">{language === 'ta' ? 'ஆராயுங்கள்' : 'Discover'}</p>
            <h1 className="font-serif text-4xl md:text-5xl text-stone-100 mb-3">{language === 'ta' ? 'பாரம்பரியத்தை ஆராயுங்கள்' : 'Explore Heritage'}</h1>
            <p className="text-stone-400 text-base">{language === 'ta' ? 'தமிழ்நாட்டின் கலாச்சார பாரம்பரிய தளங்களை கண்டறியுங்கள்' : 'Discover the cultural heritage sites of Tamil Nadu'}</p>
          </motion.div>
          <div className="relative max-w-2xl mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder={language === 'ta' ? 'கோயில்கள், கோட்டைகள் தேடுங்கள்...' : 'Search temples, forts, monuments, museums...'}
              className="w-full bg-stone-900 border border-stone-700 rounded-xl pl-11 pr-4 py-3 text-sm text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-yellow-500/50 transition-colors" />
            {query && <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded text-stone-500 hover:text-stone-300"><X className="h-4 w-4" /></button>}
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button onClick={() => setFiltersOpen(!filtersOpen)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm border transition-all ${filtersOpen ? 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10' : 'border-stone-700 text-stone-400 hover:border-stone-600'}`}>
              <SlidersHorizontal className="h-4 w-4" />Filters{hasFilters && <span className="w-2 h-2 rounded-full bg-yellow-500" />}
            </button>
            {CATEGORIES.map((cat) => (
              <button key={cat.id} onClick={() => setCategory(cat.id)} className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${category === cat.id ? 'bg-yellow-500/15 border-yellow-500/40 text-yellow-400' : 'border-stone-700 text-stone-500 hover:text-stone-300 hover:border-stone-600'}`}>
                {cat.id !== 'all' && getHeritageTypeIcon(cat.id)}{' '}{language === 'ta' ? cat.labelTa : cat.label}
              </button>
            ))}
            {hasFilters && <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-300 transition-colors"><X className="h-3 w-3" />Clear</button>}
          </div>
          {filtersOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 p-4 bg-stone-900 border border-stone-700 rounded-xl">
              <p className="text-xs font-semibold text-stone-400 mb-2 uppercase tracking-wider">Availability</p>
              <div className="flex gap-2">
                <button onClick={() => setArOnly(!arOnly)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-all ${arOnly ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' : 'border-stone-700 text-stone-500'}`}>AR Available</button>
                <button onClick={() => setModelOnly(!modelOnly)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-all ${modelOnly ? 'bg-purple-500/15 border-purple-500/30 text-purple-400' : 'border-stone-700 text-stone-500'}`}>3D Model Available</button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-stone-500 text-sm">{filtered.length} {language === 'ta' ? 'தளங்கள்' : 'sites found'}{hasFilters && <span className="text-stone-600 ml-1">(filtered)</span>}</p>
          <div className="text-xs text-stone-600 bg-stone-900 border border-stone-800 rounded-lg px-3 py-1.5">🔬 Demo — 5 Tamil Nadu heritage sites</div>
        </div>
        {filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="text-5xl mb-4">🏛️</div>
            <h3 className="font-serif text-xl text-stone-300 mb-2">{language === 'ta' ? 'தளங்கள் இல்லை' : 'No sites found'}</h3>
            <p className="text-stone-500 text-sm mb-6">{language === 'ta' ? 'உங்கள் தேடலை சரிசெய்யுங்கள்' : 'Try adjusting your search or filters'}</p>
            <Button variant="ghost" onClick={clearFilters} icon={<X className="h-4 w-4" />}>Clear Filters</Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((site, i) => <HeritageCard key={site.id} site={site} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
}
