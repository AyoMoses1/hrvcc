import { Skeleton } from '@/components/ui/skeleton';

export default function ExploreLoading() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <Skeleton className="mb-2 h-10 w-64" />
        <Skeleton className="h-6 w-96" />
      </div>

      <div className="mb-8 space-y-4">
        <Skeleton className="h-12 w-full" />
        <div className="flex gap-4">
          <Skeleton className="h-10 w-[180px]" />
          <Skeleton className="h-10 w-[180px]" />
          <Skeleton className="h-10 w-[180px]" />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-lg border p-6">
            <Skeleton className="mb-4 h-16 w-16 rounded-full" />
            <Skeleton className="mb-2 h-6 w-32" />
            <Skeleton className="mb-3 h-4 w-full" />
            <Skeleton className="mb-4 h-4 w-24" />
            <Skeleton className="h-6 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

