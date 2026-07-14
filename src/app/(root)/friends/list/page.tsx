"use client";

import { useState } from "react";
import Link from "next/link";

import { FriendsList } from "@/features/friends/components/friends-list";

import { Input } from "@/components/ui/input";

import { Search } from "lucide-react";

const Page = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen bg-buddy-page-bg py-8 lg:py-20">
      <div className="container mx-auto max-w-5xl px-4 pt-6">
        <div className="mb-6 flex items-center gap-2">
          <Link href="/friends" className="text-sm text-buddy-primary hover:underline">
            Friends
          </Link>
          <span className="text-sm text-buddy-text-muted">/</span>
          <h1 className="text-lg font-medium text-buddy-text-dark">All Friends</h1>
        </div>

        <div className="relative mb-6">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-buddy-text-secondary" />
          <Input
            placeholder="Search friends..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 rounded-full bg-buddy-card-bg pl-10"
          />
        </div>

        <FriendsList search={search} />
      </div>
    </div>
  );
};

export default Page;
