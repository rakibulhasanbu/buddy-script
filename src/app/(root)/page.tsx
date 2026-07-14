"use client";

import { FeedLayout } from "@/features/feed/components/feed-layout";
import { FeedMiddle } from "@/features/feed/components/feed-middle";
import { LeftSidebar } from "@/features/feed/components/left-sidebar";
import { RightSidebar } from "@/features/feed/components/right-sidebar";

const Page = () => {
  return <FeedLayout leftSidebar={<LeftSidebar />} middle={<FeedMiddle />} rightSidebar={<RightSidebar />} />;
};

export default Page;
