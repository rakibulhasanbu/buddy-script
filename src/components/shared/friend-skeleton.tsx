import { Skeleton } from "@/components/ui/skeleton";

import { Card, CardContent } from "@/components/ui/card";

export const FriendCardSkeleton = () => (
  <Card className="items-center text-center">
    <CardContent className="flex flex-col items-center gap-3 pt-4">
      <Skeleton className="h-20 w-20 rounded-full" />
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-9 w-full rounded-full" />
    </CardContent>
  </Card>
);

export const FriendCardRowSkeleton = () => (
  <div className="flex items-center justify-between rounded-md bg-buddy-card-bg p-4 shadow-[0_2px_4px_rgba(0,0,0,0.04)]">
    <div className="flex items-center gap-3">
      <Skeleton className="h-12 w-12 rounded-full" />
      <Skeleton className="h-4 w-32" />
    </div>
    <Skeleton className="h-9 w-24 rounded-md" />
  </div>
);

interface FriendListSkeletonProps {
  count?: number;
}

export const FriendListSkeleton = ({ count = 5 }: FriendListSkeletonProps) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    {Array.from({ length: count }).map((_, i) => (
      <FriendCardSkeleton key={i} />
    ))}
  </div>
);

export const FriendRowListSkeleton = ({ count = 5 }: FriendListSkeletonProps) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <FriendCardRowSkeleton key={i} />
    ))}
  </div>
);
