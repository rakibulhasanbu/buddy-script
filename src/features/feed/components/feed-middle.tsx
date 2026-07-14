"use client";

import { useEffect, useState } from "react";

import { useLazyGetFeedQuery } from "@/features/feed/api";
import { PostComposer } from "@/features/feed/components/post-composer";
import { StoriesSection } from "@/features/feed/components/stories-section";
import { TimelinePost } from "@/features/feed/components/timeline-post";
import { Post } from "@/features/feed/types";

import { Spinner } from "@/components/ui/spinner";

const POSTS_LIMIT = 10;

export const FeedMiddle = () => {
  const [trigger, { isFetching }] = useLazyGetFeedQuery();
  const [posts, setPosts] = useState<Post[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFeed = async (cursor?: string) => {
    const result = await trigger({ cursor, limit: POSTS_LIMIT });
    return result.data?.data;
  };

  const loadInitial = async () => {
    setIsLoading(true);
    const feed = await fetchFeed();
    setPosts(feed?.data || []);
    setNextCursor(feed?.meta.nextCursor || null);
    setIsLoading(false);
  };

  const loadMore = async () => {
    if (!nextCursor) return;
    const feed = await fetchFeed(nextCursor);
    setPosts((prev) => [...prev, ...(feed?.data || [])]);
    setNextCursor(feed?.meta.nextCursor || null);
  };

  const handlePostCreated = () => {
    loadInitial();
  };

  const handlePostUpdated = (updated: Post) => {
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handlePostDeleted = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  useEffect(() => {
    const init = async () => {
      await loadInitial();
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col">
      <StoriesSection />
      <PostComposer onPostCreated={handlePostCreated} />

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner className="h-8 w-8" />
        </div>
      ) : (
        <>
          {posts.map((post) => (
            <TimelinePost
              key={post.id}
              post={post}
              onPostUpdated={handlePostUpdated}
              onPostDeleted={handlePostDeleted}
            />
          ))}

          {posts.length === 0 && !isFetching && (
            <div className="rounded-md bg-white py-12 text-center">
              <p className="text-[#666666]">No posts yet. Be the first to share something!</p>
            </div>
          )}

          {nextCursor && (
            <div className="flex justify-center py-4">
              <button
                type="button"
                onClick={loadMore}
                disabled={isFetching}
                className="rounded-md bg-[#1890FF] px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-[#377DFF] disabled:opacity-50"
              >
                {isFetching ? "Loading..." : "Load more"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
