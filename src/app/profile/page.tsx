"use client";

import { useGetMeQuery } from "@/features/user/api";
import { ProfilePage } from "@/features/user/components/profile-page";

export default function ProfilePageRoute() {
  const { data, isLoading, isError } = useGetMeQuery();

  return <ProfilePage user={data?.data} isLoading={isLoading} isError={isError} isOwner />;
}
