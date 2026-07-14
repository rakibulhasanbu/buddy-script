"use client";

import Image from "next/image";

const publicStories = [
  { image: "/images/card_ppl2.png", mini: "/images/mini_pic.png", name: "Ryan Roslansky" },
  { image: "/images/card_ppl3.png", mini: "/images/mini_pic.png", name: "Ryan Roslansky" },
  { image: "/images/card_ppl4.png", mini: "/images/mini_pic.png", name: "Ryan Roslansky" },
];

export const StoriesSection = () => {
  return (
    <>
      {/* Desktop */}
      <div className="relative mb-4 hidden lg:block">
        <div className="absolute top-1/2 -right-1 z-[18] -translate-y-1/2">
          <button
            type="button"
            className="flex h-6 w-6 items-center justify-center rounded-full border border-buddy-page-bg bg-[#1890FF] px-[7px] py-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="9" height="8" fill="none" viewBox="0 0 9 8">
              <path
                fill="#fff"
                d="M8 4l.366-.341.318.341-.318.341L8 4zm-7 .5a.5.5 0 010-1v1zM5.566.659l2.8 3-.732.682-2.8-3L5.566.66zm2.8 3.682l-2.8 3-.732-.682 2.8-3 .732.682zM8 4.5H1v-1h7v1z"
              />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div className="relative cursor-pointer overflow-hidden rounded-md transition-opacity hover:opacity-90">
            <div className="relative z-[2]">
              <Image
                src="/images/card_ppl1.png"
                alt="Your Story"
                width={300}
                height={400}
                className="h-auto w-full rounded-md"
              />
              <div className="absolute bottom-0 z-[1] w-full rounded-t-[25.5px] rounded-b-md bg-[#112032] pt-8">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#112032] bg-[#1890FF]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10">
                      <path stroke="#fff" strokeLinecap="round" d="M.5 4.884h9M4.884 9.5v-9" />
                    </svg>
                  </button>
                </div>
                <p className="mb-2.5 text-center text-xs leading-[19px] font-medium text-white">Your Story</p>
              </div>
              <div className="absolute inset-0 z-0 rounded-md bg-black opacity-50" />
            </div>
          </div>
          {publicStories.map((story, index) => (
            <div
              key={index}
              className="relative cursor-pointer overflow-hidden rounded-md transition-opacity hover:opacity-90"
            >
              <div className="relative z-[2]">
                <Image
                  src={story.image}
                  alt={story.name}
                  width={300}
                  height={400}
                  className="h-auto w-full rounded-md"
                />
                <div className="absolute bottom-0 z-[1] w-full">
                  <p className="mb-2.5 text-center text-xs leading-[19px] font-medium text-white">{story.name}</p>
                </div>
                <div className="absolute top-3 right-3 z-[1]">
                  <Image
                    src={story.mini}
                    alt="Mini"
                    width={28}
                    height={28}
                    className="h-7 w-7 rounded-full border-2 border-white bg-[#C4C4C4]"
                  />
                </div>
                <div className="absolute inset-0 z-0 rounded-md bg-black opacity-50 transition-opacity hover:opacity-70" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile */}
      <div className="mb-4 block lg:hidden">
        <div className="overflow-x-auto">
          <ul className="flex gap-3 px-1">
            <li className="flex-shrink-0">
              <button type="button" className="block text-center">
                <div className="relative">
                  <Image
                    src="/images/mobile_story_img.png"
                    alt="Your Story"
                    width={60}
                    height={80}
                    className="h-20 w-[60px] rounded-full object-cover"
                  />
                  <div className="absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#1890FF]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 12 12">
                      <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" d="M6 2.5v7M2.5 6h7" />
                    </svg>
                  </div>
                </div>
                <p className="mt-1 text-xs text-buddy-text-dark">Your Story</p>
              </button>
            </li>
            {[...Array(7)].map((_, i) => (
              <li key={i} className="flex-shrink-0">
                <button type="button" className="block text-center">
                  <Image
                    src={i % 2 === 0 ? "/images/mobile_story_img1.png" : "/images/mobile_story_img2.png"}
                    alt="Story"
                    width={60}
                    height={80}
                    className="h-20 w-[60px] rounded-full object-cover"
                  />
                  <p className="mt-1 text-xs text-buddy-text-dark">Ryan...</p>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
