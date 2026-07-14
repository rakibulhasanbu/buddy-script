"use client";

import { useState } from "react";

import { REACTION_CONFIG } from "@/features/feed/components/reaction-assets";
import { EReactionType } from "@/features/feed/types";

interface ReactionPickerProps {
  onReact: (type: EReactionType) => void;
  children: React.ReactNode;
  className?: string;
}

export const ReactionPicker = ({ onReact, children, className }: ReactionPickerProps) => {
  const [showReactions, setShowReactions] = useState(false);

  const handleSelect = (type: EReactionType) => {
    onReact(type);
    setShowReactions(false);
  };

  return (
    <div
      className={`relative ${className || ""}`}
      onMouseEnter={() => setShowReactions(true)}
      onMouseLeave={() => setShowReactions(false)}
      onFocus={() => setShowReactions(true)}
      onBlur={() => setShowReactions(false)}
    >
      {children}

      {showReactions && (
        <div className="absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 rounded-full bg-white px-2 py-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
          <div className="flex items-center gap-1">
            {Object.values(EReactionType).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleSelect(type)}
                className="flex h-9 w-9 -translate-y-0 cursor-pointer items-center justify-center rounded-full text-2xl transition-transform hover:-translate-y-1 hover:scale-125"
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
