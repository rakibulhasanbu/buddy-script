"use client";

import { DesktopHeader } from "@/features/feed/components/desktop-header";
import { MobileBottomNav } from "@/features/feed/components/mobile-bottom-nav";
import { MobileHeader } from "@/features/feed/components/mobile-header";
import { ThemeToggle } from "@/features/feed/components/theme-toggle";

interface FeedLayoutProps {
  leftSidebar: React.ReactNode;
  middle: React.ReactNode;
  rightSidebar: React.ReactNode;
}

export const FeedLayout = ({ leftSidebar, middle, rightSidebar }: FeedLayoutProps) => {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-buddy-page-bg">
      <ThemeToggle />
      <DesktopHeader />
      <MobileHeader />

      <div className="container mx-auto max-w-285 px-4 pt-14 lg:pt-18.75">
        <div className="grid h-[calc(100vh-56px)] grid-cols-1 gap-4 pb-17 lg:h-[calc(100vh-75px)] lg:grid-cols-12 lg:pb-0">
          <aside className="hidden h-full overflow-auto lg:col-span-3 lg:block lg:pt-4.5">{leftSidebar}</aside>
          <main className="col-span-1 h-full overflow-auto px-2 pt-2 lg:col-span-6 lg:px-0 lg:pt-2.5">{middle}</main>
          <aside className="hidden h-full overflow-auto lg:col-span-3 lg:block lg:pt-4.5">{rightSidebar}</aside>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  );
};
