"use client";

import Link from "next/link";

import { FriendsList } from "@/features/friends/components/friends-list";

export const FriendsListPage = () => {
  return (
    <div className="min-h-screen bg-buddy-page-bg pb-8">
      <div className="container mx-auto max-w-3xl px-4 pt-6">
        <div className="mb-6 flex items-center gap-2">
          <Link href="/friends" className="text-sm text-buddy-primary hover:underline">
            Friends
          </Link>
          <span className="text-sm text-buddy-text-muted">/</span>
          <h1 className="text-2xl font-semibold text-buddy-text-dark">All Friends</h1>
        </div>

        <div className="rounded-md bg-buddy-card-bg p-5 shadow-[0_4px_8px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_8px_rgba(0,0,0,0.25)]">
          <FriendsList />
        </div>
      </div>
    </div>
  );
};
