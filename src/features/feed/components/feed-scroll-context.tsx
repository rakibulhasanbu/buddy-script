"use client";

import { createContext, useContext } from "react";

interface FeedScrollContextValue {
  scrollElement: HTMLElement | null;
}

export const FeedScrollContext = createContext<FeedScrollContextValue | null>(null);

export const useFeedScrollElement = () => {
  const ctx = useContext(FeedScrollContext);
  if (!ctx) {
    throw new Error("useFeedScrollElement must be used within FeedScrollProvider");
  }
  return ctx.scrollElement;
};
