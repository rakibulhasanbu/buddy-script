"use client";

import Image from "next/image";

import shape1 from "@/assets/images/shape1.svg";
import shape2 from "@/assets/images/shape2.svg";
import shape3 from "@/assets/images/shape3.svg";

interface AuthLayoutProps {
  children: React.ReactNode;
  illustration: React.ReactNode;
}

export const AuthLayout = ({ children, illustration }: AuthLayoutProps) => {
  return (
    <section className="relative z-[1] min-h-screen w-full overflow-hidden bg-buddy-page-bg py-[100px]">
      {/* Decorative shapes */}
      <div className="pointer-events-none absolute top-0 left-0 z-[-1]">
        <Image src={shape1} alt="" unoptimized className="block" />
      </div>
      <div className="pointer-events-none absolute top-0 right-5 z-[-1]">
        <Image src={shape2} alt="" unoptimized className="block" />
      </div>
      <div className="pointer-events-none absolute right-80 bottom-0 z-[-1] hidden xl:block">
        <Image src={shape3} alt="" unoptimized className="block" />
      </div>

      <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center px-4 sm:px-6 lg:px-8">
        <div className="flex w-full items-center">
          {/* Left illustration */}
          <div className="hidden w-full max-w-[66.666%] flex-shrink-0 items-center justify-center pr-8 lg:flex xl:pr-12">
            {illustration}
          </div>

          {/* Right form card */}
          <div className="w-full lg:max-w-[33.333%]">{children}</div>
        </div>
      </div>
    </section>
  );
};
