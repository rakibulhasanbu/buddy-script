"use client";

import { useEffect } from "react";

import { editProfileFormSchema, EditProfileFormValues } from "@/features/user/schemas";
import { ProfileUser } from "@/features/user/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
      photoUrl: user.photoUrl || "",
      coverUrl: user.coverUrl || "",
    },
  });

  useEffect(() => {
    reset({
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio || "",
      headline: user.headline || "",
      photoUrl: user.photoUrl || "",
      coverUrl: user.coverUrl || "",
    });
  }, [user, reset]);

  const handleFormSubmit = async (values: EditProfileFormValues) => {
    await onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update your public profile information.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 py-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#4A5568]">First Name</label>
            <input
              type="text"
              {...register("firstName")}
              className="h-11 w-full rounded-md border border-[#E8E8E8] px-3 text-sm outline-none focus:border-[#1890FF]"
            />
            {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#4A5568]">Last Name</label>
            <input
              type="text"
              {...register("lastName")}
              className="h-11 w-full rounded-md border border-[#E8E8E8] px-3 text-sm outline-none focus:border-[#1890FF]"
            />
            {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#4A5568]">Bio</label>
            <textarea
              {...register("bio")}
              rows={3}
              className="w-full resize-none rounded-md border border-[#E8E8E8] px-3 py-2 text-sm outline-none focus:border-[#1890FF]"
              placeholder="Tell people about yourself"
            />
            {errors.bio && <p className="mt-1 text-sm text-red-500">{errors.bio.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#4A5568]">Headline</label>
            <input
              type="text"
              {...register("headline")}
              className="h-11 w-full rounded-md border border-[#E8E8E8] px-3 text-sm outline-none focus:border-[#1890FF]"
              placeholder="CEO of something"
            />
            {errors.headline && <p className="mt-1 text-sm text-red-500">{errors.headline.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#4A5568]">Profile Photo URL</label>
            <input
              type="url"
              {...register("photoUrl")}
              className="h-11 w-full rounded-md border border-[#E8E8E8] px-3 text-sm outline-none focus:border-[#1890FF]"
              placeholder="https://example.com/photo.jpg"
            />
            {errors.photoUrl && <p className="mt-1 text-sm text-red-500">{errors.photoUrl.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#4A5568]">Cover Photo URL</label>
            <input
              type="url"
              {...register("coverUrl")}
              className="h-11 w-full rounded-md border border-[#E8E8E8] px-3 text-sm outline-none focus:border-[#1890FF]"
              placeholder="https://example.com/cover.jpg"
            />
            {errors.coverUrl && <p className="mt-1 text-sm text-red-500">{errors.coverUrl.message}</p>}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-[#DCDFE4] bg-white text-[#212121] hover:bg-[#F5F5F5]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#1890FF] text-white hover:bg-[#1890FF]/90 disabled:opacity-60"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
