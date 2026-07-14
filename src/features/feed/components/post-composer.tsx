"use client";

import { useState } from "react";

import { PostComposerModal } from "@/features/feed/components/post-composer-modal";
import { useAppSelector } from "@/redux/hook";
import { ImageIcon, Smile } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PostComposerProps {
  onPostCreated?: () => void;
}

export const PostComposer = ({ onPostCreated }: PostComposerProps) => {
  const currentUser = useAppSelector((state) => state.auth.user);
  const [open, setOpen] = useState(false);

  if (!currentUser) return null;

  return (
    <>
      <div className="mb-4 rounded-md bg-buddy-card-bg px-4 pt-4 pb-3 shadow-[0_2px_4px_rgba(0,0,0,0.04)]">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full cursor-pointer items-center gap-3 border-b border-buddy-border-color pb-3"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={currentUser.photoUrl || "/images/Avatar.png"} alt={currentUser.name} />
            <AvatarFallback>{currentUser.firstName?.[0] || currentUser.name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 rounded-full bg-buddy-muted-bg px-4 py-2.5 text-left text-sm text-buddy-text-secondary transition-colors hover:bg-buddy-muted-bg/80">
            What&apos;s on your mind, {currentUser.firstName}?
          </div>
        </button>

        <div className="mt-2 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-buddy-text-secondary transition-colors hover:bg-buddy-muted-bg"
          >
            <ImageIcon className="h-5 w-5 text-green-500" />
            Photo
          </button>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-buddy-text-secondary transition-colors hover:bg-buddy-muted-bg"
          >
            <Smile className="h-5 w-5 text-yellow-500" />
            Feeling
          </button>
        </div>
      </div>

      <PostComposerModal
        key={open ? "create-open" : "create-closed"}
        open={open}
        onOpenChange={setOpen}
        mode="create"
        onPostCreated={onPostCreated}
      />
    </>
  );
};
