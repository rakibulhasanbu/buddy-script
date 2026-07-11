"use client";

import Image from "next/image";

import googleIcon from "@/assets/images/google.svg";

interface GoogleAuthButtonProps {
  label: string;
  onClick?: () => void;
}

export const GoogleAuthButton = ({ label, onClick }: GoogleAuthButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-10 flex w-full items-center justify-center gap-2 rounded-md border border-buddy-border-color bg-card px-[60px] py-3 transition-shadow hover:shadow-md"
    >
      <Image src={googleIcon} alt="Google" className="h-5 w-5" />
      <span className="text-base leading-snug font-medium whitespace-nowrap text-[#312000]">{label}</span>
    </button>
  );
};
