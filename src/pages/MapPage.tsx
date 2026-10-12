import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Navigation, AlertCircle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { DEMO_SITES } from '../data/demo/heritage-sites';
import { getUserLocation, getNearbySites } from '../services/location/locationService';
import { useAppStore } from '../store/appStore';
import { getHeritageTypeIcon } from '../utils/helpers';
import type { LocationResult } from '../services/location/locationService';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function makeIcon(type: string) {
  return L.divIcon({
    html: `<div style="width:36px;height:36px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:linear-gradient(135deg,#f59e0b,#d97706);border:2px solid #0d0d0d;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(245,158,11,0.4);"><span style="transform:rotate(45deg);font-size:14px;">${getHeritageTypeIcon(type)}</span></div>`,
    className: '', iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -36],
  });
}

function makeUserIcon() {
  return L.divIcon({ html: `<div style="width:16px;height:16px;border-radius:50%;background:#3b82f6;border:3px solid white;box-shadow:0 0 0 4px rgba(59,130,246,0.3)"></div>`, className: '', iconSize: [16, 16], iconAnchor: [8, 8] });
}

function RecenterButton({ loc }: { loc: LocationResult }) {
  const map = useMap();
  return <button onClick={() => map.setView([loc.latitude, loc.longitude], 8)} className="absolute bottom-8 right-4 z-[1000] glass rounded-xl p-2.5 text-stone-300 hover:text-stone-100" aria-label="Center map"><Navigation className="h-4 w-4" /></button>;
}

export default function MapPage() {
  const { language } = useAppStore();
  const [location, setLocation] = useState<LocationResult | null>(null);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => { getUserLocation().then(setLocation); }, []);

  const nearbySites = location ? getNearbySites(location.latitude, location.longitude) : [];
  const filtered = filterType === 'all' ? DEMO_SITES : DEMO_SITES.filter((s) => s.heritage_type === filterType);
  const center: [number, number] = location ? [location.latitude, location.longitude] : [11.0168, 76.9558];

  return (
    <div className="min-h-screen pt-16 pb-24">
      <div className="px-4 sm:px-6 py-6 max-w-7xl mx-auto">
        <h1 className="font-serif text-3xl text-stone-100 mb-1">Heritage Map</h1>
        <p className="text-stone-400 text-sm">{language === 'ta' ? 'நேரடி வரைபடத்தில் பாரம்பரிய தளங்களை ஆராயுங்கள்' : 'Explore heritage sites on an interactive map'}</p>
        {location?.isDemo && (
          <div className="mt-3 flex items-center gap-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <AlertCircle className="h-4 w-4 text-blue-400 flex-shrink-0" />
            <p className="text-blue-300 text-xs">Location access disabled. Showing Tamil Nadu demo location.</p>
          </div>
        )}
      </div>
      <div className="px-4 sm:px-6 max-w-7xl mx-auto mb-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[{ id: 'all', label: 'All' }, { id: 'temple', label: '🛕 Temples' }, { id: 'fort', label: '🏰 Forts' }, { id: 'palace', label: '🏯 Palaces' }].map((f) => (
            <button key={f.id} onClick={() => setFilterType(f.id)} className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${filterType === f.id ? 'bg-yellow-500/15 border-yellow-500/40 text-yellow-400' : 'border-stone-700 text-stone-500 hover:text-stone-300'}`}>{f.label}</button>
          ))}
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-4 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex-1 relative rounded-2xl overflow-hidden border border-stone-700" style={{ height: '500px' }}>
          <MapContainer center={center} zoom={7} style={{ height: '100%', width: '100%' }}>
            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {location && <Marker position={[location.latitude, location.longitude]} icon={makeUserIcon()}><Popup><div className="text-sm">{location.isDemo ? '📍 Demo Location (Tamil Nadu)' : '📍 Your Location'}</div></Popup></Marker>}
            {filtered.map((site) => (
              <Marker key={site.id} position={[site.latitude, site.longitude]} icon={makeIcon(site.heritage_type)}>
                <Popup>
                  <div className="w-48">
                    <img src={site.featured_image} alt={site.name_en} className="w-full h-24 object-cover rounded-lg mb-2" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1590169786462-7d54566b25b1?w=200&q=80'; }} />
                    <h3 className="font-semibold text-sm text-stone-800 mb-0.5">{site.name_en}</h3>
                    <p className="text-stone-500 text-xs mb-1">{site.location_name}</p>
                    <div className="flex gap-1 mb-2">
                      {site.ar_available && <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">AR</span>}
                      {site.is_unesco && <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">UNESCO</span>}
                    </div>
                    <a href={`/heritage/${site.slug}`} className="block text-center text-xs bg-amber-500 text-white py-1.5 rounded-lg hover:bg-amber-600 transition-colors">Explore →</a>
                  </div>
                </Popup>
              </Marker>
            ))}
            {location && <RecenterButton loc={location} />}
          </MapContainer>
        </div>
        <div className="lg:w-72 space-y-3">
          <div className="flex items-center gap-2 mb-2"><Navigation className="h-4 w-4 text-yellow-500" /><h3 className="text-stone-200 font-semibold text-sm">{language === 'ta' ? 'அருகிலுள்ள பாரம்பரியம்' : 'Nearby Heritage'}</h3></div>
          {!location ? <div className="text-stone-600 text-sm">Getting location...</div> : nearbySites.slice(0, 6).map((site) => (
            <Link key={site.id} to={`/heritage/${site.slug}`}>
              <div className="heritage-card p-3 flex gap-3">
                <img src={site.featured_image} alt={site.name_en} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1590169786462-7d54566b25b1?w=100&q=80'; }} />
                <div className="flex-1 min-w-0">
                  <p className="text-stone-200 text-xs font-semibold leading-tight mb-0.5 truncate">{site.name_en}</p>
                  <p className="text-stone-500 text-xs">{site.distance.toFixed(0)} km away</p>
                  <div className="flex gap-1 mt-1">
                    {site.ar_available && <span className="text-[10px] badge-ar">AR</span>}
                    {site.model_available && <span className="text-[10px] badge-3d">3D</span>}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-stone-600 flex-shrink-0 self-center" />
              </div>
            </Link>
          ))}
          <div className="p-3 rounded-xl bg-stone-900/50 border border-stone-800 text-xs text-stone-600">Map uses free OpenStreetMap tiles. For production use Mapbox/Google Maps via VITE_MAP_API_KEY.</div>
        </div>
      </div>
    </div>
  );
}
