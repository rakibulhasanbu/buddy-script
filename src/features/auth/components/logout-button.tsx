"use client";

import { useRouter } from "next/navigation";

import { logoutAction } from "@/features/auth/actions";

interface LogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export const LogoutButton = ({ className, children }: LogoutButtonProps) => {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAction();
    router.push("/auth/sign-in");
  };

  return (
    <button type="button" onClick={handleLogout} className={className}>
      {children || "Log Out"}
    </button>
  );
};
