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
    <div className="flex h-screen flex-col overflow-hidden bg-[#F0F2F5]">
      <ThemeToggle />
      <DesktopHeader />
      <MobileHeader />

      <div className="container mx-auto max-w-[1140px] px-4 pt-[70px] lg:pt-[75px]">
        <div className="grid h-[calc(100vh-75px)] grid-cols-1 gap-4 lg:grid-cols-12">
          <aside className="hidden h-full overflow-auto lg:col-span-3 lg:block lg:pt-[18px]">{leftSidebar}</aside>
          <main className="col-span-1 h-full overflow-auto pt-2 lg:col-span-6 lg:pt-[10px]">{middle}</main>
          <aside className="hidden h-full overflow-auto lg:col-span-3 lg:block lg:pt-[18px]">{rightSidebar}</aside>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  );
};
