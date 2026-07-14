"use client";

import Link from "next/link";

import { useGetFriendsQuery } from "@/features/friends/api";
import { FriendCard } from "@/features/friends/components/friend-card";
import { Friendship } from "@/features/friends/types";
import { useAppSelector } from "@/redux/hook";

import { Spinner } from "@/components/ui/spinner";

export const FriendsList = () => {
  const currentUser = useAppSelector((state) => state.auth.user);
  const { data, isLoading } = useGetFriendsQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner className="h-8 w-8" />
      </div>
    );
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

  return (
    <div className="space-y-3">
      {friendships.map((friendship) => (
        <FriendCard key={friendship.id} user={getFriendUser(friendship)} action="none" />
      ))}
    </div>
  );
};
