import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Heart, ArrowRight, Cpu, Box } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { useAppStore } from '../../store/appStore';
import { getPreservationColor, getPreservationLabel, getHeritageTypeIcon, truncateText } from '../../utils/helpers';
import type { HeritageSite } from '../../types';

export function HeritageCard({ site, index = 0 }: { site: HeritageSite; index?: number }) {
  const { language, isFavorite, addFavorite, removeFavorite } = useAppStore();
  const name = language === 'ta' ? site.name_ta : site.name_en;
  const description = language === 'ta' ? site.description_ta : site.description_en;
  const fav = isFavorite(site.id);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07, duration: 0.4 }}>
      <Link to={`/heritage/${site.slug}`} className="block heritage-card overflow-hidden group h-full" aria-label={`Explore ${name}`}>
        <div className="relative overflow-hidden h-52">
          <img src={site.featured_image} alt={name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1590169786462-7d54566b25b1?w=600&q=80'; }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {site.is_unesco && <Badge variant="unesco">UNESCO</Badge>}
            {site.ar_available && <Badge variant="ar"><Cpu className="h-2.5 w-2.5" />AR</Badge>}
            {site.model_available && <Badge variant="3d"><Box className="h-2.5 w-2.5" />3D</Badge>}
          </div>
          <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); fav ? removeFavorite(site.id) : addFavorite(site.id); }}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-all" aria-label={fav ? 'Remove favorite' : 'Add favorite'}>
            <Heart className={`h-4 w-4 transition-colors ${fav ? 'text-yellow-400 fill-yellow-400' : 'text-white'}`} />
          </button>
          <div className="absolute bottom-3 left-3"><span className="text-lg">{getHeritageTypeIcon(site.heritage_type)}</span></div>
        </div>
        <div className="p-4">
          <h3 className="font-serif text-stone-100 font-semibold text-base leading-snug mb-1">{name}</h3>
          <div className="flex items-center gap-1.5 text-stone-500 text-xs mb-1"><MapPin className="h-3 w-3 flex-shrink-0" /><span>{site.location_name}</span></div>
          <div className="flex items-center gap-1.5 text-stone-600 text-xs mb-3"><Calendar className="h-3 w-3 flex-shrink-0" /><span>{site.historical_period}</span></div>
          <p className="text-stone-500 text-xs leading-relaxed mb-3">{truncateText(description, 110)}</p>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${getPreservationColor(site.preservation_status)}`}>● {getPreservationLabel(site.preservation_status, language)}</span>
            <span className="flex items-center gap-1 text-xs text-yellow-500 font-semibold group-hover:gap-2 transition-all">{language === 'ta' ? 'ஆராயுங்கள்' : 'Explore'}<ArrowRight className="h-3 w-3" /></span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
