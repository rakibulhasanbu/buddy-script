"use client";

import { useGetPostQuery } from "@/features/feed/api";
import { TimelinePost } from "@/features/feed/components/timeline-post";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PostSkeleton } from "@/components/shared/post-skeleton";

interface PostNotificationModalProps {
  postId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PostNotificationModal = ({ postId, open, onOpenChange }: PostNotificationModalProps) => {
  const { data: postData, isLoading } = useGetPostQuery(postId ?? "", {
    skip: !postId,
  });

  const post = postData?.data;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto p-0">
        {isLoading ? (
          <div className="p-4">
            <PostSkeleton />
          </div>
        ) : post ? (
          <div className="p-2">
            <TimelinePost post={post} />
          </div>
        ) : (
          <div className="p-6 text-center text-sm text-buddy-text-secondary">Post not found</div>
        )}
      </DialogContent>
    </Dialog>
  );
};
