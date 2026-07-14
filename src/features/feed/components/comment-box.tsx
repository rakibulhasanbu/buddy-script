"use client";

import { useEffect, useRef } from "react";

import { useAppSelector } from "@/redux/hook";
import { Send } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";

interface CommentBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
  onCancel?: () => void;
}

export const CommentBox = ({
  value,
  onChange,
  onSubmit,
  isLoading,
  placeholder = "Write a comment",
  autoFocus,
  onCancel,
}: CommentBoxProps) => {
  const currentUser = useAppSelector((state) => state.auth.user);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="flex items-start gap-2">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarImage src={currentUser?.photoUrl || "/images/Avatar.png"} alt={currentUser?.name || "User"} />
        <AvatarFallback>{currentUser?.name?.[0] || "U"}</AvatarFallback>
      </Avatar>
      <div className="flex flex-1 items-end rounded-[18px] bg-buddy-muted-bg p-1">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus={autoFocus}
          rows={1}
          className="max-h-40 min-h-9 flex-1 resize-none border-none bg-transparent px-3 py-2 text-sm text-buddy-text outline-none placeholder:text-buddy-text-secondary"
          placeholder={placeholder}
        />
        <div className="flex shrink-0 items-center gap-1 pr-1 pb-1">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-full px-2 py-1.5 text-xs text-buddy-text-secondary transition-colors hover:bg-buddy-muted-bg"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={onSubmit}
            disabled={isLoading || !value.trim()}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-primary transition-colors hover:bg-buddy-muted-bg disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? <Spinner className="h-4 w-4" /> : <Send className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
