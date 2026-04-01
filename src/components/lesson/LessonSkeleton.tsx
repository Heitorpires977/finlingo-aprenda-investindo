import { Skeleton } from '@/components/ui/skeleton';

export function LessonSkeleton() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header skeleton */}
      <div className="sticky top-0 bg-card border-b px-4 py-3 space-y-2 z-40">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-6 rounded" />
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-5 rounded-full" />
            ))}
          </div>
        </div>
        <Skeleton className="h-3 w-full rounded-full" />
      </div>

      {/* Content skeleton */}
      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-8 space-y-6">
        <Skeleton className="h-7 w-3/4 rounded" />
        <div className="space-y-3">
          <Skeleton className="h-14 w-full rounded-2xl" />
          <Skeleton className="h-14 w-full rounded-2xl" />
          <Skeleton className="h-14 w-full rounded-2xl" />
          <Skeleton className="h-14 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
