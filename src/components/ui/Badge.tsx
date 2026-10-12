import { cn } from '../../utils/helpers';
import type { ReactNode } from 'react';

interface BadgeProps { variant?: 'ar' | '3d' | 'unesco' | 'gold' | 'green' | 'blue' | 'red' | 'stone'; children: ReactNode; className?: string; }

export function Badge({ variant = 'stone', children, className }: BadgeProps) {
  const variants = {
    ar: 'badge-ar', '3d': 'badge-3d', unesco: 'badge-unesco', gold: 'badge-gold',
    green: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 rounded-md px-2 py-0.5 text-xs font-semibold tracking-wide uppercase',
    blue: 'bg-blue-500/15 text-blue-400 border border-blue-500/25 rounded-md px-2 py-0.5 text-xs font-semibold tracking-wide uppercase',
    red: 'bg-red-500/15 text-red-400 border border-red-500/25 rounded-md px-2 py-0.5 text-xs font-semibold tracking-wide uppercase',
    stone: 'bg-stone-700/50 text-stone-300 border border-stone-600/30 rounded-md px-2 py-0.5 text-xs font-semibold tracking-wide uppercase',
  };
  return <span className={cn('inline-flex items-center gap-1', variants[variant], className)}>{children}</span>;
}
