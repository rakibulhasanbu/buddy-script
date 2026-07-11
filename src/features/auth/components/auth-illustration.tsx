"use client";

import Image, { StaticImageData } from "next/image";

interface AuthIllustrationProps {
  lightImage: StaticImageData;
  alt: string;
}

export const AuthIllustration = ({ lightImage, alt }: AuthIllustrationProps) => {
  return (
    <div className="relative w-full max-w-[633px]">
      <Image src={lightImage} alt={alt} className="h-auto w-full" priority />
    </div>
  );
};
