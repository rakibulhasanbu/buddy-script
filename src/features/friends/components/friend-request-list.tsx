"use client";

import {
  useAcceptFriendRequestMutation,
  useDeclineFriendRequestMutation,
  useGetPendingRequestsQuery,
} from "@/features/friends/api";
import { FriendCard } from "@/features/friends/components/friend-card";
import { toast } from "sonner";

import { FriendListSkeleton } from "@/components/shared/friend-skeleton";

export const FriendRequestList = () => {
  const { data, isLoading } = useGetPendingRequestsQuery();
  const [acceptRequest, { isLoading: isAccepting }] = useAcceptFriendRequestMutation();
  const [declineRequest, { isLoading: isDeclining }] = useDeclineFriendRequestMutation();

  const requests = data?.data.data || [];

  const handleAccept = async (id: string) => {
    try {
      await acceptRequest(id).unwrap();
      toast.success("Friend request accepted");
    } catch {
      toast.error("Failed to accept request");
    }
  };

  const handleDecline = async (id: string) => {
    try {
      await declineRequest(id).unwrap();
      toast.success("Friend request declined");
    } catch {
      toast.error("Failed to decline request");
    }
  };

  if (isLoading) {
    return <FriendListSkeleton count={3} />;
  }

  if (requests.length === 0) {
    return (
      <div className="rounded-md bg-buddy-card-bg p-6 text-center text-buddy-text-secondary">
        No pending friend requests.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((friendship) => (
        <FriendCard
          key={friendship.id}
          user={friendship.requester}
          action="accept-decline"
          isLoading={isAccepting || isDeclining}
          onAccept={() => handleAccept(friendship.id)}
          onDecline={() => handleDecline(friendship.id)}
        />
      ))}
    </div>
  );
};
