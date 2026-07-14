"use client";

import { useState } from "react";

import { setUser } from "@/features/auth/slice";
import { useUpdateMeMutation } from "@/features/user/api";
import { EditProfileForm } from "@/features/user/components/edit-profile-form";
import { ProfileHeader } from "@/features/user/components/profile-header";
import { UserPosts } from "@/features/user/components/user-posts";
import { EditProfileFormValues } from "@/features/user/schemas";
import { ProfileUser, PublicProfileUser } from "@/features/user/types";
import { useAppDispatch } from "@/redux/hook";
import { toast } from "sonner";

import { ProfileSkeleton } from "@/components/shared/profile-skeleton";

interface ProfilePageProps {
  user?: ProfileUser | PublicProfileUser;
  isLoading: boolean;
  isError: boolean;
  isOwner?: boolean;
}

export const ProfilePage = ({ user, isLoading, isError, isOwner }: ProfilePageProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updateMe, { isLoading: isUpdating }] = useUpdateMeMutation();
  const dispatch = useAppDispatch();

  const handleUpdate = async (values: EditProfileFormValues) => {
    try {
      const result = await updateMe(values).unwrap();
      dispatch(setUser(result.data));
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (isError || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-md bg-buddy-card-bg p-8 text-center shadow-[0_4px_8px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_8px_rgba(0,0,0,0.25)]">
          <h2 className="mb-2 text-xl font-medium text-buddy-text-dark">Something went wrong</h2>
          <p className="text-buddy-text-secondary">We could not load this profile. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-buddy-page-bg pb-8">
      <div className="container mx-auto max-w-6xl px-4 pt-6">
        <ProfileHeader user={user} isOwner={isOwner} onEdit={() => setIsEditing(true)} />

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <div className="space-y-4">
            <div className="rounded-md bg-buddy-card-bg p-5 shadow-[0_4px_8px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_8px_rgba(0,0,0,0.25)]">
              <h3 className="mb-4 text-lg font-medium text-buddy-text-dark">Intro</h3>
              {user.bio ? (
                <p className="text-buddy-text-secondary">{user.bio}</p>
              ) : (
                <p className="text-sm text-buddy-text-muted">No bio added yet.</p>
              )}
            </div>
          </div>

          {/* Posts */}
          <div>
            <div className="mb-4 rounded-md bg-buddy-card-bg p-4 shadow-[0_4px_8px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_8px_rgba(0,0,0,0.25)]">
              <h3 className="text-lg font-medium text-buddy-text-dark">Posts</h3>
            </div>
            <UserPosts userId={user.id} />
          </div>
        </div>
      </div>

      {isOwner && user && "email" in user && (
        <EditProfileForm
          user={user as ProfileUser}
          open={isEditing}
          onOpenChange={setIsEditing}
          onSubmit={handleUpdate}
          isLoading={isUpdating}
        />
      )}
    </div>
  );
};
