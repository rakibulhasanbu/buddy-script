"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { useUploadImageMutation } from "@/features/feed/api";
import { editProfileFormSchema, EditProfileFormValues } from "@/features/user/schemas";
import { ProfileUser } from "@/features/user/types";
import { validateImageSize } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EditProfileFormProps {
  user: ProfileUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: EditProfileFormValues) => Promise<void>;
  isLoading?: boolean;
}

export const EditProfileForm = ({ user, open, onOpenChange, onSubmit, isLoading }: EditProfileFormProps) => {
  const [uploadImage] = useUploadImageMutation();
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [uploadedProfileUrl, setUploadedProfileUrl] = useState<string | null>(null);
  const [uploadedCoverUrl, setUploadedCoverUrl] = useState<string | null>(null);
  const [uploadingField, setUploadingField] = useState<"profile" | "cover" | null>(null);

  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileFormSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio || "",
      headline: user.headline || "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        bio: user.bio || "",
        headline: user.headline || "",
      });
    }
  }, [user, reset, open]);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>, type: "profile" | "cover") => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!validateImageSize(file)) return;

    const previewUrl = URL.createObjectURL(file);
    if (type === "profile") {
      setProfilePreview(previewUrl);
      setUploadingField("profile");
    } else {
      setCoverPreview(previewUrl);
      setUploadingField("cover");
    }

    try {
      const formData = new FormData();
      formData.append("image", file);
      const result = await uploadImage(formData).unwrap();
      if (type === "profile") {
        setUploadedProfileUrl(result.data.url);
      } else {
        setUploadedCoverUrl(result.data.url);
      }
      toast.success(type === "profile" ? "Profile photo uploaded" : "Cover photo uploaded");
    } catch {
      toast.error("Failed to upload image");
      if (type === "profile") {
        setProfilePreview(null);
      } else {
        setCoverPreview(null);
      }
    } finally {
      setUploadingField(null);
    }

    e.target.value = "";
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setProfilePreview(null);
      setCoverPreview(null);
      setUploadedProfileUrl(null);
      setUploadedCoverUrl(null);
    }
    onOpenChange(nextOpen);
  };

  const handleFormSubmit = async (values: EditProfileFormValues) => {
    const submitValues: EditProfileFormValues = { ...values };
    if (uploadedProfileUrl) {
      submitValues.photoUrl = uploadedProfileUrl;
    }
    if (uploadedCoverUrl) {
      submitValues.coverUrl = uploadedCoverUrl;
    }
    await onSubmit(submitValues);
    onOpenChange(false);
  };

  const currentProfilePhoto = profilePreview || user.photoUrl || "/images/profile.png";
  const currentCoverPhoto = coverPreview || user.coverUrl;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update your public profile information.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5 py-2">
          {/* Cover Photo */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-buddy-text">Cover Photo</label>
            <div className="relative h-32 overflow-hidden rounded-md">
              {currentCoverPhoto ? (
                <Image src={currentCoverPhoto} alt="Cover" fill className="object-cover" />
              ) : (
                <div className="h-full w-full bg-gradient-to-r from-[#1890FF] to-[#00ACFF]" />
              )}
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                disabled={uploadingField === "cover"}
                className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors hover:bg-black/30"
                aria-label="Change cover photo"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm">
                  <Camera className="h-5 w-5" />
                </div>
              </button>
              {uploadingField === "cover" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                </div>
              )}
            </div>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageSelect(e, "cover")}
            />
          </div>

          {/* Profile Photo */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-buddy-text">Profile Photo</label>
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-buddy-border-color">
                <Image src={currentProfilePhoto} alt="Profile" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => profileInputRef.current?.click()}
                  disabled={uploadingField === "profile"}
                  className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors hover:bg-black/30"
                  aria-label="Change profile photo"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm">
                    <Camera className="h-4 w-4" />
                  </div>
                </button>
                {uploadingField === "profile" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  </div>
                )}
              </div>
              <p className="text-sm text-buddy-text-muted">Click the camera icon to upload a new profile photo</p>
            </div>
            <input
              ref={profileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageSelect(e, "profile")}
            />
          </div>

          <div className="h-px bg-buddy-border-color" />

          {/* Text Fields */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-buddy-text">First Name</label>
            <input
              type="text"
              {...register("firstName")}
              className="h-11 w-full rounded-md border border-buddy-input-border bg-buddy-page-bg px-3 text-sm text-buddy-text outline-none focus:border-primary"
            />
            {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-buddy-text">Last Name</label>
            <input
              type="text"
              {...register("lastName")}
              className="h-11 w-full rounded-md border border-buddy-input-border bg-buddy-page-bg px-3 text-sm text-buddy-text outline-none focus:border-primary"
            />
            {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-buddy-text">Bio</label>
            <textarea
              {...register("bio")}
              rows={3}
              className="w-full resize-none rounded-md border border-buddy-input-border bg-buddy-page-bg px-3 py-2 text-sm text-buddy-text outline-none focus:border-primary"
              placeholder="Tell people about yourself"
            />
            {errors.bio && <p className="mt-1 text-sm text-red-500">{errors.bio.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-buddy-text">Headline</label>
            <input
              type="text"
              {...register("headline")}
              className="h-11 w-full rounded-md border border-buddy-input-border bg-buddy-page-bg px-3 text-sm text-buddy-text outline-none focus:border-primary"
              placeholder="CEO of something"
            />
            {errors.headline && <p className="mt-1 text-sm text-red-500">{errors.headline.message}</p>}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="border-buddy-border-color bg-buddy-card-bg text-buddy-text-dark hover:bg-buddy-muted-bg"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || uploadingField !== null}
              className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
