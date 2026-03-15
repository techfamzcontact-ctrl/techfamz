import { Skeleton } from "@/components/ui/skeleton";

export function PostCardSkeleton() {
  return (
    <div className="flex flex-col bg-bg-card border border-border-glass rounded-2xl overflow-hidden backdrop-blur-md transition-all duration-400">
      {/* Cover Image Skeleton */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[rgba(0,0,0,0.3)]">
        <Skeleton className="absolute inset-0 rounded-none bg-border-glass" />
      </div>
      
      <div className="flex flex-col flex-1 p-6 md:p-8 relative">
        {/* Meta info skeleton */}
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="h-4 w-20 rounded bg-border-glass" />
          <Skeleton className="h-1 w-1 rounded-full bg-border-glass" />
          <Skeleton className="h-4 w-24 rounded bg-border-glass" />
        </div>
        
        {/* Title skeleton */}
        <div className="space-y-2 mb-6 flex-1">
          <Skeleton className="h-7 w-full rounded-md bg-border-glass" />
          <Skeleton className="h-7 w-[80%] rounded-md bg-border-glass" />
        </div>
        
        {/* Read Article link skeleton */}
        <div className="mt-auto pt-4 border-t border-border-glass/50">
          <Skeleton className="h-5 w-28 rounded bg-border-glass" />
        </div>
      </div>
    </div>
  );
}

export function PostsListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      <PostCardSkeleton />
      <PostCardSkeleton />
      <PostCardSkeleton />
      <PostCardSkeleton />
      <PostCardSkeleton />
      <PostCardSkeleton />
    </div>
  );
}

export function PostDetailSkeleton() {
  return (
    <div className="w-full">
      <header className="mb-10 text-center max-w-[800px] mx-auto">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Skeleton className="h-5 w-24 rounded bg-border-glass" />
          <Skeleton className="h-1 w-1 rounded-full bg-border-glass" />
          <Skeleton className="h-5 w-32 rounded bg-border-glass" />
        </div>
        
        <div className="space-y-4 mb-4 flex flex-col items-center">
          <Skeleton className="h-[3rem] w-[90%] rounded-xl bg-border-glass" />
          <Skeleton className="h-[3rem] w-[70%] rounded-xl bg-border-glass" />
        </div>
        
        <div className="mt-6 flex flex-col items-center space-y-2">
          <Skeleton className="h-5 w-[80%] rounded bg-border-glass" />
          <Skeleton className="h-5 w-[60%] rounded bg-border-glass" />
        </div>
      </header>

      {/* Share Actions Skeleton */}
      <div className="flex justify-center gap-4 pb-4 mb-4 border-b border-border-glass">
        <Skeleton className="h-10 w-10 rounded-full bg-border-glass" />
        <Skeleton className="h-10 w-10 rounded-full bg-border-glass" />
        <Skeleton className="h-10 w-10 rounded-full bg-border-glass" />
        <Skeleton className="h-10 w-10 rounded-full bg-border-glass" />
      </div>

      {/* Cover Image */}
      <div className="relative aspect-[16/9] w-full rounded-none overflow-hidden mb-8 bg-border-glass/50 shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-border-glass">
        <Skeleton className="absolute inset-0 rounded-none bg-border-glass" />
      </div>

      {/* Content Body */}
      <div className="prose dark:prose-invert prose-base md:prose-lg max-w-none">
        <Skeleton className="h-8 w-[40%] rounded mb-8 bg-border-glass" />
        
        <div className="space-y-4 mb-8">
          <Skeleton className="h-5 w-full rounded bg-border-glass" />
          <Skeleton className="h-5 w-full rounded bg-border-glass" />
          <Skeleton className="h-5 w-full rounded bg-border-glass" />
          <Skeleton className="h-5 w-[90%] rounded bg-border-glass" />
        </div>

        <Skeleton className="h-8 w-[50%] rounded mb-6 bg-border-glass" />
        
        <div className="space-y-4 mb-8">
          <Skeleton className="h-5 w-full rounded bg-border-glass" />
          <Skeleton className="h-5 w-[95%] rounded bg-border-glass" />
          <Skeleton className="h-5 w-[85%] rounded bg-border-glass" />
        </div>
      </div>
    </div>
  );
}
