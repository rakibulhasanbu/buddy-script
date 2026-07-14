"use client";

import { TimelinePost } from "@/features/feed/components/timeline-post";
import { Post } from "@/features/feed/types";
import { useGetUserPostsQuery } from "@/features/user/api";

import { Spinner } from "@/components/ui/spinner";

interface UserPostsProps {
  userId: string;
}

export const UserPosts = ({ userId }: UserPostsProps) => {
  const { data, isLoading, isError } = useGetUserPostsQuery({ userId });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-md bg-white p-6 text-center text-[#666666]">
        Failed to load posts. Please try again later.
      </div>
    );
  }

  const posts = data?.data.data || [];

  if (posts.length === 0) {
    return (
      <div className="rounded-md bg-white p-8 text-center">
        <h3 className="mb-2 text-lg font-medium text-[#212121]">No posts yet</h3>
        <p className="text-sm text-[#666666]">When this user shares posts, they will appear here.</p>
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
