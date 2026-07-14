"use client";

import { useSavePostMutation, useUnsavePostMutation } from "@/features/feed/api";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";

import { Spinner } from "@/components/ui/spinner";

interface SavePostButtonProps {
  postId: string;
  isSaved?: boolean;
}

export const SavePostButton = ({ postId, isSaved }: SavePostButtonProps) => {
  const [save, { isLoading: isSaving }] = useSavePostMutation();
  const [unsave, { isLoading: isUnsaving }] = useUnsavePostMutation();

  const handleClick = async () => {
    try {
      if (isSaved) {
        await unsave(postId).unwrap();
        toast.success("Post removed from saved");
      } else {
        await save(postId).unwrap();
        toast.success("Post saved");
      }
    } catch {
      toast.error("Failed to update saved status");
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isSaving || isUnsaving}
      className="mr-1 flex flex-1 cursor-pointer items-center justify-center rounded-md border-none bg-transparent py-3 text-sm leading-5.25 font-normal text-buddy-text-dark transition-colors hover:bg-accent disabled:opacity-50"
    >
      {isSaving || isUnsaving ? (
        <Spinner className="mr-2 h-4 w-4" />
      ) : isSaved ? (
        <BookmarkCheck className="mr-2 h-5 w-5 text-primary" />
      ) : (
        <Bookmark className="mr-2 h-5 w-5" />
      )}
      {isSaved ? "Saved" : "Save"}
    </button>
  );
};
