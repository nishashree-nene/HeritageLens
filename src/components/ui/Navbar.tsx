import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Compass, Map, Camera, BookOpen, Users, Info, Globe, Heart, User, Menu, X, MessageCircle, Box } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

const NAV = [
  { label: 'Explore',     labelTa: 'ஆராயுங்கள்',    href: '/explore', icon: Compass },
  { label: 'Scan',        labelTa: 'ஸ்கேன்',          href: '/scan',    icon: Camera },
  { label: 'Chat',        labelTa: 'AI வழிகாட்டி',    href: '/chat',    icon: MessageCircle },
  { label: '3D Explorer', labelTa: '3D ஆய்வு',        href: '/ar',      icon: Box },
  { label: 'Map',         labelTa: 'வரைபடம்',          href: '/map',     icon: Map },
  { label: 'Learn',       labelTa: 'கற்றுக்கொள்',     href: '/learn',   icon: BookOpen },
  { label: 'Community',   labelTa: 'சமூகம்',           href: '/community', icon: Users },
  { label: 'About',       labelTa: 'பற்றி',            href: '/about',   icon: Info },
];

export function Navbar() {
  const { language, setLanguage, favorites, user } = useAppStore();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  useEffect(() => setMobileOpen(false), [location.pathname]);

  const active = (href: string) => location.pathname === href;

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'glass border-b border-white/8' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center">
                <Eye className="h-4 w-4 text-black" />
              </div>
              <span className="font-serif font-bold text-lg">
                <span className="text-gradient-gold">Heritage</span><span className="text-stone-100">Lens</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-0.5" aria-label="Main navigation">
              {NAV.map((n) => {
                const Icon = n.icon;
                return (
                  <Link
                    key={n.href}
                    to={n.href}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      active(n.href) ? 'text-yellow-400 bg-yellow-500/10' : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
                    }`}
                    aria-current={active(n.href) ? 'page' : undefined}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {language === 'ta' ? n.labelTa : n.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right actions */}
            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-stone-400 hover:text-stone-200 hover:bg-white/5 transition-all"
                aria-label="Toggle language"
              >
                <Globe className="h-4 w-4" />
                <span className="font-medium">{language === 'en' ? 'EN' : 'தமிழ்'}</span>
              </button>
              <Link
                to="/profile"
                className="relative p-2 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-white/5 transition-all"
                aria-label="Saved favorites"
              >
                <Heart className="h-4 w-4" />
                {favorites.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-yellow-500" />
                )}
              </Link>
              <Link
                to={user ? '/profile' : '/auth'}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-stone-300 hover:text-stone-100 hover:bg-white/5 transition-all border border-stone-700/50"
              >
                <User className="h-4 w-4" />
                {user ? user.name : (language === 'ta' ? 'உள்நுழை' : 'Sign In')}
              </Link>
            </div>

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-2 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-white/5"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-white/8 bg-stone-950/95 backdrop-blur-xl overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {NAV.map((n) => {
                  const Icon = n.icon;
                  return (
                    <Link
                      key={n.href}
                      to={n.href}
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                        active(n.href) ? 'text-yellow-400 bg-yellow-500/10' : 'text-stone-300 hover:text-stone-100 hover:bg-white/5'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {language === 'ta' ? n.labelTa : n.label}
                    </Link>
                  );
                })}
                <div className="pt-2 px-3 border-t border-stone-800 mt-2">
                  <button
                    onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
                    className="flex items-center gap-2 py-2 text-sm text-stone-400"
                  >
                    <Globe className="h-4 w-4" />
                    {language === 'en' ? 'Switch to Tamil' : 'Switch to English'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-white/8" aria-label="Mobile navigation">
        <div className="flex items-center justify-around px-2 py-2">
          <Link to="/" className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${active('/') ? 'text-yellow-400' : 'text-stone-500'}`}>
            <Eye className="h-5 w-5" /><span className="text-[10px] font-medium">Home</span>
          </Link>
          <Link to="/explore" className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${active('/explore') ? 'text-yellow-400' : 'text-stone-500'}`}>
            <Compass className="h-5 w-5" /><span className="text-[10px] font-medium">Explore</span>
          </Link>
          {/* FAB Scan button */}
          <Link to="/scan" className="flex flex-col items-center gap-1 -mt-4" aria-label="Scan a monument">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center shadow-lg shadow-yellow-500/30 animate-pulse-gold">
              <Camera className="h-6 w-6 text-black" />
            </div>
            <span className="text-[10px] font-semibold text-yellow-500">Scan</span>
          </Link>
          <Link to="/chat" className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${active('/chat') ? 'text-yellow-400' : 'text-stone-500'}`}>
            <MessageCircle className="h-5 w-5" /><span className="text-[10px] font-medium">Chat</span>
          </Link>
          <Link to="/profile" className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${active('/profile') ? 'text-yellow-400' : 'text-stone-500'}`}>
            <User className="h-5 w-5" /><span className="text-[10px] font-medium">Profile</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
