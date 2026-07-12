"use client";

import Image from "next/image";
import Link from "next/link";

export const MobileHeader = () => {
  return (
    <div className="fixed top-0 right-0 left-0 z-[1030] block bg-white p-4 lg:hidden">
      <div className="container mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <Link href="/">
              <Image src="/images/logo.svg" alt="Buddy Script" width={169} height={40} className="h-auto w-[169px]" />
            </Link>
          </div>
          <div className="flex items-center">
            <form className="relative">
              <Link href="#0" className="mr-4 block">
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 17 17">
                  <circle cx="7" cy="7" r="6" stroke="#666" />
                  <path stroke="#666" strokeLinecap="round" d="M16 16l-3-3" />
                </svg>
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
