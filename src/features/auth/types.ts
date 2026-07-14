import { LucideIcon } from "lucide-react";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  confirm_password: string;
}

export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
  SELLER = "SELLER",
  EMPLOYEE = "EMPLOYEE",
}

export interface User {
  id: string;
  email: string;
  isBlocked: boolean;
  firstName: string;
  lastName: string;
  name: string;
  createdAt: string;
  photoUrl: string;
  coverUrl: string | null;
  bio: string | null;
  headline: string | null;
  role: UserRole;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface AuthPayload {
  name: string;
  email: string;
  password: string;
  action: "login" | "register";
  callbackUrl: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
  activeSubPaths?: string[];
  excludePaths?: string[];
}
