"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { ThreeDotsIcon } from "./feed-icons";

const PostDropdown = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const items = [
    {
      label: "Save Post",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
          <path
            stroke="#1890FF"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.2"
            d="M14.25 15.75L9 12l-5.25 3.75v-12a1.5 1.5 0 011.5-1.5h7.5a1.5 1.5 0 011.5 1.5v12z"
          />
        </svg>
      ),
    },
    {
      label: "Turn On Notification",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" fill="none" viewBox="0 0 20 22">
          <path
            fill="#377DFF"
            fillRule="evenodd"
            d="M7.547 19.55c.533.59 1.218.915 1.93.915.714 0 1.403-.324 1.938-.916a.777.777 0 011.09-.056c.318.284.344.77.058 1.084-.832.917-1.927 1.423-3.086 1.423h-.002c-1.155-.001-2.248-.506-3.077-1.424a.762.762 0 01.057-1.083.774.774 0 011.092.057zM9.527 0c4.58 0 7.657 3.543 7.657 6.85 0 1.702.436 2.424.899 3.19.457.754.976 1.612.976 3.233-.36 4.14-4.713 4.478-9.531 4.478-4.818 0-9.172-.337-9.528-4.413-.003-1.686.515-2.544.973-3.299l.161-.27c.398-.679.737-1.417.737-2.918C1.871 3.543 4.948 0 9.528 0zm0 1.535c-3.6 0-6.11 2.802-6.11 5.316 0 2.127-.595 3.11-1.12 3.978-.422.697-.755 1.247-.755 2.444.173 1.93 1.455 2.944 7.986 2.944 6.494 0 7.817-1.06 7.988-3.01-.003-1.13-.336-1.681-.757-2.378-.526-.868-1.12-1.851-1.12-3.978 0-2.514-2.51-5.316-6.111-5.316z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      label: "Hide",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
          <path
            stroke="#1890FF"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.2"
            d="M14.25 2.25H3.75a1.5 1.5 0 00-1.5 1.5v10.5a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5V3.75a1.5 1.5 0 00-1.5-1.5zM6.75 6.75l4.5 4.5M11.25 6.75l-4.5 4.5"
          />
        </svg>
      ),
    },
    {
      label: "Edit Post",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
          <path
            stroke="#1890FF"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.2"
            d="M8.25 3H3a1.5 1.5 0 00-1.5 1.5V15A1.5 1.5 0 003 16.5h10.5A1.5 1.5 0 0015 15V9.75"
          />
          <path
            stroke="#1890FF"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.2"
            d="M13.875 1.875a1.591 1.591 0 112.25 2.25L9 11.25 6 12l.75-3 7.125-7.125z"
          />
        </svg>
      ),
    },
    {
      label: "Delete Post",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
          <path
            stroke="#1890FF"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.2"
            d="M2.25 4.5h13.5M6 4.5V3a1.5 1.5 0 011.5-1.5h3A1.5 1.5 0 0112 3v1.5m2.25 0V15a1.5 1.5 0 01-1.5 1.5h-7.5a1.5 1.5 0 01-1.5-1.5V4.5h10.5zM7.5 8.25v4.5M10.5 8.25v4.5"
          />
        </svg>
      ),
    },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="cursor-pointer border-none bg-transparent p-1 outline-none"
      >
        <ThreeDotsIcon />
      </button>
      {open && (
        <div className="absolute top-6 right-0 z-50 w-50 rounded-md bg-white p-2 shadow-[0_8px_24px_rgba(149,157,165,0.2)]">
          <ul>
            {items.map((item) => (
              <li key={item.label}>
                <Link href="#0" className="flex items-center gap-2 px-2 py-2 text-sm text-[#212121] hover:bg-[#f5f5f5]">
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const CommentBox = () => {
  const [comment, setComment] = useState("");

  return (
    <div className="rounded-[18px] bg-[#F6F6F6] p-1">
      <form className="flex flex-wrap items-center justify-between">
        <div className="flex flex-1 items-center">
          <div className="shrink-0">
            <Image src="/images/comment_img.png" alt="" width={26} height={26} className="h-6.5 w-6.5" />
          </div>
          <div className="relative w-full">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="h-10 w-full resize-none border-none bg-transparent p-2 text-sm outline-none"
              placeholder="Write a comment"
            />
          </div>
        </div>
        <div className="flex items-center">
          <button type="button" className="border-none bg-transparent p-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
              <path
                fill="#000"
                fillOpacity=".46"
                fillRule="evenodd"
                d="M13.167 6.534a.5.5 0 01.5.5c0 3.061-2.35 5.582-5.333 5.837V14.5a.5.5 0 01-1 0v-1.629C4.35 12.616 2 10.096 2 7.034a.5.5 0 011 0c0 2.679 2.168 4.859 4.833 4.859 2.666 0 4.834-2.18 4.834-4.86a.5.5 0 01.5-.5zM7.833.667a3.218 3.218 0 013.208 3.22v3.126c0 1.775-1.439 3.22-3.208 3.22a3.218 3.218 0 01-3.208-3.22V3.887c0-1.776 1.44-3.22 3.208-3.22zm0 1a2.217 2.217 0 00-2.208 2.22v3.126c0 1.223.991 2.22 2.208 2.22a2.217 2.217 0 002.208-2.22V3.887c0-1.224-.99-2.22-2.208-2.22z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button type="button" className="border-none bg-transparent p-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
              <path
                fill="#000"
                fillOpacity=".46"
                fillRule="evenodd"
                d="M10.867 1.333c2.257 0 3.774 1.581 3.774 3.933v5.435c0 2.352-1.517 3.932-3.774 3.932H5.101c-2.254 0-3.767-1.58-3.767-3.932V5.266c0-2.352 1.513-3.933 3.767-3.933h5.766zm0 1H5.101c-1.681 0-2.767 1.152-2.767 2.933v5.435c0 1.782 1.086 2.932 2.767 2.932h5.766c1.685 0 2.774-1.15 2.774-2.932V5.266c0-1.781-1.089-2.933-2.774-2.933zm.426 5.733l.017.015.013.013.009.008.037.037c.12.12.453.46 1.443 1.477a.5.5 0 11-.716.697S10.73 8.91 10.633 8.816a.614.614 0 00-.433-.118.622.622 0 00-.421.225c-1.55 1.88-1.568 1.897-1.594 1.922a1.456 1.456 0 01-2.057-.021s-.62-.63-.63-.642c-.155-.143-.43-.134-.594.04l-1.02 1.076a.498.498 0 01-.707.018.499.499 0 01-.018-.706l1.018-1.075c.54-.573 1.45-.6 2.025-.06l.639.647c.178.18.467.184.646.008l1.519-1.843a1.618 1.618 0 011.098-.584c.433-.038.854.088 1.19.363zM5.706 4.42c.921 0 1.67.75 1.67 1.67 0 .92-.75 1.67-1.67 1.67-.92 0-1.67-.75-1.67-1.67 0-.921.75-1.67 1.67-1.67zm0 1a.67.67 0 10.001 1.34.67.67 0 00-.002-1.34z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

const Comment = () => {
  const [liked, setLiked] = useState(false);

  return (
    <div className="flex gap-3">
      <div className="shrink-0">
        <Link href="#0">
          <Image src="/images/txt_img.png" alt="" width={40} height={40} className="h-10 w-10 rounded-full" />
        </Link>
      </div>
      <div className="flex-1">
        <div>
          <div className="mb-1">
            <Link href="#0">
              <h4 className="text-sm font-medium text-[#212121]">Radovan SkillArena</h4>
            </Link>
          </div>
          <div className="mb-1">
            <p className="text-sm leading-relaxed text-[#666666]">
              <span>
                It is a long established fact that a reader will be distracted by the readable content of a page when
                looking at its layout.
              </span>
            </p>
          </div>
          <div className="mb-1 flex items-center gap-1">
            <div className="flex">
              <span className="text-[#1890FF]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
                </svg>
              </span>
              <span className="ml-1 text-[#FF4D4F]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
              </span>
            </div>
            <span className="text-sm text-[#212121]">198</span>
          </div>
          <div className="mb-2">
            <ul className="flex items-center gap-1 text-sm text-[#666666]">
              <li>
                <button
                  type="button"
                  onClick={() => setLiked(!liked)}
                  className={`cursor-pointer ${liked ? "text-[#1890FF]" : ""}`}
                >
                  Like.
                </button>
              </li>
              <li>
                <button type="button" className="cursor-pointer">
                  Reply.
                </button>
              </li>
              <li>
                <button type="button" className="cursor-pointer">
                  Share
                </button>
              </li>
              <li>
                <span className="text-[#1890FF]">.21m</span>
              </li>
            </ul>
          </div>
        </div>
        <CommentBox />
      </div>
    </div>
  );
};

export const TimelinePost = () => {
  const [liked, setLiked] = useState(false);

  return (
    <div className="mb-4 rounded-md bg-white px-6 pt-6 pb-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex cursor-pointer items-center">
          <div className="mr-4">
            <Image
              src="/images/post_img.png"
              alt=""
              width={44}
              height={44}
              className="h-11 w-11 rounded-full transition-opacity hover:opacity-70"
            />
          </div>
          <div>
            <h4 className="text-base leading-tight font-normal text-black transition-colors hover:underline">
              Karim Saif
            </h4>
            <p className="text-sm leading-tight text-[rgba(0,0,0,0.46)]">
              5 minute ago .{" "}
              <Link href="#0" className="text-[rgba(0,0,0,0.46)] transition-colors hover:underline">
                Public
              </Link>
            </p>
          </div>
        </div>
        <PostDropdown />
      </div>

      <h4 className="mb-4 text-sm leading-5.25 font-normal text-black">-Healthy Tracking App</h4>
      <div className="mb-6">
        <Image src="/images/timeline_img.png" alt="" width={600} height={400} className="h-auto w-full rounded-md" />
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div className="flex cursor-pointer items-center">
          <Image
            src="/images/react_img1.png"
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 rounded-full border border-white bg-[#C4C4C4]"
          />
          <Image
            src="/images/react_img2.png"
            alt=""
            width={32}
            height={32}
            className="-ml-4 h-8 w-8 rounded-full border border-white bg-[#C4C4C4]"
          />
          <Image
            src="/images/react_img3.png"
            alt=""
            width={32}
            height={32}
            className="-ml-4 hidden h-8 w-8 rounded-full border border-white bg-[#C4C4C4] sm:block"
          />
          <Image
            src="/images/react_img4.png"
            alt=""
            width={32}
            height={32}
            className="-ml-4 hidden h-8 w-8 rounded-full border border-white bg-[#C4C4C4] sm:block"
          />
          <Image
            src="/images/react_img5.png"
            alt=""
            width={32}
            height={32}
            className="-ml-4 hidden h-8 w-8 rounded-full border border-white bg-[#C4C4C4] sm:block"
          />
          <span className="-ml-4 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#1890FF] text-sm leading-5.25 font-normal text-white">
            9+
          </span>
        </div>
        <div className="flex">
          <p className="mx-4 text-sm leading-tight font-normal text-[rgba(0,0,0,0.46)]">
            <Link href="#0" className="text-[rgba(0,0,0,0.46)]">
              <span className="text-[#212121]">12</span> Comment
            </Link>
          </p>
          <p className="text-sm leading-tight font-normal text-[rgba(0,0,0,0.46)]">
            <span className="text-[#212121]">122</span> Share
          </p>
        </div>
      </div>

      <div className="flex bg-[#FBFCFD] p-2">
        <button
          type="button"
          onClick={() => setLiked(!liked)}
          className={`mr-1 flex flex-1 cursor-pointer items-center justify-center rounded-md border-none py-3 text-sm leading-5.25 font-normal text-black transition-colors ${liked ? "bg-[#e4f1fd]" : "bg-transparent hover:bg-[#e4f1fd]"}`}
        >
          <span className="mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" viewBox="0 0 19 19">
              <path fill="#FFCC4D" d="M9.5 19a9.5 9.5 0 100-19 9.5 9.5 0 000 19z" />
              <path
                fill="#664500"
                d="M9.5 11.083c-1.912 0-3.181-.222-4.75-.527-.358-.07-1.056 0-1.056 1.055 0 2.111 2.425 4.75 5.806 4.75 3.38 0 5.805-2.639 5.805-4.75 0-1.055-.697-1.125-1.055-1.055-1.57.305-2.838.527-4.75.527z"
              />
              <path
                fill="#fff"
                d="M4.75 11.611s1.583.528 4.75.528 4.75-.528 4.75-.528-1.056 2.111-4.75 2.111-4.75-2.11-4.75-2.11z"
              />
              <path
                fill="#664500"
                d="M6.333 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847zM12.667 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847z"
              />
            </svg>
          </span>
          Haha
        </button>
        <button
          type="button"
          className="mr-1 flex flex-1 cursor-pointer items-center justify-center rounded-md border-none bg-transparent py-3 text-sm leading-5.25 font-normal text-black transition-colors hover:bg-[#e4f1fd]"
        >
          <span className="mr-2">
            <svg
              className="text-black"
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="21"
              fill="none"
              viewBox="0 0 21 21"
            >
              <path
                stroke="currentColor"
                d="M1 10.5c0-.464 0-.696.009-.893A9 9 0 019.607 1.01C9.804 1 10.036 1 10.5 1v0c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H10.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C1 11.196 1 10.964 1 10.5v0z"
              />
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.938 9.313h7.125M10.5 14.063h3.563"
              />
            </svg>
          </span>
          Comment
        </button>
        <button
          type="button"
          className="flex flex-1 cursor-pointer items-center justify-center rounded-md border-none bg-transparent py-3 text-sm leading-5.25 font-normal text-black transition-colors hover:bg-[#e4f1fd]"
        >
          <span className="mr-2">
            <svg
              className="text-black"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="21"
              fill="none"
              viewBox="0 0 24 21"
            >
              <path
                stroke="currentColor"
                strokeLinejoin="round"
                d="M23 10.5L12.917 1v5.429C3.267 6.429 1 13.258 1 20c2.785-3.52 5.248-5.429 11.917-5.429V20L23 10.5z"
              />
            </svg>
          </span>
          Share
        </button>
      </div>

      <div className="px-6 pt-6 pb-2">
        <CommentBox />
      </div>

      <div className="mt-4">
        <button type="button" className="mb-3 cursor-pointer text-sm text-[rgba(0,0,0,0.46)]">
          View 4 previous comments
        </button>
        <Comment />
      </div>
    </div>
  );
};
