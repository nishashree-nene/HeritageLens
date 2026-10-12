import { cn } from '../../utils/helpers';
interface Props { subtitle?: string; title: string; description?: string; align?: 'left' | 'center'; className?: string; }
export function SectionTitle({ subtitle, title, description, align = 'center', className }: Props) {
  return (
    <div className={cn('mb-12', align === 'center' ? 'text-center' : 'text-left', className)}>
      {subtitle && <p className="text-xs font-semibold tracking-[0.2em] uppercase text-yellow-500 mb-3">{subtitle}</p>}
      <h2 className="font-serif text-3xl md:text-4xl text-stone-100 mb-4">{title}</h2>
      {description && <p className="text-stone-400 text-base md:text-lg max-w-2xl leading-relaxed" style={{ margin: align === 'center' ? '0 auto' : undefined }}>{description}</p>}
      <div className={cn('mt-4 h-px w-16 gold-line', align === 'center' ? 'mx-auto' : '')} />
    </div>
  );
}
