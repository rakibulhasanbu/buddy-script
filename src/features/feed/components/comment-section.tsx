"use client";

import { useState } from "react";

import { useCreateCommentMutation } from "@/features/feed/api";
import { CommentBox } from "@/features/feed/components/comment-box";
import { CommentList } from "@/features/feed/components/comment-list";
import { toast } from "sonner";

interface CommentSectionProps {
  postId: string;
  commentCount: number;
  forceExpanded?: boolean;
}

export const CommentSection = ({ postId, commentCount, forceExpanded = false }: CommentSectionProps) => {
  const [expanded, setExpanded] = useState(forceExpanded);
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
      {!forceExpanded && commentCount > 0 && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="mb-3 cursor-pointer text-sm text-buddy-text-muted"
        >
          {expanded ? "Hide comments" : `View ${commentCount} previous comment${commentCount === 1 ? "" : "s"}`}
        </button>
      )}

      {(expanded || forceExpanded) && <CommentList postId={postId} />}

      <div className="pt-4">
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
