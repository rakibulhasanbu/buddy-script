"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { useDeletePostMutation, useToggleReactionMutation } from "@/features/feed/api";
import { CommentSection } from "@/features/feed/components/comment-section";
import { REACTION_CONFIG, ReactionEmoji } from "@/features/feed/components/reaction-assets";
import { ReactionPicker } from "@/features/feed/components/reaction-picker";
import { SavePostButton } from "@/features/feed/components/save-post-button";
import { WhoReactedModal } from "@/features/feed/components/who-reacted-modal";
import { EReactionEntity, EReactionType, EVisibility, Post } from "@/features/feed/types";
import { formatRelativeTime, getTopReactions, getTotalReactions } from "@/features/feed/utils";
import { useAppSelector } from "@/redux/hook";
import { MessageCircle, Share2 } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { ThreeDotsIcon } from "./feed-icons";

interface PostDetailModalProps {
  post: Post;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: () => void;
}

const PostDropdown = ({
  isAuthor,
  onEdit,
  onDelete,
  isDeleting,
}: {
  isAuthor: boolean;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}) => {
  const [open, setOpen] = useState(false);

  if (!isAuthor) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="cursor-pointer border-none bg-transparent p-1 outline-none"
      >
        <ThreeDotsIcon />
      </button>
      {open && (
        <div className="absolute top-6 right-0 z-50 w-50 rounded-md bg-buddy-card-bg p-2 shadow-[0_8px_24px_rgba(149,157,165,0.2)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
          <ul>
            <li>
              <button
                type="button"
                onClick={() => {
                  onEdit();
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 px-2 py-2 text-left text-sm text-buddy-text-dark hover:bg-buddy-muted-bg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
                  <path
                    stroke="#1890FF"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.2"
                    d="M8.25 3H3a1.5 1.5 0 00-1.5 1.5V15A1.5 1.5 0 003 16.5h10.5A1.5 1.5 0 0015 15V9.75"
                  />
                  <path
                    stroke="#1890FF"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.2"
                    d="M13.875 1.875a1.591 1.591 0 112.25 2.25L9 11.25 6 12l.75-3 7.125-7.125z"
                  />
                </svg>
                Edit Post
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => {
                  onDelete();
                  setOpen(false);
                }}
                disabled={isDeleting}
                className="flex w-full cursor-pointer items-center gap-2 px-2 py-2 text-left text-sm text-destructive hover:bg-buddy-muted-bg disabled:opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
                  <path
                    stroke="#FF4D4F"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.2"
                    d="M2.25 4.5h13.5M6 4.5V3a1.5 1.5 0 011.5-1.5h3A1.5 1.5 0 0112 3v1.5m2.25 0V15a1.5 1.5 0 01-1.5 1.5h-7.5a1.5 1.5 0 01-1.5-1.5V4.5h10.5zM7.5 8.25v4.5M10.5 8.25v4.5"
                  />
                </svg>
                {isDeleting ? "Deleting..." : "Delete Post"}
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export const PostDetailModal = ({ post, open, onOpenChange, onEdit }: PostDetailModalProps) => {
  const currentUser = useAppSelector((state) => state.auth.user);
  const isAuthor = currentUser?.id === post.author.id;

  const [showWhoReacted, setShowWhoReacted] = useState(false);

  const [toggleReaction] = useToggleReactionMutation();
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();

  const totalReactions = getTotalReactions(post.reactionCounts);
  const topReactions = getTopReactions(post.reactionCounts);

  const handleReact = (type: EReactionType) => {
    toggleReaction({ entityType: EReactionEntity.POST, entityId: post.id, type });
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await deletePost(post.id).unwrap();
      toast.success("Post deleted successfully");
      onOpenChange(false);
    } catch {
      toast.error("Failed to delete post");
    }
  };

  const visibilityText = post.visibility === EVisibility.PRIVATE ? "Private" : "Public";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="border-b px-4 py-3">
          <DialogTitle className="text-center text-base font-bold text-buddy-text-dark">
            {post.author.name}&apos;s Post
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[calc(90vh-60px)] overflow-y-auto p-4">
          <div className="mb-4 flex items-center justify-between">
            <Link href={`/users/${post.author.id}`} className="flex cursor-pointer items-center gap-3">
              <Avatar className="h-11 w-11">
                <AvatarImage src={post.author.photoUrl || "/images/Avatar.png"} alt={post.author.name} />
                <AvatarFallback>{post.author.name?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="text-base font-semibold text-buddy-text-dark hover:underline">{post.author.name}</h4>
                <p className="text-sm text-buddy-text-muted">
                  {formatRelativeTime(post.createdAt)} ago · {visibilityText}
                </p>
              </div>
            </Link>
            <PostDropdown
              isAuthor={isAuthor}
              onEdit={() => {
                onOpenChange(false);
                onEdit?.();
              }}
              onDelete={handleDelete}
              isDeleting={isDeleting}
            />
          </div>

          <p className="mb-4 text-sm leading-relaxed whitespace-pre-wrap text-buddy-text">{post.content}</p>

          {post.imageUrl && (
            <div className="mb-4">
              <Image
                src={post.imageUrl}
                alt=""
                width={800}
                height={600}
                className="h-auto w-full rounded-lg object-cover"
              />
            </div>
          )}

          <div className="mb-3 flex items-center justify-between border-b border-buddy-border-color pb-3">
            <button
              type="button"
              onClick={() => totalReactions > 0 && setShowWhoReacted(true)}
              disabled={totalReactions === 0}
              className={`flex cursor-pointer items-center ${totalReactions === 0 ? "cursor-default" : ""}`}
            >
              <div className="flex">
                {topReactions.map((type, index) => (
                  <span
                    key={type}
                    className={`flex h-6 w-6 items-center justify-center rounded-full border border-buddy-card-bg bg-buddy-muted-bg text-base ${index > 0 ? "-ml-2" : ""}`}
                  >
                    <ReactionEmoji type={type as EReactionType} className="text-sm" />
                  </span>
                ))}
              </div>
              {totalReactions > 0 && <span className="ml-2 text-sm text-buddy-text-muted">{totalReactions}</span>}
            </button>
            <span className="text-sm text-buddy-text-muted">
              <span className="text-buddy-text-dark">{post.commentCount}</span> Comment
              {post.commentCount === 1 ? "" : "s"}
            </span>
          </div>

          <div className="mb-4 flex border-b border-buddy-border-color pb-1">
            <ReactionPicker onReact={handleReact} className="flex flex-1">
              <button
                type="button"
                onClick={() => handleReact(EReactionType.LIKE)}
                className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md py-2.5 text-sm font-medium transition-colors hover:bg-buddy-muted-bg ${post.myReaction ? "bg-buddy-muted-bg" : ""}`}
                style={{ color: post.myReaction ? REACTION_CONFIG[post.myReaction].color : undefined }}
              >
                <ReactionEmoji type={post.myReaction ?? EReactionType.LIKE} className="text-xl" />
                {post.myReaction ? REACTION_CONFIG[post.myReaction].label : "Like"}
              </button>
            </ReactionPicker>
            <button
              type="button"
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md py-2.5 text-sm font-medium text-buddy-text-secondary transition-colors hover:bg-buddy-muted-bg"
            >
              <MessageCircle className="h-5 w-5" />
              Comment
            </button>
            {!isAuthor && (
              <div className="flex flex-1">
                <SavePostButton postId={post.id} isSaved={post.isSaved} />
              </div>
            )}
            <button
              type="button"
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md py-2.5 text-sm font-medium text-buddy-text-secondary transition-colors hover:bg-buddy-muted-bg"
            >
              <Share2 className="h-5 w-5" />
              Share
            </button>
          </div>

          <CommentSection postId={post.id} commentCount={post.commentCount} forceExpanded />
        </div>

        <WhoReactedModal
          open={showWhoReacted}
          onOpenChange={setShowWhoReacted}
          entityType={EReactionEntity.POST}
          entityId={post.id}
        />
      </DialogContent>
    </Dialog>
  );
};
