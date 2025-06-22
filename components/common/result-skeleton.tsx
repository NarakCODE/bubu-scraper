// app/components/loader/result-skeleton.tsx

import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export const ResultSkeleton = () => {
  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="text-center space-y-4 flex flex-col items-center">
          <Skeleton className="h-10 w-3/5 rounded-lg" />
          <Skeleton className="h-6 w-4/5 rounded-lg" />
        </div>

        <Separator />

        {/* Tabs Skeleton */}
        <div className="w-full">
          {/* TabsList Skeleton */}
          <div className="grid w-full grid-cols-6 gap-2">
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          {/* TabsContent Skeleton (mimicking a card) */}
          <div className="mt-6 border rounded-xl p-6 space-y-4">
            {/* CardHeader Skeleton */}
            <div className="space-y-3">
              <Skeleton className="h-6 w-1/4 rounded-lg" />
              <Skeleton className="h-4 w-2/5 rounded-lg" />
            </div>
            {/* CardContent Skeleton (mimicking an image grid) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <Skeleton className="aspect-square w-full rounded-lg" />
              <Skeleton className="aspect-square w-full rounded-lg" />
              <Skeleton className="aspect-square w-full rounded-lg" />
              <Skeleton className="aspect-square w-full rounded-lg" />
              <Skeleton className="aspect-square w-full rounded-lg" />
              <Skeleton className="aspect-square w-full rounded-lg" />
              <Skeleton className="aspect-square w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
