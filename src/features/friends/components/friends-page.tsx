"use client";

import Link from "next/link";

import { FriendRequestList } from "@/features/friends/components/friend-request-list";
import { FriendsList } from "@/features/friends/components/friends-list";
import { SuggestionsList } from "@/features/friends/components/suggestions-list";

export const FriendsPage = () => {
  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-8">
      <div className="container mx-auto max-w-6xl px-4 pt-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-[#212121]">Friends</h1>
          <Link href="/friends/list" className="text-sm font-medium text-[#1890FF] hover:underline">
            See all friends
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Main column */}
          <div className="space-y-6">
            <section>
              <h2 className="mb-4 text-lg font-medium text-[#212121]">Friend Requests</h2>
              <FriendRequestList />
            </section>

            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-medium text-[#212121]">Your Friends</h2>
                <Link href="/friends/list" className="text-sm text-[#1890FF] hover:underline">
                  See all
                </Link>
              </div>
              <FriendsList />
            </section>
          </div>

          {/* Sidebar */}
          <div>
            <section className="rounded-md bg-white p-5 shadow-[0_4px_8px_rgba(0,0,0,0.08)]">
              <h2 className="mb-4 text-lg font-medium text-[#212121]">You might like</h2>
              <SuggestionsList />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
