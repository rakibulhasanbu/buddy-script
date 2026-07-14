import { Skeleton } from "@/components/ui/skeleton";
import { PostSkeleton } from "@/components/shared/post-skeleton";

export const ProfileSkeleton = () => (
  <div className="min-h-screen bg-buddy-page-bg pb-8">
    <div className="container mx-auto max-w-4xl px-4 pt-6">
      <div className="mb-6 rounded-md bg-buddy-card-bg p-6 shadow-[0_4px_8px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-4">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="space-y-4">
          <div className="rounded-md bg-buddy-card-bg p-5 shadow-[0_4px_8px_rgba(0,0,0,0.08)]">
            <Skeleton className="mb-4 h-5 w-16" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-3/4" />
          </div>
        </div>
        <div>
          <Skeleton className="mb-4 h-12 w-full rounded-md" />
          <PostSkeleton />
        </div>
      </div>
    </div>
  </div>
);
