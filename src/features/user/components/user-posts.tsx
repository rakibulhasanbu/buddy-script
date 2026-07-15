"use client";

import { TimelinePost } from "@/features/feed/components/timeline-post";
import { Post } from "@/features/feed/types";
import { useGetUserPostsQuery } from "@/features/user/api";

import { PostListSkeleton } from "@/components/shared/post-skeleton";

interface UserPostsProps {
  userId: string;
}

export const UserPosts = ({ userId }: UserPostsProps) => {
  const { data, isLoading, isError } = useGetUserPostsQuery({ userId });

  if (isLoading) {
    return <PostListSkeleton count={3} />;
  }

  if (isError) {
    return (
      <div className="rounded-md bg-buddy-card-bg p-6 text-center text-buddy-text-secondary">
        Failed to load posts. Please try again later.
      </div>
    );
  }

  const posts = data?.data || [];

  if (posts.length === 0) {
    return (
      <div className="rounded-md bg-buddy-card-bg p-8 text-center">
        <h3 className="mb-2 text-lg font-medium text-buddy-text-dark">No posts yet</h3>
        <p className="text-sm text-buddy-text-secondary">When this user shares posts, they will appear here.</p>
      </div>
    );
  }

  return (
    <div>
      {posts.map((post: Post) => (
        <TimelinePost key={post.id} post={post} />
      ))}
    </div>
  );
};
