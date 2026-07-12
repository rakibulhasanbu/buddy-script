"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  const handleSubmit = () => {
    console.log({ email, password, remember });
  };

  return (
    <div className="rounded-md bg-white p-12">
      <div className="mx-auto mb-7 max-w-[161px]">
        <Image src="/images/logo.svg" alt="Buddy Script" width={161} height={40} className="h-auto w-[161px]" />
      </div>
      <p className="mb-2 text-center text-base leading-snug font-normal text-[#2D3748]">Welcome back</p>
      <h4 className="mb-[50px] text-center text-[28px] font-medium text-[#212121]">Login to your account</h4>

      <button
        type="button"
        className="mb-10 flex w-full items-center justify-center rounded-md border border-[#F0F2F5] bg-white px-[60px] py-3 transition-shadow hover:shadow-md"
      >
        <Image src="/images/google.svg" alt="Google" width={20} height={20} className="mr-2 h-5 w-5" />
        <span className="text-base leading-snug font-medium whitespace-nowrap text-[#312000]">
          Or sign-in with google
        </span>
      </button>

      <div className="relative mb-10 text-center">
        <span className="relative z-10 bg-white px-2 text-sm leading-snug font-normal text-[#C4C4C4]">Or</span>
        <span className="absolute top-1/2 left-0 h-[2px] w-[108px] -translate-y-1/2 bg-[#DFDFDF]" />
        <span className="absolute top-1/2 right-0 h-[2px] w-[108px] -translate-y-1/2 bg-[#DFDFDF]" />
      </div>

      <form className="w-full">
        <div className="mb-[14px]">
          <label className="mb-2 block text-base leading-snug font-medium text-[#4A5568]">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 w-full rounded-md border border-[#E8E8E8] bg-white px-4 text-sm outline-none placeholder:text-[13px] placeholder:font-normal placeholder:text-[#2D3748]"
          />
        </div>
        <div className="mb-[14px]">
          <label className="mb-2 block text-base leading-snug font-medium text-[#4A5568]">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 w-full rounded-md border border-[#E8E8E8] bg-white px-4 text-sm outline-none placeholder:text-[13px] placeholder:font-normal placeholder:text-[#2D3748]"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="peer sr-only"
            />
            <span className="flex h-4 w-4 items-center justify-center rounded-full border border-[#666666] transition-colors peer-checked:border-[#1890FF] peer-checked:bg-transparent">
              <span className="h-2 w-2 rounded-full bg-[#1890FF] opacity-0 transition-opacity peer-checked:opacity-100" />
            </span>
            <span className="text-sm leading-snug font-normal text-[#2D3748]">Remember me</span>
          </label>
          <Link href="#0" className="text-sm leading-snug font-normal text-[#1890FF]">
            Forgot password?
          </Link>
        </div>

        <div className="mt-10 mb-[60px]">
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full cursor-pointer rounded-md border border-transparent bg-[#1890FF] px-[116px] py-3 text-base font-medium text-white transition-shadow hover:shadow-md"
          >
            Login now
          </button>
        </div>
      </form>

      <p className="text-center text-sm text-[#2D3748]">
        Dont have an account?{" "}
        <Link href="/auth/sign-up" className="text-[#1890FF]">
          Create New Account
        </Link>
      </p>
    </div>
  );
};
