"use client";

import { useGetSuggestionsQuery, useSendFriendRequestMutation } from "@/features/friends/api";
import { FriendCard } from "@/features/friends/components/friend-card";
import { toast } from "sonner";

import { FriendListSkeleton } from "@/components/shared/friend-skeleton";
import { CustomPagination } from "@/components/custom-ui/custom-pagination";

interface SuggestionsListProps {
  search?: string;
}

export const SuggestionsList = ({ search = "" }: SuggestionsListProps) => {
  const { data, isLoading } = useGetSuggestionsQuery({
    searchTerm: search,
  });
  const [sendRequest, { isLoading: isSending }] = useSendFriendRequestMutation({});

  const suggestions = data?.data || [];

  const handleConnect = async (addresseeId: string) => {
    try {
      await sendRequest({ addresseeId }).unwrap();
      toast.success("Friend request sent");
    } catch {
      toast.error("Failed to send friend request");
    }
  };

  if (isLoading) {
    return <FriendListSkeleton count={4} />;
  }

  if (suggestions.length === 0) {
    return (
      <div className="rounded-md bg-buddy-card-bg p-6 text-center text-buddy-text-secondary">
        No suggestions right now.
      </div>
    );
  }

  const paginationMeta = data?.meta || {
    page: 1,
    total: 20,
    limit: 20,
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {suggestions.map((user) => (
        <FriendCard
          key={user.id}
          user={user}
          action="connect"
          isLoading={isSending}
          onConnect={() => handleConnect(user.id)}
        />
      ))}

      <CustomPagination paginationMeta={paginationMeta} />
    </div>
  );
};
