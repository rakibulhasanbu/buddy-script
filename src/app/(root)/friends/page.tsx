"use client";

import { useState } from "react";

import { FriendRequestList } from "@/features/friends/components/friend-request-list";
import { SuggestionsList } from "@/features/friends/components/suggestions-list";

import { Input } from "@/components/ui/input";

import { Search } from "lucide-react";

const FriendsPage = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="bg-buddy-page-bg py-8 lg:py-20">
      <div className="container mx-auto max-w-5xl px-4 pt-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-buddy-text-dark">Friends</h1>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-buddy-text-secondary" />
            <Input
              placeholder="Search people..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 rounded-full bg-buddy-card-bg pl-10"
            />
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="mb-4 text-lg font-medium text-buddy-text-dark">Friend Requests</h2>
            <FriendRequestList search={search} />
          </section>

          <section>
            <h2 className="mb-4 text-lg font-medium text-buddy-text-dark">You Might Like</h2>
            <SuggestionsList search={search} />
          </section>
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;
