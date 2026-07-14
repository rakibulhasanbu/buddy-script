"use client";

import Image from "next/image";

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
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="rounded-[18px] bg-[#F6F6F6] p-1">
      <div className="flex flex-wrap items-center justify-between">
        <div className="flex flex-1 items-center">
          <div className="shrink-0">
            <Image src="/images/comment_img.png" alt="" width={26} height={26} className="h-6.5 w-6.5" />
          </div>
          <div className="relative w-full">
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus={autoFocus}
              className="h-10 w-full resize-none border-none bg-transparent p-2 text-sm outline-none"
              placeholder={placeholder}
            />
          </div>
        </div>
        <div className="flex items-center">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="mr-2 border-none bg-transparent px-2 py-2 text-xs text-[#666666]"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={onSubmit}
            disabled={isLoading || !value.trim()}
            className="border-none bg-transparent p-2 disabled:opacity-50"
          >
            {isLoading ? (
              <Spinner className="h-4 w-4" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
                <path
                  fill="#1890FF"
                  fillRule="evenodd"
                  d="M13.167 6.534a.5.5 0 01.5.5c0 3.061-2.35 5.582-5.333 5.837V14.5a.5.5 0 01-1 0v-1.629C4.35 12.616 2 10.096 2 7.034a.5.5 0 011 0c0 2.679 2.168 4.859 4.833 4.859 2.666 0 4.834-2.18 4.834-4.86a.5.5 0 01.5-.5zM7.833.667a3.218 3.218 0 013.208 3.22v3.126c0 1.775-1.439 3.22-3.208 3.22a3.218 3.218 0 01-3.208-3.22V3.887c0-1.776 1.44-3.22 3.208-3.22zm0 1a2.217 2.217 0 00-2.208 2.22v3.126c0 1.223.991 2.22 2.208 2.22a2.217 2.217 0 002.208-2.22V3.887c0-1.224-.99-2.22-2.208-2.22z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
