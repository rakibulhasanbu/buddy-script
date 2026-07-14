"use client";

import { useParams } from "next/navigation";

import { useGetUserByIdQuery } from "@/features/user/api";
import { ProfilePage } from "@/features/user/components/profile-page";
import { useAppSelector } from "@/redux/hook";

export default function UserProfilePageRoute() {
  const params = useParams();
  const userId = params.id as string;
  const currentUser = useAppSelector((state) => state.auth.user);
  const { data, isLoading, isError } = useGetUserByIdQuery(userId, { skip: !userId });

  const isOwner = currentUser?.id === userId;

  return <ProfilePage user={data?.data} isLoading={isLoading} isError={isError} isOwner={isOwner} />;
}
