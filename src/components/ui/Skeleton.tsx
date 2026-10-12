import { cn } from '../../utils/helpers';
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton', className)} />;
}
export function SkeletonCard() {
  return (
    <div className="heritage-card p-0 overflow-hidden">
      <Skeleton className="h-52 w-full rounded-b-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-5/6" />
        <div className="flex gap-2 pt-1"><Skeleton className="h-6 w-12" /><Skeleton className="h-6 w-10" /></div>
      </div>
    </div>
  );
}
