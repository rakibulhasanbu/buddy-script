"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { useGetFriendsQuery } from "@/features/friends/api";
import { Friendship } from "@/features/friends/types";
import { useAppSelector } from "@/redux/hook";
import { Search } from "lucide-react";

import { Spinner } from "@/components/ui/spinner";

const YouMightLikeCard = () => (
  <div className="mb-4 rounded-md bg-buddy-card-bg px-6 pt-6 pb-6">
    <div className="mb-6 flex items-center justify-between">
      <h4 className="m-0 text-xl leading-snug font-medium text-buddy-text-dark">You Might Like</h4>
      <Link href="#0" className="text-xs leading-[18px] font-medium text-primary">
        See All
      </Link>
    </div>
    <hr className="mb-3 border-buddy-border-color" />
    <div className="my-6 flex items-center">
      <div className="mr-5">
        <Link href="#0">
          <Image
            src="/images/Avatar.png"
            alt="Radovan SkillArena"
            width={50}
            height={50}
            className="h-[50px] w-[50px] rounded-full object-cover"
          />
        </Link>
      </div>
      <div>
        <Link href="#0">
          <h4 className="text-base leading-6 font-medium text-buddy-text-dark">Radovan SkillArena</h4>
        </Link>
        <p className="text-xs leading-[18px] text-buddy-text-secondary">Founder & CEO at Trophy</p>
      </div>
    </div>
    <div className="flex gap-1">
      <button
        type="button"
        className="flex-1 cursor-pointer rounded-md border border-buddy-border-color bg-transparent py-2 text-sm leading-[22px] font-medium text-buddy-text-muted transition-colors hover:bg-primary hover:text-primary-foreground"
      >
        Ignore
      </button>
      <button
        type="button"
        className="flex-1 cursor-pointer rounded-md border border-buddy-border-color bg-primary py-2 text-sm leading-[22px] font-medium text-primary-foreground transition-colors hover:bg-buddy-primary-hover"
      >
        Follow
      </button>
    </div>
  </div>
);

const YourFriendsCard = () => {
  const currentUser = useAppSelector((state) => state.auth.user);
  const [search, setSearch] = useState("");
  const { data, isLoading } = useGetFriendsQuery({ search });

  const friendships = data?.data || [];

  const getFriendUser = (friendship: Friendship) => {
    return friendship.requesterId === currentUser?.id ? friendship.addressee : friendship.requester;
  };

  return (
    <div className="mb-4 rounded-md bg-buddy-card-bg px-6 pt-6 pb-1.5">
      <div className="mb-6 flex items-center justify-between">
        <h4 className="m-0 text-xl leading-snug font-medium text-buddy-text-dark">Your Friends</h4>
        <Link href="/friends/list" className="text-xs leading-4.5 font-medium text-primary hover:underline">
          See All
        </Link>
      </div>
      <div className="relative mb-6">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-buddy-text-secondary" />
        <input
          className="h-10 w-full rounded-[32px] border border-buddy-muted-bg bg-buddy-muted-bg py-2 pr-3 pl-[42px] text-sm text-buddy-text transition-colors outline-none placeholder:text-buddy-text-muted hover:border-primary"
          type="search"
          placeholder="Search friends..."
          aria-label="Search friends"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-6">
          <Spinner className="h-5 w-5" />
        </div>
      ) : friendships.length === 0 ? (
        <p className="py-4 text-center text-sm text-buddy-text-muted">
          {search ? `No friends match "${search}"` : "No friends yet."}
        </p>
      ) : (
        friendships.map((friendship) => {
          const user = getFriendUser(friendship);
          return (
            <div
              key={friendship.id}
              className="mb-6 flex items-center justify-between rounded-lg p-1.5 transition-colors hover:bg-buddy-muted-bg"
            >
              <div className="flex items-center">
                <div className="mr-4">
                  <Link href={`/users/${user.id}`}>
                    <Image
                      src={user.photoUrl || "/images/profile.png"}
                      alt={user.name}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </Link>
                </div>
                <div>
                  <Link href={`/users/${user.id}`}>
                    <h4 className="text-sm leading-tight font-medium text-buddy-text-dark">{user.name}</h4>
                  </Link>
                  <p className="text-[11px] leading-tight font-light text-buddy-text-secondary">
                    {user.headline || "Member"}
                  </p>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export const RightSidebar = () => {
  return (
    <div className="flex flex-col">
      <YouMightLikeCard />
      <YourFriendsCard />
    </div>
  );
};
