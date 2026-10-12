import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../utils/helpers';

interface ModalProps { open: boolean; onClose: () => void; title?: string; children: React.ReactNode; size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string; }

export function Modal({ open, onClose, title, children, size = 'md', className }: ModalProps) {
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [open]);
  useEffect(() => { const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); }; window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h); }, [onClose]);
  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ duration: 0.2 }} className={cn('relative w-full glass rounded-2xl overflow-hidden', sizes[size], className)}>
            {title && (
              <div className="flex items-center justify-between border-b border-white/8 px-6 py-4">
                <h2 className="font-serif text-lg text-stone-100">{title}</h2>
                <button onClick={onClose} className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-white/5 transition-colors" aria-label="Close"><X className="h-5 w-5" /></button>
              </div>
            )}
            {!title && <button onClick={onClose} className="absolute top-4 right-4 z-10 p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-white/5" aria-label="Close"><X className="h-5 w-5" /></button>}
            <div className="overflow-y-auto max-h-[80vh]">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
