import { Skeleton } from "@/components/ui/skeleton";

export function JobCardSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-6 md:p-8 bg-bg-card border border-border-glass rounded-2xl  transition-all duration-300">
      {/* Left: Company Logo Badge */}
      <Skeleton className="shrink-0 w-14 h-14 rounded-xl bg-border-glass" />

      {/* Middle: Job Details */}
      <div className="flex-1 min-w-0">
        <Skeleton className="h-6 w-3/4 max-w-[300px] rounded-lg mb-4 bg-border-glass" />
        <div className="flex gap-4">
          <Skeleton className="h-4 w-24 rounded-md bg-border-glass" />
          <Skeleton className="h-4 w-32 rounded-md bg-border-glass" />
        </div>
      </div>

      {/* Right: Tags */}
      <div className="flex items-center gap-3 shrink-0">
        <Skeleton className="h-6 w-20 rounded-full bg-border-glass" />
        <Skeleton className="hidden md:block h-6 w-24 rounded-full bg-border-glass" />
        <Skeleton className="h-6 w-6 rounded-md bg-border-glass" />
      </div>
    </div>
  );
}

export function JobDetailSkeleton() {
  return (
    <div className="w-full">
      {/* Job Header Card Skeleton */}
      <div className="bg-bg-card border border-border-glass rounded-2xl  p-8 md:p-10 mb-8">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Company Badge Skeleton */}
          <Skeleton className="shrink-0 w-16 h-16 rounded-xl bg-border-glass" />

          <div className="flex-1 w-full">
            <Skeleton className="h-10 w-3/4 max-w-[400px] rounded-lg mb-4 bg-border-glass" />
            <Skeleton className="h-6 w-1/3 max-w-[200px] rounded-md mb-6 bg-border-glass" />

            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <Skeleton className="h-5 w-24 rounded-md bg-border-glass" />
              <Skeleton className="h-5 w-20 rounded-md bg-border-glass" />
              <Skeleton className="h-5 w-32 rounded-md bg-border-glass" />
              <Skeleton className="h-5 w-28 rounded-md bg-border-glass" />
            </div>
          </div>
        </div>

        {/* Apply Button Skeleton */}
        <div className="mt-8 pt-6 border-t border-border-glass">
          <Skeleton className="h-12 w-36 rounded-xl bg-border-glass" />
        </div>
      </div>

      {/* Job Description Skeleton */}
      <div className="bg-bg-card border border-border-glass rounded-2xl  p-8 md:p-10">
        <Skeleton className="h-8 w-48 rounded-md mb-8 bg-border-glass" />
        
        <div className="space-y-4">
          <Skeleton className="h-4 w-full rounded bg-border-glass" />
          <Skeleton className="h-4 w-full rounded bg-border-glass" />
          <Skeleton className="h-4 w-[90%] rounded bg-border-glass" />
          <Skeleton className="h-4 w-[95%] rounded bg-border-glass" />
          <div className="pt-4 space-y-4">
            <Skeleton className="h-4 w-full rounded bg-border-glass" />
            <Skeleton className="h-4 w-[85%] rounded bg-border-glass" />
            <Skeleton className="h-4 w-full rounded bg-border-glass" />
          </div>
        </div>

        {/* Bottom Apply CTA Skeleton */}
        <div className="mt-10 pt-6 border-t border-border-glass flex items-center justify-between">
          <Skeleton className="h-5 w-40 rounded bg-border-glass" />
          <Skeleton className="h-10 w-32 rounded-lg bg-border-glass" />
        </div>
      </div>
    </div>
  );
}export function JobsListSkeleton() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <JobCardSkeleton />
      <JobCardSkeleton />
      <JobCardSkeleton />
      <JobCardSkeleton />
      <JobCardSkeleton />
    </div>
  );
}
