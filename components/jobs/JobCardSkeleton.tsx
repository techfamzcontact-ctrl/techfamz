import { Skeleton } from "@/components/ui/skeleton";

export function JobCardSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 py-6 px-2 sm:px-4">
      {/* Left: Company monogram */}
      <Skeleton className="shrink-0 w-12 h-12 rounded-lg bg-border-glass" />

      {/* Middle: Job Details */}
      <div className="flex-1 min-w-0">
        <Skeleton className="h-5 w-3/4 max-w-[300px] rounded-md mb-3 bg-border-glass" />
        <div className="flex gap-4">
          <Skeleton className="h-3.5 w-24 rounded bg-border-glass" />
          <Skeleton className="h-3.5 w-32 rounded bg-border-glass" />
        </div>
      </div>

      {/* Right: Tags */}
      <div className="flex items-center gap-3 shrink-0">
        <Skeleton className="h-6 w-20 rounded-md bg-border-glass" />
        <Skeleton className="h-5 w-5 rounded bg-border-glass" />
      </div>
    </div>
  );
}

export function JobDetailSkeleton() {
  return (
    <div className="max-w-[820px] mx-auto px-5 md:px-8">
      <Skeleton className="h-4 w-36 rounded bg-border-glass mb-8" />

      {/* Job Header Skeleton */}
      <div className="bg-bg-card border border-border-glass rounded-xl p-6 md:p-10 mb-8">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <Skeleton className="shrink-0 w-14 h-14 rounded-lg bg-border-glass" />

          <div className="flex-1 w-full">
            <Skeleton className="h-9 w-3/4 max-w-[400px] rounded-lg mb-3 bg-border-glass" />
            <Skeleton className="h-5 w-1/3 max-w-[200px] rounded-md mb-6 bg-border-glass" />

            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <Skeleton className="h-4 w-24 rounded bg-border-glass" />
              <Skeleton className="h-4 w-20 rounded bg-border-glass" />
              <Skeleton className="h-4 w-32 rounded bg-border-glass" />
              <Skeleton className="h-4 w-28 rounded bg-border-glass" />
            </div>
          </div>
        </div>

        {/* Apply Button Skeleton */}
        <div className="mt-8 pt-6 border-t border-border-glass">
          <Skeleton className="h-11 w-36 rounded-lg bg-border-glass" />
        </div>
      </div>

      {/* Job Description Skeleton */}
      <div className="px-1">
        <Skeleton className="h-7 w-48 rounded-md mb-8 bg-border-glass" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-full rounded bg-border-glass" />
          <Skeleton className="h-4 w-full rounded bg-border-glass" />
          <Skeleton className="h-4 w-[90%] rounded bg-border-glass" />
          <div className="pt-4 space-y-3">
            <Skeleton className="h-4 w-full rounded bg-border-glass" />
            <Skeleton className="h-4 w-[85%] rounded bg-border-glass" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function JobsListSkeleton() {
  return (
    <div className="flex flex-col w-full divide-y divide-border-glass border-y border-border-glass">
      <JobCardSkeleton />
      <JobCardSkeleton />
      <JobCardSkeleton />
      <JobCardSkeleton />
      <JobCardSkeleton />
    </div>
  );
}
