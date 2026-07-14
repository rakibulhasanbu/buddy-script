"use client";

import { useGetSuggestionsQuery, useSendFriendRequestMutation } from "@/features/friends/api";
import { FriendCard } from "@/features/friends/components/friend-card";
import { toast } from "sonner";

import { FriendListSkeleton } from "@/components/shared/friend-skeleton";

interface SuggestionsListProps {
  search?: string;
}

export const SuggestionsList = ({ search = "" }: SuggestionsListProps) => {
  const { data, isLoading } = useGetSuggestionsQuery();
  const [sendRequest, { isLoading: isSending }] = useSendFriendRequestMutation();

  const suggestions = data?.data.data || [];

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

  const filtered = search
    ? suggestions.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()))
    : suggestions;

  if (filtered.length === 0) {
    return (
      <div className="rounded-md bg-buddy-card-bg p-6 text-center text-buddy-text-secondary">
        No suggestions match &quot;{search}&quot;
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {filtered.map((user) => (
        <FriendCard
          key={user.id}
          user={user}
          action="connect"
          isLoading={isSending}
          onConnect={() => handleConnect(user.id)}
        />
      ))}
    </div>
  );
};
