"use client";

import { PostComposer } from "@/features/feed/components/post-composer";
import { StoriesSection } from "@/features/feed/components/stories-section";
import { TimelinePost } from "@/features/feed/components/timeline-post";

export const FeedMiddle = () => {
  return (
    <div className="flex flex-col">
      <StoriesSection />
      <PostComposer />
      <TimelinePost />
      <TimelinePost />
    </div>
  );
};
