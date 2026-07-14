"use client";

import { useGetCommentsByPostQuery } from "@/features/feed/api";
import { CommentItem } from "@/features/feed/components/comment-item";

import { Spinner } from "@/components/ui/spinner";

interface CommentListProps {
  postId: string;
}

export const CommentList = ({ postId }: CommentListProps) => {
  const { data, isLoading } = useGetCommentsByPostQuery({ postId });
  const comments = data?.data.data || [];

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Spinner className="h-5 w-5" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} postId={postId} />
      ))}
    </div>
  );
};
