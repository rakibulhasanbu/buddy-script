import { Skeleton } from "@/components/ui/skeleton";

export const PostSkeleton = () => (
  <div className="mb-4 rounded-md bg-buddy-card-bg px-6 pt-6 pb-6 shadow-[0_2px_4px_rgba(0,0,0,0.04)]">
    <div className="mb-4 flex items-center gap-3">
      <Skeleton className="h-11 w-11 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
    <div className="mb-4 space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
    <Skeleton className="mb-6 h-64 w-full rounded-md" />
    <div className="flex justify-between">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-24" />
    </div>
  </div>
);

interface PostListSkeletonProps {
  count?: number;
}

export const PostListSkeleton = ({ count = 3 }: PostListSkeletonProps) => (
  <div>
    {Array.from({ length: count }).map((_, i) => (
      <PostSkeleton key={i} />
    ))}
  </div>
);
