import { Skeleton } from "@/components/ui/skeleton";

export const NotificationSkeleton = () => (
  <div className="flex items-start gap-3 px-4 py-3">
    <Skeleton className="h-10 w-10 rounded-full" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-3 w-20" />
    </div>
  </div>
);

interface NotificationListSkeletonProps {
  count?: number;
}

export const NotificationListSkeleton = ({ count = 5 }: NotificationListSkeletonProps) => (
  <div>
    {Array.from({ length: count }).map((_, i) => (
      <NotificationSkeleton key={i} />
    ))}
  </div>
);
