"use client";

import { useGetSuggestionsQuery, useSendFriendRequestMutation } from "@/features/friends/api";
import { FriendCard } from "@/features/friends/components/friend-card";
import { toast } from "sonner";

export const SuggestionsList = () => {
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
    return <div className="py-4 text-center text-[#666666]">Loading suggestions...</div>;
  }

  if (suggestions.length === 0) {
    return <div className="rounded-md bg-white p-6 text-center text-[#666666]">No suggestions right now.</div>;
  }

  return (
    <div className="space-y-3">
      {suggestions.map((user) => (
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
