import { Skeleton } from "@/components/ui/skeleton";

export function PostCardSkeleton() {
  return (
    <div className="flex flex-col">
      {/* Cover Image Skeleton */}
      <Skeleton className="aspect-[16/10] w-full rounded-xl bg-border-glass" />

      <div className="pt-5">
        {/* Meta info skeleton */}
        <Skeleton className="h-3.5 w-32 rounded bg-border-glass mb-3" />

        {/* Title skeleton */}
        <div className="space-y-2 mb-3">
          <Skeleton className="h-5 w-full rounded-md bg-border-glass" />
          <Skeleton className="h-5 w-[75%] rounded-md bg-border-glass" />
        </div>

        {/* Excerpt skeleton */}
        <Skeleton className="h-3.5 w-[90%] rounded bg-border-glass" />
      </div>
    </div>
  );
}

export function PostsListSkeleton() {
  return (
    <>
      {/* Featured story skeleton */}
      <div className="grid gap-6 md:grid-cols-[1.35fr_1fr] md:gap-10 md:items-center pb-12 mb-12 border-b border-border-glass">
        <Skeleton className="aspect-[16/10] w-full rounded-xl bg-border-glass" />
        <div>
          <Skeleton className="h-3.5 w-32 rounded bg-border-glass mb-4" />
          <Skeleton className="h-8 w-full rounded-md bg-border-glass mb-3" />
          <Skeleton className="h-8 w-[70%] rounded-md bg-border-glass mb-5" />
          <Skeleton className="h-4 w-full rounded bg-border-glass mb-2" />
          <Skeleton className="h-4 w-[85%] rounded bg-border-glass" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
        <PostCardSkeleton />
        <PostCardSkeleton />
        <PostCardSkeleton />
        <PostCardSkeleton />
        <PostCardSkeleton />
        <PostCardSkeleton />
      </div>
    </>
  );
}

export function PostDetailSkeleton() {
  return (
    <div className="max-w-[720px] mx-auto px-5 md:px-8">
      {/* Breadcrumb */}
      <Skeleton className="h-4 w-56 rounded bg-border-glass mb-10" />

      <header className="mb-8">
        <Skeleton className="h-3.5 w-24 rounded bg-border-glass mb-4" />
        <div className="space-y-3 mb-6">
          <Skeleton className="h-10 w-full rounded-lg bg-border-glass" />
          <Skeleton className="h-10 w-[70%] rounded-lg bg-border-glass" />
        </div>
        <div className="space-y-2 mb-6">
          <Skeleton className="h-5 w-full rounded bg-border-glass" />
          <Skeleton className="h-5 w-[80%] rounded bg-border-glass" />
        </div>
        <Skeleton className="h-4 w-40 rounded bg-border-glass" />
      </header>

      {/* Share Actions Skeleton */}
      <div className="flex items-center gap-2 py-4 mb-8 border-y border-border-glass">
        <Skeleton className="h-9 w-9 rounded-full bg-border-glass" />
        <Skeleton className="h-9 w-9 rounded-full bg-border-glass" />
        <Skeleton className="h-9 w-9 rounded-full bg-border-glass" />
        <Skeleton className="h-9 w-9 rounded-full bg-border-glass" />
      </div>

      {/* Cover Image */}
      <Skeleton className="aspect-[16/9] w-full rounded-xl bg-border-glass mb-10" />

      {/* Content Body */}
      <div className="space-y-3 mb-8">
        <Skeleton className="h-5 w-full rounded bg-border-glass" />
        <Skeleton className="h-5 w-full rounded bg-border-glass" />
        <Skeleton className="h-5 w-[90%] rounded bg-border-glass" />
      </div>
      <Skeleton className="h-7 w-[45%] rounded bg-border-glass mb-6" />
      <div className="space-y-3">
        <Skeleton className="h-5 w-full rounded bg-border-glass" />
        <Skeleton className="h-5 w-[95%] rounded bg-border-glass" />
        <Skeleton className="h-5 w-[85%] rounded bg-border-glass" />
      </div>
    </div>
  );
}
