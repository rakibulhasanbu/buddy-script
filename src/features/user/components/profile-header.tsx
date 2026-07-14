"use client";

import Image from "next/image";

import { PublicProfileUser } from "@/features/user/types";
import { format } from "date-fns";
import { Camera, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ProfileHeaderProps {
  user: PublicProfileUser;
  isOwner?: boolean;
  onEdit?: () => void;
}

export const ProfileHeader = ({ user, isOwner, onEdit }: ProfileHeaderProps) => {
  return (
    <div className="relative mb-6 rounded-md bg-white shadow-[0_4px_8px_rgba(0,0,0,0.08)]">
      {/* Cover */}
      <div className="relative h-48 overflow-hidden rounded-t-md md:h-72">
        {user.coverUrl ? (
          <Image src={user.coverUrl} alt={`${user.name} cover`} fill className="object-cover" priority />
        ) : (
          <div className="h-full w-full bg-gradient-to-r from-[#1890FF] to-[#00ACFF]" />
        )}
      </div>

      {/* Avatar + Info */}
      <div className="relative px-6 pb-6">
        <div className="flex flex-col items-center md:flex-row md:items-end">
          <div className="relative -mt-16 mb-4 md:mb-0">
            <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-white md:h-40 md:w-40">
              <Image
                src={user.photoUrl || "/images/profile.png"}
                alt={user.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            {isOwner && (
              <button
                type="button"
                onClick={onEdit}
                className="absolute right-1 bottom-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#F5F5F5] text-[#212121] shadow transition-colors hover:bg-[#E8E8E8]"
                aria-label="Edit profile"
              >
                <Camera className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex-1 text-center md:ml-6 md:text-left">
            <h1 className="text-2xl font-semibold text-[#212121] md:text-3xl">{user.name}</h1>
            {user.headline ? <p className="mt-1 text-[#4A5568]">{user.headline}</p> : null}
            {user.bio ? (
              <p className="mt-1 max-w-xl text-[#666666]">{user.bio}</p>
            ) : (
              <p className="mt-1 text-[#999999]">No bio yet</p>
            )}
            <p className="mt-2 text-sm text-[#999999]">Member since {format(new Date(user.createdAt), "MMMM yyyy")}</p>
          </div>

          {isOwner && (
            <div className="mt-4 md:mt-0">
              <Button
                type="button"
                onClick={onEdit}
                variant="outline"
                className="h-10 gap-2 rounded-md border-[#DCDFE4] bg-white px-5 text-sm font-medium text-[#212121] hover:bg-[#F5F5F5]"
              >
                <Pencil className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
