import { Link } from 'react-router-dom';
import { Eye, Mail, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-stone-800 bg-stone-950 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center">
                <Eye className="h-4 w-4 text-black" />
              </div>
              <span className="font-serif font-bold text-lg"><span className="text-gradient-gold">Heritage</span><span className="text-stone-100">Lens</span></span>
            </Link>
            <p className="text-stone-500 text-sm leading-relaxed max-w-sm">Discover, experience and preserve cultural heritage with AI, augmented reality and immersive storytelling.</p>
            <p className="text-stone-600 text-xs mt-4 italic">"See the Past. Understand the Present. Preserve the Future."</p>
            <div className="mt-4 flex items-center gap-3">
              <a href="#" className="p-2 rounded-lg text-stone-600 hover:text-stone-300 hover:bg-white/5 transition-colors" aria-label="Contact"><Mail className="h-4 w-4" /></a>
            </div>
          </div>
          <div>
            <h4 className="text-stone-300 font-semibold text-sm mb-4">Explore</h4>
            <ul className="space-y-2.5">
              {[['Heritage Sites', '/explore'], ['Interactive Map', '/map'], ['Scan a Site', '/scan'], ['AR Experience', '/ar']].map(([l, h]) => (
                <li key={l}><Link to={h} className="text-stone-500 hover:text-stone-300 text-sm transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-stone-300 font-semibold text-sm mb-4">Preserve</h4>
            <ul className="space-y-2.5">
              {[['Community', '/community'], ['Learn', '/learn'], ['Admin', '/admin'], ['About', '/about']].map(([l, h]) => (
                <li key={l}><Link to={h} className="text-stone-500 hover:text-stone-300 text-sm transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="gold-line mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-stone-600 text-xs">© 2024 HeritageLens. Built for cultural heritage preservation.</p>
          <p className="text-stone-600 text-xs flex items-center gap-1">Preserving heritage with <Heart className="h-3 w-3 text-yellow-600" /> for Tamil Nadu</p>
        </div>
        <div className="mt-6 p-4 rounded-xl bg-stone-900/50 border border-stone-800">
          <p className="text-stone-600 text-xs leading-relaxed"><strong className="text-stone-500">Demo Notice:</strong> This is a prototype. Heritage content is based on publicly available historical records. Digital reconstructions are labeled with confidence levels and should not be treated as confirmed historical records unless explicitly verified by heritage experts.</p>
        </div>
      </div>
    </footer>
  );
}
