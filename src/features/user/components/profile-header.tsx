"use client";

import { useRef, useState } from "react";
import Image from "next/image";

import { useUploadImageMutation } from "@/features/feed/api";
import { useUpdateMeMutation } from "@/features/user/api";
import { PublicProfileUser } from "@/features/user/types";
import { validateImageSize } from "@/lib/utils";
import { format } from "date-fns";
import { Camera, Pencil } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

interface ProfileHeaderProps {
  user: PublicProfileUser;
  isOwner?: boolean;
  onEdit?: () => void;
}

export const ProfileHeader = ({ user, isOwner, onEdit }: ProfileHeaderProps) => {
  const [uploadImage] = useUploadImageMutation();
  const [updateMe] = useUpdateMeMutation();
  const [uploading, setUploading] = useState<"profile" | "cover" | null>(null);

  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File, type: "profile" | "cover") => {
    setUploading(type);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const uploadResult = await uploadImage(formData).unwrap();
      const imageUrl = uploadResult.data.url;

      await updateMe(type === "profile" ? { photoUrl: imageUrl } : { coverUrl: imageUrl }).unwrap();
      toast.success(type === "profile" ? "Profile photo updated" : "Cover photo updated");
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploading(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "profile" | "cover") => {
    const file = e.target.files?.[0];
    if (file) {
      if (!validateImageSize(file)) return;
      handleImageUpload(file, type);
    }
    e.target.value = "";
  };

  return (
    <div className="relative mb-6 rounded-md bg-buddy-card-bg shadow-[0_4px_8px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_8px_rgba(0,0,0,0.25)]">
      <input
        ref={profileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileChange(e, "profile")}
      />
      <input
        ref={coverInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileChange(e, "cover")}
      />

      {/* Cover */}
      <div className="group/cover relative h-48 overflow-hidden rounded-t-md md:h-72">
        {user.coverUrl ? (
          <Image src={user.coverUrl} alt={`${user.name} cover`} fill className="object-cover" priority />
        ) : (
          <div className="h-full w-full bg-gradient-to-r from-[#1890FF] to-[#00ACFF]" />
        )}

        {isOwner && (
          <button
            type="button"
            onClick={() => coverInputRef.current?.click()}
            disabled={uploading === "cover"}
            className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all hover:bg-black/30 hover:opacity-100 disabled:opacity-50"
            aria-label="Change cover photo"
          >
            <div className="flex items-center gap-2 rounded-full bg-black/50 px-4 py-2 text-white backdrop-blur-sm">
              <Camera className="h-4 w-4" />
              <span className="text-sm font-medium">{uploading === "cover" ? "Uploading..." : "Change Cover"}</span>
            </div>
          </button>
        )}
        {uploading === "cover" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
          </div>
        )}
      </div>

      {/* Avatar + Info */}
      <div className="relative px-6 pb-6">
        <div className="flex flex-col items-center md:flex-row md:items-end">
          <div className="relative -mt-16 mb-4 md:mb-0">
            <div className="group/profile relative h-32 w-32 overflow-hidden rounded-full border-4 border-buddy-card-bg bg-buddy-card-bg md:h-40 md:w-40">
              <Image
                src={user.photoUrl || "/images/profile.png"}
                alt={user.name}
                fill
                className="object-cover"
                priority
              />
              {isOwner && (
                <button
                  type="button"
                  onClick={() => profileInputRef.current?.click()}
                  disabled={uploading === "profile"}
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 opacity-0 transition-all hover:bg-black/30 hover:opacity-100 disabled:opacity-50"
                  aria-label="Edit profile photo"
                >
                  <Camera className="h-6 w-6 text-white drop-shadow" />
                </button>
              )}
            </div>
            {uploading === "profile" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:ml-6 md:text-left">
            <h1 className="text-2xl font-semibold text-buddy-text-dark md:text-3xl">{user.name}</h1>
            {user.headline ? <p className="mt-1 text-buddy-text">{user.headline}</p> : null}
            {user.bio ? (
              <p className="mt-1 max-w-xl text-buddy-text-secondary">{user.bio}</p>
            ) : (
              <p className="mt-1 text-buddy-text-muted">No bio yet</p>
            )}
            <p className="mt-2 text-sm text-buddy-text-muted">
              Member since {format(new Date(user.createdAt), "MMMM yyyy")}
            </p>
          </div>

          {isOwner && (
            <div className="mt-4 md:mt-0">
              <Button
                type="button"
                onClick={onEdit}
                variant="outline"
                className="h-10 gap-2 rounded-md border-buddy-border-color bg-buddy-card-bg px-5 text-sm font-medium text-buddy-text-dark hover:bg-buddy-muted-bg"
              >
                <Pencil className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
