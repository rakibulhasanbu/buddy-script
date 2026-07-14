"use client";

import { useGetSavedPostsQuery } from "@/features/feed/api";
import { FeedLayout } from "@/features/feed/components/feed-layout";
import { LeftSidebar } from "@/features/feed/components/left-sidebar";
import { RightSidebar } from "@/features/feed/components/right-sidebar";
import { TimelinePost } from "@/features/feed/components/timeline-post";

import { PostListSkeleton } from "@/components/shared/post-skeleton";

export const SavedPostsPage = () => {
  const { data, isLoading, isError } = useGetSavedPostsQuery({});

  const posts = data?.data.data || [];

  return (
    <FeedLayout
      leftSidebar={<LeftSidebar />}
      middle={
        <div className="flex flex-col">
          <h2 className="mb-4 text-xl font-medium text-buddy-text-dark">Saved Posts</h2>

          {isLoading && <PostListSkeleton count={3} />}

          {!isLoading && isError && (
            <div className="rounded-md bg-buddy-card-bg p-8 text-center text-buddy-text-secondary">
              Failed to load saved posts.
            </div>
          )}

          {!isLoading && !isError && posts.length === 0 && (
            <div className="rounded-md bg-buddy-card-bg p-8 text-center text-buddy-text-secondary">
              No saved posts yet.
            </div>
          )}

          {posts.map((post) => (
            <TimelinePost key={post.id} post={post} />
          ))}
        </div>
      }
      rightSidebar={<RightSidebar />}
    />
  );
};
