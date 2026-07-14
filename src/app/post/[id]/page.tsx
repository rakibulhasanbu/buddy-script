"use client";

import { useParams } from "next/navigation";

import { useGetPostQuery } from "@/features/feed/api";
import { TimelinePost } from "@/features/feed/components/timeline-post";

import { PostSkeleton } from "@/components/shared/post-skeleton";

export default function PostDetailPage() {
  const params = useParams();
  const postId = params.id as string;
  const { data, isLoading, isError } = useGetPostQuery(postId, { skip: !postId });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-buddy-page-bg pb-8">
        <div className="container mx-auto max-w-3xl px-4 pt-20">
          <PostSkeleton />
        </div>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-buddy-page-bg px-4">
        <div className="rounded-md bg-buddy-card-bg p-8 text-center shadow-[0_4px_8px_rgba(0,0,0,0.08)]">
          <h2 className="mb-2 text-xl font-medium text-buddy-text-dark">Post not found</h2>
          <p className="text-buddy-text-secondary">The post you are looking for does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-buddy-page-bg pb-8">
      <div className="container mx-auto max-w-3xl px-4 pt-20">
        <TimelinePost post={data.data} />
      </div>
    </div>
  );
}
