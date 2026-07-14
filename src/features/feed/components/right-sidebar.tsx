"use client";

import Image from "next/image";
import Link from "next/link";

const YouMightLikeCard = () => (
  <div className="mb-4 rounded-md bg-buddy-card-bg px-6 pt-6 pb-6">
    <div className="mb-6 flex items-center justify-between">
      <h4 className="m-0 text-xl leading-snug font-medium text-buddy-text-dark">You Might Like</h4>
      <Link href="#0" className="text-xs leading-[18px] font-medium text-[#1890FF]">
        See All
      </Link>
    </div>
    <hr className="mb-3 border-buddy-border-color" />
    <div className="my-6 flex items-center">
      <div className="mr-5">
        <Link href="#0">
          <Image
            src="/images/Avatar.png"
            alt="Radovan SkillArena"
            width={50}
            height={50}
            className="h-[50px] w-[50px] rounded-full object-cover"
          />
        </Link>
      </div>
      <div>
        <Link href="#0">
          <h4 className="text-base leading-6 font-medium text-buddy-text-dark">Radovan SkillArena</h4>
        </Link>
        <p className="text-xs leading-[18px] text-buddy-text-secondary">Founder & CEO at Trophy</p>
      </div>
    </div>
    <div className="flex gap-1">
      <button
        type="button"
        className="flex-1 cursor-pointer rounded-md border border-buddy-border-color bg-transparent py-2 text-sm leading-[22px] font-medium text-buddy-text-muted transition-colors hover:bg-[#377DFF] hover:text-white"
      >
        Ignore
      </button>
      <button
        type="button"
        className="flex-1 cursor-pointer rounded-md border border-buddy-border-color bg-[#377DFF] py-2 text-sm leading-[22px] font-medium text-white transition-colors hover:bg-[#1890FF]"
      >
        Follow
      </button>
    </div>
  </div>
);

const FriendItem = ({
  image,
  name,
  role,
  active,
  time,
}: {
  image: string;
  name: string;
  role: string;
  active?: boolean;
  time?: string;
}) => (
  <div className="mb-6 flex items-center justify-between rounded-lg p-1.5 transition-colors hover:bg-buddy-muted-bg">
    <div className="flex items-center">
      <div className="mr-4">
        <Link href="#0">
          <Image src={image} alt={name} width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
        </Link>
      </div>
      <div>
        <Link href="#0">
          <h4 className="text-sm leading-tight font-medium text-buddy-text-dark">{name}</h4>
        </Link>
        <p className="text-[11px] leading-tight font-light text-buddy-text-secondary">{role}</p>
      </div>
    </div>
    <div>
      {active ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 14 14">
          <rect width="12" height="12" x="1" y="1" fill="#0ACF83" stroke="#fff" strokeWidth="2" rx="6" />
        </svg>
      ) : (
        <span className="text-[11px] leading-[21px] text-buddy-text-muted">{time}</span>
      )}
    </div>
  </div>
);

const YourFriendsCard = () => (
  <div className="mb-4 rounded-md bg-buddy-card-bg px-6 pt-6 pb-1.5">
    <div className="mb-6 flex items-center justify-between">
      <h4 className="m-0 text-xl leading-snug font-medium text-buddy-text-dark">Your Friends</h4>
      <Link href="#0" className="text-xs leading-[18px] font-medium text-[#1890FF]">
        See All
      </Link>
    </div>
    <form className="relative mb-6">
      <svg
        className="absolute top-3 left-[18px]"
        xmlns="http://www.w3.org/2000/svg"
        width="17"
        height="17"
        fill="none"
        viewBox="0 0 17 17"
      >
        <circle cx="7" cy="7" r="6" stroke="#666" />
        <path stroke="#666" strokeLinecap="round" d="M16 16l-3-3" />
      </svg>
      <input
        className="h-10 w-full rounded-[32px] border border-buddy-muted-bg bg-buddy-muted-bg py-2 pr-2 pl-[47px] text-sm text-buddy-text transition-colors outline-none placeholder:text-base placeholder:font-normal placeholder:text-buddy-text-muted hover:border-[#1890FF]"
        type="search"
        placeholder="input search text"
        aria-label="Search"
      />
    </form>
    <FriendItem image="/images/people1.png" name="Steve Jobs" role="CEO of Apple" time="5 minute ago" />
    <FriendItem image="/images/people2.png" name="Ryan Roslansky" role="CEO of Linkedin" active />
    <FriendItem image="/images/people3.png" name="Dylan Field" role="CEO of Figma" active />
    <FriendItem image="/images/people1.png" name="Steve Jobs" role="CEO of Apple" time="5 minute ago" />
    <FriendItem image="/images/people2.png" name="Ryan Roslansky" role="CEO of Linkedin" active />
    <FriendItem image="/images/people3.png" name="Dylan Field" role="CEO of Figma" active />
    <FriendItem image="/images/people3.png" name="Dylan Field" role="CEO of Figma" active />
    <FriendItem image="/images/people1.png" name="Steve Jobs" role="CEO of Apple" time="5 minute ago" />
  </div>
);

export const RightSidebar = () => {
  return (
    <div className="flex flex-col">
      <YouMightLikeCard />
      <YourFriendsCard />
    </div>
  );
};
