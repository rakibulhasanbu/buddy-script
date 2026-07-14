import { User } from "@/features/auth/types";

export type ProfileUser = User & {
  bio: string | null;
  coverUrl: string | null;
};

export type PublicProfileUser = Omit<ProfileUser, "email" | "isBlocked" | "updatedAt">;

export type UpdateProfileInput = {
  firstName?: string;
  lastName?: string;
  bio?: string;
  photoUrl?: string;
  coverUrl?: string;
};
