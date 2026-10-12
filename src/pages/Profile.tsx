import { Link } from 'react-router-dom';
import { Star, MapPin, BookOpen, Heart, ChevronRight } from 'lucide-react';
import { DEMO_BADGES } from '../data/demo/badges';
import { DEMO_SITES } from '../data/demo/heritage-sites';
import { useAppStore } from '../store/appStore';

export default function Profile() {
  const { user, visitedSites, favorites, quizScores, earnedBadges, points, language } = useAppStore();
  const visitedData = DEMO_SITES.filter((s) => visitedSites.includes(s.id));
  const favData = DEMO_SITES.filter((s) => favorites.includes(s.id));
  const totalQuizzes = Object.keys(quizScores).length;
  const displayName = user?.name || 'Heritage Explorer';

  return (
    <div className="min-h-screen pt-20 pb-24 max-w-2xl mx-auto px-4 sm:px-6">
      <div className="heritage-card p-6 mb-6 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center text-3xl mx-auto mb-4">🏛️</div>
        <h1 className="font-serif text-2xl text-stone-100 mb-1">{displayName}</h1>
        <p className="text-stone-500 text-sm capitalize mb-3">{user?.role || 'visitor'}</p>
        <div className="flex items-center justify-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-500/15 border border-yellow-500/25"><Star className="h-3.5 w-3.5 text-yellow-400" /><span className="text-yellow-300 text-sm font-bold">{points} pts</span></div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[{ icon: MapPin, label: 'Sites Explored', value: visitedSites.length, color: 'text-yellow-400' }, { icon: BookOpen, label: 'Quizzes Done', value: totalQuizzes, color: 'text-blue-400' }, { icon: Heart, label: 'Favorites', value: favorites.length, color: 'text-rose-400' }].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="heritage-card p-4 text-center"><Icon className={`h-5 w-5 ${color} mx-auto mb-2`} /><div className="text-2xl font-bold text-stone-100">{value}</div><div className="text-stone-500 text-xs">{label}</div></div>
        ))}
      </div>

      <div className="heritage-card p-5 mb-6">
        <div className="flex items-center justify-between mb-4"><h2 className="font-serif text-stone-100 text-lg">Badges</h2><span className="text-stone-500 text-xs">{earnedBadges.length}/{DEMO_BADGES.length}</span></div>
        <div className="grid grid-cols-4 gap-3">
          {DEMO_BADGES.map((badge) => {
            const earned = earnedBadges.includes(badge.id);
            return (
              <div key={badge.id} title={badge.name} className={`flex flex-col items-center p-2 rounded-xl transition-all ${earned ? 'bg-yellow-500/10 border border-yellow-500/20' : 'opacity-30 bg-stone-900'}`}>
                <span className="text-2xl mb-1">{badge.icon}</span>
                <span className="text-[10px] text-center text-stone-400 leading-tight">{badge.name}</span>
              </div>
            );
          })}
        </div>
        {earnedBadges.length === 0 && <p className="text-stone-600 text-xs text-center mt-2">Explore sites and complete quizzes to earn badges!</p>}
      </div>

      <div className="heritage-card p-5 mb-6">
        <h2 className="font-serif text-stone-100 text-lg mb-4">Sites Explored</h2>
        {visitedData.length === 0 ? (
          <div className="text-center py-6"><p className="text-stone-600 text-sm mb-3">No sites visited yet.</p><Link to="/explore" className="text-yellow-500 text-sm hover:text-yellow-400">Explore Heritage →</Link></div>
        ) : (
          <div className="space-y-3">
            {visitedData.map((site) => (
              <Link key={site.id} to={`/heritage/${site.slug}`}>
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/3 transition-colors">
                  <img src={site.featured_image} alt={site.name_en} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1590169786462-7d54566b25b1?w=100&q=80'; }} />
                  <div className="flex-1 min-w-0"><p className="text-stone-200 text-sm font-semibold truncate">{language === 'ta' ? site.name_ta : site.name_en}</p><p className="text-stone-500 text-xs">{site.location_name}</p></div>
                  <ChevronRight className="h-4 w-4 text-stone-600" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="heritage-card p-5">
        <h2 className="font-serif text-stone-100 text-lg mb-4">Saved Sites</h2>
        {favData.length === 0 ? (
          <p className="text-stone-600 text-sm text-center py-4">No favorites yet. Heart a site to save it.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {favData.map((site) => (
              <Link key={site.id} to={`/heritage/${site.slug}`}>
                <div className="relative rounded-xl overflow-hidden h-28 group">
                  <img src={site.featured_image} alt={site.name_en} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1590169786462-7d54566b25b1?w=200&q=80'; }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <p className="absolute bottom-2 left-2 right-2 text-xs text-stone-200 font-semibold leading-tight">{site.name_en.split(',')[0]}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
