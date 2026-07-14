"use client";

import { useState } from "react";

import { FeedScrollContext } from "@/features/feed/components/feed-scroll-context";
import { ThemeToggle } from "@/features/feed/components/theme-toggle";

interface FeedLayoutProps {
  leftSidebar: React.ReactNode;
  middle: React.ReactNode;
  rightSidebar: React.ReactNode;
}

export const FeedLayout = ({ leftSidebar, middle, rightSidebar }: FeedLayoutProps) => {
  const [scrollElement, setScrollElement] = useState<HTMLElement | null>(null);

  return (
    <FeedScrollContext.Provider value={{ scrollElement }}>
      <div className="flex h-screen flex-col overflow-hidden bg-buddy-page-bg">
        <ThemeToggle />

        <div className="container mx-auto max-w-330 px-4 pt-14 lg:pt-18.75">
          <div className="grid h-[calc(100vh-56px)] grid-cols-1 gap-4 pb-17 lg:h-[calc(100vh-75px)] lg:grid-cols-12 lg:pb-0">
            <aside className="no-scrollbar hidden h-full overflow-auto lg:col-span-3 lg:block lg:px-0.5 lg:pt-4.5">
              {leftSidebar}
            </aside>
            <main
              ref={setScrollElement}
              className="col-span-1 no-scrollbar h-full overflow-auto px-2 pt-2 lg:col-span-6 lg:px-0 lg:pt-2.5"
            >
              {middle}
            </main>
            <aside className="no-scrollbar hidden h-full overflow-auto lg:col-span-3 lg:block lg:px-0.5 lg:pt-4.5">
              {rightSidebar}
            </aside>
          </div>
        </div>
      </div>
    </FeedScrollContext.Provider>
  );
};
