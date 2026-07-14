"use client";

import { memo, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { useDeletePostMutation, useToggleReactionMutation } from "@/features/feed/api";
import { PostComposerModal } from "@/features/feed/components/post-composer-modal";
import { PostDetailModal } from "@/features/feed/components/post-detail-modal";
import { REACTION_CONFIG, ReactionEmoji } from "@/features/feed/components/reaction-assets";
import { ReactionPicker } from "@/features/feed/components/reaction-picker";
import { SavePostButton } from "@/features/feed/components/save-post-button";
import { WhoReactedModal } from "@/features/feed/components/who-reacted-modal";
import { EReactionEntity, EReactionType, EVisibility, Post } from "@/features/feed/types";
import { formatRelativeTime, getTopReactions, getTotalReactions } from "@/features/feed/utils";
import { useAppSelector } from "@/redux/hook";
import { Globe, Lock, MessageCircle, Pencil, Share2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ThreeDotsIcon } from "./feed-icons";

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
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!isAuthor) return null;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="cursor-pointer border-none bg-transparent p-1 outline-none"
      >
        <ThreeDotsIcon />
      </button>
      {open && (
        <div className="absolute top-6 right-0 z-50 w-48 rounded-md bg-buddy-card-bg p-2 shadow-[0_8px_24px_rgba(149,157,165,0.2)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
          <button
            type="button"
            onClick={() => {
              onEdit();
              setOpen(false);
            }}
            className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-buddy-text-dark hover:bg-buddy-muted-bg"
          >
            <Pencil className="h-4 w-4 text-primary" />
            Edit Post
          </button>
          <button
            type="button"
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
            disabled={isDeleting}
            className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-destructive hover:bg-buddy-muted-bg disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            {isDeleting ? "Deleting..." : "Delete Post"}
          </button>
        </div>
      )}
    </div>
  );
};

interface TimelinePostProps {
  post: Post;
}

const TimelinePostInner = ({ post }: TimelinePostProps) => {
  const currentUser = useAppSelector((state) => state.auth.user);
  const isAuthor = currentUser?.id === post.author.id;

  const [showWhoReacted, setShowWhoReacted] = useState(false);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [toggleReaction] = useToggleReactionMutation();
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();

  const totalReactions = getTotalReactions(post.reactionCounts);
  const topReactions = getTopReactions(post.reactionCounts);

  const handleReact = (type: EReactionType) => {
    toggleReaction({ entityType: EReactionEntity.POST, entityId: post.id, type });
  };

  const handleDeletePost = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await deletePost(post.id).unwrap();
      toast.success("Post deleted successfully");
    } catch {
      toast.error("Failed to delete post");
    }
  };

  const openDetail = () => setIsDetailOpen(true);

  return (
    <div className="mb-4 rounded-md bg-buddy-card-bg px-6 pt-6 pb-6 shadow-[0_2px_4px_rgba(0,0,0,0.04)]">
      <div className="mb-4 flex items-center justify-between">
        <Link href={`/users/${post.author.id}`} className="flex cursor-pointer items-center">
          <div className="mr-4">
            <Image
              src={post.author.photoUrl || "/images/post_img.png"}
              alt={post.author.name}
              width={44}
              height={44}
              loading="lazy"
              sizes="44px"
              className="h-11 w-11 rounded-full object-cover transition-opacity hover:opacity-70"
            />
          </div>
          <div>
            <h4 className="text-base leading-tight font-normal text-buddy-text-dark transition-colors hover:underline">
              {post.author.name}
            </h4>
            <p className="flex items-center gap-1 text-sm leading-tight text-buddy-text-muted">
              {formatRelativeTime(post.createdAt)} ago ·{" "}
              {post.visibility === EVisibility.PRIVATE ? (
                <>
                  <Lock className="h-3 w-3" /> Private
                </>
              ) : (
                <>
                  <Globe className="h-3 w-3" /> Public
                </>
              )}
            </p>
          </div>
        </Link>
        <PostDropdown
          isAuthor={isAuthor}
          onEdit={() => setIsComposerOpen(true)}
          onDelete={handleDeletePost}
          isDeleting={isDeleting}
        />
      </div>

      <Link href={`/post/${post.id}`} className="block cursor-pointer">
        <h4 className="mb-4 text-sm leading-5.25 font-normal whitespace-pre-wrap text-buddy-text">{post.content}</h4>
        {post.imageUrl && (
          <div className="mb-6">
            <Image
              src={post.imageUrl}
              alt=""
              width={600}
              height={400}
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 600px"
              className="h-auto w-full rounded-md"
            />
          </div>
        )}
      </Link>

      <div className="mb-4 flex items-center justify-between">
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
                className={`flex h-7 w-7 items-center justify-center rounded-full border border-buddy-card-bg bg-buddy-muted-bg text-base ${index > 0 ? "-ml-2" : ""}`}
              >
                <ReactionEmoji type={type as EReactionType} />
              </span>
            ))}
          </div>
          {totalReactions > 0 && (
            <span className="ml-2 text-sm leading-tight font-normal text-buddy-text-muted">{totalReactions}</span>
          )}
        </button>
        <button
          type="button"
          onClick={openDetail}
          className="cursor-pointer text-sm leading-tight font-normal text-buddy-text-muted hover:underline"
        >
          <span className="text-buddy-text-dark">{post.commentCount}</span> Comment
          {post.commentCount === 1 ? "" : "s"}
        </button>
      </div>

      <div className="flex bg-buddy-muted-bg p-2">
        <ReactionPicker onReact={handleReact} className="mr-1 flex flex-1">
          <button
            type="button"
            onClick={() => handleReact(EReactionType.LIKE)}
            className={`flex w-full flex-1 cursor-pointer items-center justify-center gap-2 rounded-md border-none py-3 text-sm leading-5.25 font-normal transition-colors ${
              post.myReaction ? "bg-accent" : "bg-transparent hover:bg-accent"
            }`}
            style={{ color: post.myReaction ? REACTION_CONFIG[post.myReaction].color : undefined }}
          >
            <ReactionEmoji type={post.myReaction ?? EReactionType.LIKE} className="text-xl" />
            {post.myReaction ? REACTION_CONFIG[post.myReaction].label : "Like"}
          </button>
        </ReactionPicker>
        <button
          type="button"
          onClick={openDetail}
          className="mr-1 flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md border-none bg-transparent py-3 text-sm leading-5.25 font-normal text-buddy-text-dark transition-colors hover:bg-accent"
        >
          <MessageCircle className="h-5 w-5" />
          Comment
        </button>
        {!isAuthor && <SavePostButton postId={post.id} isSaved={post.isSaved} />}
        <button
          type="button"
          className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md border-none bg-transparent py-3 text-sm leading-5.25 font-normal text-buddy-text-dark transition-colors hover:bg-accent"
        >
          <Share2 className="h-5 w-5" />
          Share
        </button>
      </div>

      <WhoReactedModal
        open={showWhoReacted}
        onOpenChange={setShowWhoReacted}
        entityType={EReactionEntity.POST}
        entityId={post.id}
      />

      <PostComposerModal
        key={isComposerOpen ? `edit-${post.id}` : `edit-closed-${post.id}`}
        open={isComposerOpen}
        onOpenChange={setIsComposerOpen}
        mode="edit"
        post={post}
      />

      <PostDetailModal
        post={post}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        onEdit={() => setIsComposerOpen(true)}
      />
    </div>
  );
};

export const TimelinePost = memo(TimelinePostInner);
