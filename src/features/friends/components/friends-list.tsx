"use client";

import Link from "next/link";

import { useGetFriendsQuery } from "@/features/friends/api";
import { FriendCard } from "@/features/friends/components/friend-card";
import { Friendship } from "@/features/friends/types";
import { useAppSelector } from "@/redux/hook";

import { FriendListSkeleton } from "@/components/shared/friend-skeleton";

interface FriendsListProps {
  search?: string;
}

export const FriendsList = ({ search = "" }: FriendsListProps) => {
  const currentUser = useAppSelector((state) => state.auth.user);
  const { data, isLoading } = useGetFriendsQuery({ search });

  if (isLoading) {
    return <FriendListSkeleton count={8} />;
  }

  const friendships = data?.data.data || [];

  if (friendships.length === 0) {
    return (
      <div className="rounded-md bg-buddy-card-bg p-8 text-center">
        <h3 className="mb-2 text-lg font-medium text-buddy-text-dark">No friends yet</h3>
        <p className="text-sm text-buddy-text-secondary">
          Connect with people to see them here.{" "}
          <Link href="/friends" className="text-buddy-primary hover:underline">
            Find friends
          </Link>
        </p>
      </div>
    );
  }

  const getFriendUser = (friendship: Friendship) => {
    return friendship.requesterId === currentUser?.id ? friendship.addressee : friendship.requester;
  };

  const filtered = search
    ? friendships.filter((f) => getFriendUser(f).name.toLowerCase().includes(search.toLowerCase()))
    : friendships;

  if (filtered.length === 0) {
    return (
      <div className="rounded-md bg-buddy-card-bg p-8 text-center text-buddy-text-secondary">
        No friends match &quot;{search}&quot;
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {filtered.map((friendship) => (
        <FriendCard key={friendship.id} user={getFriendUser(friendship)} action="none" />
      ))}
    </div>
  );
};
