import { cn } from '../../utils/helpers';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'ghost' | 'outline' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
  children?: ReactNode;
}

export function Button({ variant = 'ghost', size = 'md', loading = false, icon, iconRight, children, className, disabled, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    gold: 'btn-gold',
    ghost: 'btn-ghost',
    outline: 'border border-stone-600 text-stone-200 hover:border-yellow-500/50 hover:text-yellow-400 rounded-xl bg-transparent',
    danger: 'bg-red-500/10 text-red-400 border border-red-500/25 hover:bg-red-500/20 rounded-xl',
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/20 rounded-xl',
  };
  const sizes = { sm: 'px-3 py-1.5 text-xs rounded-lg', md: 'px-5 py-2.5 text-sm rounded-xl', lg: 'px-7 py-3.5 text-base rounded-xl' };
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} disabled={disabled || loading} {...props}>
      {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : icon}
      {children}
      {!loading && iconRight}
    </button>
  );
}
