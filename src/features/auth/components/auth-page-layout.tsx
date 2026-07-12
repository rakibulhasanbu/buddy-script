"use client";

import Image from "next/image";

interface AuthPageLayoutProps {
  children: React.ReactNode;
  illustration: React.ReactNode;
}

export const AuthPageLayout = ({ children, illustration }: AuthPageLayoutProps) => {
  return (
    <section className="relative z-1 min-h-screen w-full overflow-hidden bg-[#F0F2F5] py-25">
      <div className="pointer-events-none absolute top-0 left-0 z-[-1] hidden lg:block">
        <Image src="/images/shape1.svg" alt="" width={150} height={150} unoptimized className="block" />
      </div>
      <div className="pointer-events-none absolute top-0 right-5 z-[-1] hidden lg:block">
        <Image src="/images/shape2.svg" alt="" width={450} height={450} unoptimized className="block" />
      </div>
      <div className="pointer-events-none absolute right-81.75 bottom-0 z-[-1] hidden xl:block">
        <Image src="/images/shape3.svg" alt="" width={494} height={494} unoptimized className="block" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex w-full items-center">
          <div className="hidden w-full max-w-[66.666%] shrink-0 items-center justify-center pr-8 lg:flex xl:pr-12">
            {illustration}
          </div>
          <div className="w-full lg:max-w-[33.333%]">{children}</div>
        </div>
      </div>
    </section>
  );
};
