"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { useDeletePostMutation, useToggleReactionMutation, useUpdatePostMutation } from "@/features/feed/api";
import { CommentSection } from "@/features/feed/components/comment-section";
import { REACTION_CONFIG, ReactionEmoji, ReactionLabel } from "@/features/feed/components/reaction-assets";
import { ReactionPicker } from "@/features/feed/components/reaction-picker";
import { SavePostButton } from "@/features/feed/components/save-post-button";
import { WhoReactedModal } from "@/features/feed/components/who-reacted-modal";
import { EReactionEntity, EReactionType, EVisibility, Post } from "@/features/feed/types";
import { formatRelativeTime, getTopReactions, getTotalReactions } from "@/features/feed/utils";
import { useAppSelector } from "@/redux/hook";
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
                className="flex w-full cursor-pointer items-center gap-2 px-2 py-2 text-left text-sm text-[#FF4D4F] hover:bg-buddy-muted-bg disabled:opacity-50"
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

interface TimelinePostProps {
  post: Post;
  onPostUpdated?: (updated: Post) => void;
  onPostDeleted?: (id: string) => void;
}

export const TimelinePost = ({ post, onPostUpdated, onPostDeleted }: TimelinePostProps) => {
  const currentUser = useAppSelector((state) => state.auth.user);
  const isAuthor = currentUser?.id === post.author.id;

  const [showWhoReacted, setShowWhoReacted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [editVisibility, setEditVisibility] = useState<EVisibility>(post.visibility);
  const [isEditImageRemoved, setIsEditImageRemoved] = useState(false);

  const [toggleReaction] = useToggleReactionMutation();
  const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation();
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();

  const totalReactions = getTotalReactions(post.reactionCounts);
  const topReactions = getTopReactions(post.reactionCounts);

  const handleReact = (type: EReactionType) => {
    toggleReaction({ entityType: EReactionEntity.POST, entityId: post.id, type });
  };

  const handleUpdatePost = async () => {
    try {
      const result = await updatePost({
        id: post.id,
        body: {
          content: editContent,
          visibility: editVisibility,
          imageUrl: isEditImageRemoved ? undefined : post.imageUrl || undefined,
        },
      }).unwrap();
      setIsEditing(false);
      toast.success("Post updated successfully");
      onPostUpdated?.(result.data);
    } catch {
      toast.error("Failed to update post");
    }
  };

  const handleDeletePost = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await deletePost(post.id).unwrap();
      toast.success("Post deleted successfully");
      onPostDeleted?.(post.id);
    } catch {
      toast.error("Failed to delete post");
    }
  };

  return (
    <div className="mb-4 rounded-md bg-buddy-card-bg px-6 pt-6 pb-6">
      <div className="mb-4 flex items-center justify-between">
        <Link href={`/users/${post.author.id}`} className="flex cursor-pointer items-center">
          <div className="mr-4">
            <Image
              src={post.author.photoUrl || "/images/post_img.png"}
              alt={post.author.name}
              width={44}
              height={44}
              className="h-11 w-11 rounded-full object-cover transition-opacity hover:opacity-70"
            />
          </div>
          <div>
            <h4 className="text-base leading-tight font-normal text-buddy-text-dark transition-colors hover:underline">
              {post.author.name}
            </h4>
            <p className="text-sm leading-tight text-buddy-text-muted">
              {formatRelativeTime(post.createdAt)} ago .{" "}
              <span className="text-buddy-text-muted">
                {post.visibility === EVisibility.PRIVATE ? (
                  <span className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                    Private
                  </span>
                ) : (
                  "Public"
                )}
              </span>
            </p>
          </div>
        </Link>
        <PostDropdown
          isAuthor={isAuthor}
          onEdit={() => setIsEditing(true)}
          onDelete={handleDeletePost}
          isDeleting={isDeleting}
        />
      </div>

      {isEditing ? (
        <div className="mb-4 space-y-3">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="h-32 w-full resize-none rounded-md border border-buddy-input-border bg-buddy-page-bg p-3 text-sm text-buddy-text outline-none"
          />
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-buddy-text-secondary">
              <input
                type="radio"
                checked={editVisibility === EVisibility.PUBLIC}
                onChange={() => setEditVisibility(EVisibility.PUBLIC)}
              />
              Public
            </label>
            <label className="flex items-center gap-2 text-sm text-buddy-text-secondary">
              <input
                type="radio"
                checked={editVisibility === EVisibility.PRIVATE}
                onChange={() => setEditVisibility(EVisibility.PRIVATE)}
              />
              Private
            </label>
          </div>
          {post.imageUrl && !isEditImageRemoved && (
            <div className="relative">
              <Image src={post.imageUrl} alt="" width={600} height={400} className="h-auto w-full rounded-md" />
              <button
                type="button"
                onClick={() => setIsEditImageRemoved(true)}
                className="absolute top-2 right-2 rounded-full bg-black/50 p-1 text-white"
              >
                ✕
              </button>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setEditContent(post.content);
                setEditVisibility(post.visibility);
                setIsEditImageRemoved(false);
              }}
              className="rounded-md border border-buddy-border-color bg-buddy-card-bg px-4 py-2 text-sm text-buddy-text-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpdatePost}
              disabled={isUpdating || !editContent.trim()}
              className="rounded-md bg-[#1890FF] px-4 py-2 text-sm text-white disabled:opacity-50"
            >
              {isUpdating ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      ) : (
        <Link href={`/post/${post.id}`} className="block cursor-pointer">
          <h4 className="mb-4 text-sm leading-5.25 font-normal text-buddy-text">{post.content}</h4>
          {post.imageUrl && (
            <div className="mb-6">
              <Image src={post.imageUrl} alt="" width={600} height={400} className="h-auto w-full rounded-md" />
            </div>
          )}
        </Link>
      )}

      <div className="mb-6 flex items-center justify-between">
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
                className={`h-8 w-8 rounded-full border border-buddy-card-bg bg-[#C4C4C4] ${index > 0 ? "-ml-4" : ""}`}
              >
                <ReactionEmoji type={type as EReactionType} className="text-lg" />
              </span>
            ))}
          </div>
          {totalReactions > 0 && (
            <span className="ml-2 text-sm leading-tight font-normal text-buddy-text-muted">{totalReactions}</span>
          )}
        </button>
        <div className="flex">
          <p className="mx-4 text-sm leading-tight font-normal text-buddy-text-muted">
            <span className="text-buddy-text-dark">{post.commentCount}</span> Comment
          </p>
        </div>
      </div>

      <div className="flex bg-buddy-muted-bg p-2">
        <ReactionPicker onReact={handleReact} className="mr-1 flex flex-1">
          <button
            type="button"
            onClick={() => handleReact(EReactionType.LIKE)}
            className={`flex w-full flex-1 cursor-pointer items-center justify-center rounded-md border-none py-3 text-sm leading-5.25 font-normal text-buddy-text-dark transition-colors ${
              post.myReaction ? "bg-[#e4f1fd]" : "bg-transparent hover:bg-[#e4f1fd]"
            }`}
            style={{ color: post.myReaction ? REACTION_CONFIG[post.myReaction].color : undefined }}
          >
            <span className="mr-2">
              {post.myReaction ? (
                <ReactionEmoji type={post.myReaction} className="text-xl" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" viewBox="0 0 19 19">
                  <path fill="#FFCC4D" d="M9.5 19a9.5 9.5 0 100-19 9.5 9.5 0 000 19z" />
                  <path
                    fill="#664500"
                    d="M9.5 11.083c-1.912 0-3.181-.222-4.75-.527-.358-.07-1.056 0-1.056 1.055 0 2.111 2.425 4.75 5.806 4.75 3.38 0 5.805-2.639 5.805-4.75 0-1.055-.697-1.125-1.055-1.055-1.57.305-2.838.527-4.75.527z"
                  />
                  <path
                    fill="#fff"
                    d="M4.75 11.611s1.583.528 4.75.528 4.75-.528 4.75-.528-1.056 2.111-4.75 2.111-4.75-2.11-4.75-2.11z"
                  />
                  <path
                    fill="#664500"
                    d="M6.333 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847zM12.667 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847z"
                  />
                </svg>
              )}
            </span>
            <ReactionLabel type={post.myReaction} hasReaction={!!post.myReaction} />
          </button>
        </ReactionPicker>
        <button
          type="button"
          className="mr-1 flex flex-1 cursor-pointer items-center justify-center rounded-md border-none bg-transparent py-3 text-sm leading-5.25 font-normal text-buddy-text-dark transition-colors hover:bg-[#e4f1fd]"
        >
          <span className="mr-2">
            <svg
              className="text-buddy-text-dark"
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="21"
              fill="none"
              viewBox="0 0 21 21"
            >
              <path
                stroke="currentColor"
                d="M1 10.5c0-.464 0-.696.009-.893A9 9 0 019.607 1.01C9.804 1 10.036 1 10.5 1v0c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H10.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C1 11.196 1 10.964 1 10.5v0z"
              />
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.938 9.313h7.125M10.5 14.063h3.563"
              />
            </svg>
          </span>
          Comment
        </button>
        {!isAuthor && <SavePostButton postId={post.id} isSaved={post.isSaved} />}
        <button
          type="button"
          className="flex flex-1 cursor-pointer items-center justify-center rounded-md border-none bg-transparent py-3 text-sm leading-5.25 font-normal text-buddy-text-dark transition-colors hover:bg-[#e4f1fd]"
        >
          <span className="mr-2">
            <svg
              className="text-buddy-text-dark"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="21"
              fill="none"
              viewBox="0 0 24 21"
            >
              <path
                stroke="currentColor"
                strokeLinejoin="round"
                d="M23 10.5L12.917 1v5.429C3.267 6.429 1 13.258 1 20c2.785-3.52 5.248-5.429 11.917-5.429V20L23 10.5z"
              />
            </svg>
          </span>
          Share
        </button>
      </div>

      <CommentSection postId={post.id} commentCount={post.commentCount} />

      <WhoReactedModal
        open={showWhoReacted}
        onOpenChange={setShowWhoReacted}
        entityType={EReactionEntity.POST}
        entityId={post.id}
      />
    </div>
  );
};
