"use client";

import Link from "next/link";

import { Bell, Rocket } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ComingSoonProps {
  feature?: string;
}

export const ComingSoon = ({ feature = "This feature" }: ComingSoonProps) => {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-buddy-page-bg px-4 text-center dark:bg-gradient-to-br dark:from-[#0F172A] dark:via-[#1E293B] dark:to-[#334155]">
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-[#1890FF] blur-[120px]" />
        <div className="absolute right-1/4 bottom-1/4 h-72 w-72 rounded-full bg-[#0ACF83] blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-buddy-border-color bg-buddy-card-bg p-10 shadow-2xl backdrop-blur-md dark:border-white/10 dark:bg-white/10">
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1890FF] to-[#0ACF83] shadow-lg shadow-[#1890FF]/25">
            <Rocket className="h-10 w-10 text-white" />
          </div>
        </div>

        <p className="mb-3 text-xs font-semibold tracking-widest text-[#0ACF83] uppercase">Coming Soon</p>
        <h1 className="mb-4 text-3xl font-bold text-buddy-text-dark md:text-4xl dark:text-white">
          {feature} is on the way
        </h1>
        <p className="mx-auto mb-8 max-w-sm text-sm leading-relaxed text-buddy-text-secondary dark:text-slate-300">
          We are building something great. Be the first to know when {feature.toLowerCase()} launches by joining the
          waitlist.
        </p>

        <form className="mx-auto mb-8 flex max-w-sm flex-col gap-3 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
          <div className="relative flex-1">
            <Bell className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-buddy-text-muted dark:text-slate-400" />
            <input
              type="email"
              placeholder="Enter your email"
              className="h-11 w-full rounded-lg border border-buddy-border-color bg-buddy-muted-bg pr-4 pl-10 text-sm text-buddy-text transition-colors outline-none placeholder:text-buddy-text-muted focus:border-[#1890FF] focus:bg-buddy-page-bg dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-400 dark:focus:bg-white/10"
            />
          </div>
          <Button type="submit" className="h-11 gap-2 bg-[#1890FF] px-5 text-white hover:bg-[#1890FF]/90">
            <Bell className="h-4 w-4" />
            Notify me
          </Button>
        </form>

        <Button
          asChild
          variant="outline"
          className="border-buddy-border-color bg-transparent text-buddy-text-dark hover:bg-buddy-muted-bg dark:border-white/10 dark:text-white dark:hover:bg-white/10 dark:hover:text-white"
        >
          <Link href="/">Back to Feed</Link>
        </Button>
      </div>

      <p className="relative z-10 mt-8 text-xs text-buddy-text-muted dark:text-slate-400">
        © {new Date().getFullYear()} Buddy. All rights reserved.
      </p>
    </div>
  );
};
