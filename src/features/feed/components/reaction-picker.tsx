"use client";

import { useRef, useState } from "react";

import { REACTION_CONFIG } from "@/features/feed/components/reaction-assets";
import { EReactionType } from "@/features/feed/types";

interface ReactionPickerProps {
  onReact: (type: EReactionType) => void;
  children: React.ReactNode;
  className?: string;
}

const CLOSE_DELAY_MS = 250;

export const ReactionPicker = ({ onReact, children, className }: ReactionPickerProps) => {
  const [showReactions, setShowReactions] = useState(false);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const openReactions = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setShowReactions(true);
  };

  const closeReactions = () => {
    closeTimerRef.current = setTimeout(() => {
      setShowReactions(false);
    }, CLOSE_DELAY_MS);
  };

  const handleSelect = (type: EReactionType) => {
    onReact(type);
    setShowReactions(false);
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  return (
    <div
      className={`relative ${className || ""}`}
      onMouseEnter={openReactions}
      onMouseLeave={closeReactions}
      onFocus={openReactions}
      onBlur={closeReactions}
    >
      {children}

      {showReactions && (
        <div
          className="absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 rounded-full bg-buddy-card-bg px-2 py-2 shadow-[0_4px_16px_rgba(0,0,0,0.2)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.5)]"
          onMouseEnter={openReactions}
          onMouseLeave={closeReactions}
        >
          <div className="flex items-center gap-1">
            {Object.values(EReactionType).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleSelect(type)}
                className="flex h-11 w-11 -translate-y-0 cursor-pointer items-center justify-center rounded-full text-[2rem] transition-transform duration-150 hover:-translate-y-2 hover:scale-125"
                title={REACTION_CONFIG[type].label}
              >
                {REACTION_CONFIG[type].emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
