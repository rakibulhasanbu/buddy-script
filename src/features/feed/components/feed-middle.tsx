"use client";

import { useEffect, useRef } from "react";

import { useGetFeedQuery, useLazyGetFeedQuery } from "@/features/feed/api";
import { useFeedScrollElement } from "@/features/feed/components/feed-scroll-context";
import { PostComposer } from "@/features/feed/components/post-composer";
import { StoriesSection } from "@/features/feed/components/stories-section";
import { TimelinePost } from "@/features/feed/components/timeline-post";
import { useVirtualizer } from "@tanstack/react-virtual";

import { PostListSkeleton } from "@/components/shared/post-skeleton";

const POSTS_LIMIT = 20;

export const FeedMiddle = () => {
  const scrollElement = useFeedScrollElement();
  const { data, isLoading, isError } = useGetFeedQuery({ limit: POSTS_LIMIT });
  const [fetchMore, { isFetching: isFetchingMore }] = useLazyGetFeedQuery();

  const posts = data?.data.data || [];
  const nextCursor = data?.data.meta.nextCursor || null;

  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: posts.length,
    getScrollElement: () => scrollElement,
    estimateSize: () => 400,
    measureElement: (el) => el.getBoundingClientRect().height,
    overscan: 3,
  });

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !scrollElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && nextCursor && !isFetchingMore && !isLoading) {
          fetchMore({ cursor: nextCursor, limit: POSTS_LIMIT });
        }
      },
      { root: scrollElement, rootMargin: "600px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [scrollElement, nextCursor, isFetchingMore, isLoading, fetchMore]);

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div className="flex flex-col">
      <StoriesSection />
      <PostComposer />

      {isLoading && posts.length === 0 && <PostListSkeleton count={3} />}

      {isError && posts.length === 0 && (
        <div className="rounded-md bg-buddy-card-bg py-12 text-center">
          <p className="text-buddy-text-secondary">Failed to load posts. Please try again.</p>
        </div>
      )}

      {posts.length > 0 && (
        <div style={{ height: `${virtualizer.getTotalSize()}px`, position: "relative", width: "100%" }}>
          {virtualItems.map((virtualItem) => {
            const post = posts[virtualItem.index];
            if (!post) return null;

            return (
              <div
                key={virtualItem.key}
                data-index={virtualItem.index}
                ref={virtualizer.measureElement}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <TimelinePost post={post} />
              </div>
            );
          })}
        </div>
      )}

      {!isLoading && !isError && posts.length === 0 && (
        <div className="rounded-md bg-buddy-card-bg py-12 text-center">
          <p className="text-buddy-text-secondary">No posts yet. Be the first to share something!</p>
        </div>
      )}

      <div ref={sentinelRef} className="flex justify-center py-4">
        {isFetchingMore && <PostListSkeleton count={1} />}
      </div>
    </div>
  );
};
