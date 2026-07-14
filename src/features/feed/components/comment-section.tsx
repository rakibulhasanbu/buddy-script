"use client";

import { useState } from "react";

import { useCreateCommentMutation } from "@/features/feed/api";
import { CommentBox } from "@/features/feed/components/comment-box";
import { CommentList } from "@/features/feed/components/comment-list";
import { toast } from "sonner";

interface CommentSectionProps {
  postId: string;
  commentCount: number;
}

export const CommentSection = ({ postId, commentCount }: CommentSectionProps) => {
  const [expanded, setExpanded] = useState(false);
  const [newComment, setNewComment] = useState("");

  const [createComment, { isLoading: isCreating }] = useCreateCommentMutation();

  const handleCreateComment = async () => {
    if (!newComment.trim()) return;
    try {
      await createComment({ postId, content: newComment.trim() }).unwrap();
      setNewComment("");
      setExpanded(true);
    } catch {
      toast.error("Failed to add comment");
    }
  };

  return (
    <div className="mt-4">
      {commentCount > 0 && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="mb-3 cursor-pointer text-sm text-buddy-text-muted"
        >
          {expanded ? "Hide comments" : `View ${commentCount} previous comment${commentCount === 1 ? "" : "s"}`}
        </button>
      )}

      {expanded && <CommentList postId={postId} />}

      <div className="px-6 pt-6 pb-2">
        <CommentBox
          value={newComment}
          onChange={setNewComment}
          onSubmit={handleCreateComment}
          isLoading={isCreating}
          placeholder="Write a comment"
        />
      </div>
    </div>
  );
};
