import { cn } from "@/lib/utils";

type LogoProps = {
  size?: "sm" | "md" | "lg";
};

export const Logo = ({ size = "md" }: LogoProps) => {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };
  return <span className={cn("text-3xl font-semibold text-primary", sizeClasses[size])}>LOGO</span>;
};
