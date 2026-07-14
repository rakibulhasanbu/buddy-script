"use client";

import { useState } from "react";

import { useCreateCommentMutation, useGetCommentsByPostQuery } from "@/features/feed/api";
import { CommentBox } from "@/features/feed/components/comment-box";
import { CommentItem } from "@/features/feed/components/comment-item";
import { toast } from "sonner";

import { Spinner } from "@/components/ui/spinner";

interface CommentSectionProps {
  postId: string;
  commentCount: number;
}

export const CommentSection = ({ postId, commentCount }: CommentSectionProps) => {
  const [expanded, setExpanded] = useState(false);
  const [newComment, setNewComment] = useState("");

  const { data, isLoading } = useGetCommentsByPostQuery({ postId }, { skip: !expanded });
  const [createComment, { isLoading: isCreating }] = useCreateCommentMutation();

  const comments = data?.data.data || [];

  const handleCreateComment = async () => {
    if (!newComment.trim()) return;
    try {
      await createComment({ postId, content: newComment.trim() }).unwrap();
      setNewComment("");
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

      {expanded && (
        <>
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Spinner className="h-5 w-5" />
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} postId={postId} />
              ))}
            </div>
          )}
        </>
      )}

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
