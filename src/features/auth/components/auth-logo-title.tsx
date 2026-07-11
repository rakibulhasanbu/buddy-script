"use client";

import Image from "next/image";

import logo from "@/assets/images/logo.svg";

interface AuthLogoTitleProps {
  subtitle: string;
  title: string;
}

export const AuthLogoTitle = ({ subtitle, title }: AuthLogoTitleProps) => {
  return (
    <div className="mb-[50px] flex flex-col items-center text-center">
      <Image src={logo} alt="Buddy Script" className="mb-7 h-auto w-[161px]" />
      <p className="mb-2 text-base leading-snug font-normal text-buddy-text-secondary">{subtitle}</p>
      <h4 className="text-[28px] leading-tight font-medium text-buddy-text-dark">{title}</h4>
    </div>
  );
};
