"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { useCreatePostMutation, useUpdatePostMutation, useUploadImageMutation } from "@/features/feed/api";
import { EVisibility, Post } from "@/features/feed/types";
import { validateImageSize } from "@/lib/utils";
import { useAppSelector } from "@/redux/hook";
import { Globe, ImageIcon, Lock, MapPin, MoreHorizontal, Smile, UserPlus, Video, X } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";

interface PostComposerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: "create" | "edit";
  post?: Post;
  onPostCreated?: () => void;
}

const AddButton = ({
  icon,
  label,
  onClick,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={label}
    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-buddy-muted-bg disabled:cursor-not-allowed disabled:opacity-40"
  >
    {icon}
  </button>
);

export const PostComposerModal = ({
  open,
  onOpenChange,
  mode = "create",
  post,
  onPostCreated,
}: PostComposerModalProps) => {
  const currentUser = useAppSelector((state) => state.auth.user);

  const [text, setText] = useState(() => (mode === "edit" && post ? post.content : ""));
  const [visibility, setVisibility] = useState<EVisibility>(() =>
    mode === "edit" && post ? post.visibility : EVisibility.PUBLIC
  );
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(() =>
    mode === "edit" && post ? post.imageUrl : null
  );
  const [imageRemoved, setImageRemoved] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [createPost, { isLoading: isCreating }] = useCreatePostMutation();
  const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation();
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();

  const isLoading = isCreating || isUpdating || isUploading;

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [text]);

  useEffect(() => {
    return () => {
      if (image && imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [image, imagePreview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (!validateImageSize(file)) return;
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setImageRemoved(false);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImageRemoved(true);
    if (imagePreview && image) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    if (isLoading) return;
    onOpenChange(false);
  };

  const handleSubmit = async () => {
    const trimmed = text.trim();
    if (!trimmed && !imagePreview) {
      toast.error("Please write something or add a photo");
      return;
    }

    try {
      let imageUrl: string | null | undefined = undefined;

      if (imageRemoved) {
        imageUrl = null;
      } else if (image) {
        const formData = new FormData();
        formData.append("image", image);
        const uploadResult = await uploadImage(formData).unwrap();
        imageUrl = uploadResult.data.url;
      }

      if (mode === "edit" && post) {
        await updatePost({
          id: post.id,
          body: {
            content: trimmed,
            visibility,
            imageUrl,
          },
        }).unwrap();
        toast.success("Post updated successfully");
      } else {
        await createPost({
          content: trimmed,
          imageUrl: imageUrl || undefined,
          visibility,
        }).unwrap();
        toast.success("Post created successfully");
        onPostCreated?.();
      }

      handleClose();
    } catch {
      toast.error(mode === "edit" ? "Failed to update post" : "Failed to create post");
    }
  };

  if (!currentUser) return null;

  const canSubmit = (text.trim() || imagePreview) && !isLoading;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[32rem] gap-0 overflow-hidden p-0 sm:max-w-[32rem]">
        <DialogHeader className="border-b px-4 py-3">
          <DialogTitle className="text-center text-base font-bold text-buddy-text-dark">
            {mode === "edit" ? "Edit post" : "Create post"}
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto p-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={currentUser.photoUrl || "/images/Avatar.png"} alt={currentUser.name} />
              <AvatarFallback>{currentUser.firstName?.[0] || currentUser.name?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-buddy-text-dark">{currentUser.name}</p>
              <Select value={visibility} onValueChange={(value) => setVisibility(value as EVisibility)}>
                <SelectTrigger className="mt-0.5 h-7 gap-1 rounded-md border-buddy-border-color bg-buddy-muted-bg px-2 text-xs text-buddy-text-secondary">
                  <SelectValue placeholder="Privacy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={EVisibility.PUBLIC}>
                    <span className="flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5" />
                      Public
                    </span>
                  </SelectItem>
                  <SelectItem value={EVisibility.PRIVATE}>
                    <span className="flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5" />
                      Private
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`What's on your mind, ${currentUser.firstName}?`}
            rows={3}
            className="mt-3 min-h-[120px] w-full resize-none border-none bg-transparent px-0 text-lg text-buddy-text placeholder:text-buddy-text-muted focus:outline-none"
          />

          {imagePreview && (
            <div className="relative mt-3 overflow-hidden rounded-lg border border-buddy-border-color">
              <Image
                src={imagePreview}
                alt="Post preview"
                width={600}
                height={400}
                className="h-auto w-full object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-buddy-card-bg/90 text-buddy-text-dark shadow-sm transition-colors hover:bg-buddy-card-bg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="mt-4 rounded-xl border border-buddy-border-color p-3">
            <p className="mb-1 px-1 text-sm font-semibold text-buddy-text-dark">Add to your post</p>
            <div className="flex items-center justify-between">
              <AddButton
                icon={<ImageIcon className="h-6 w-6 text-green-500" />}
                label="Photo"
                onClick={() => fileInputRef.current?.click()}
              />
              <AddButton icon={<UserPlus className="h-6 w-6 text-blue-500" />} label="Tag people" disabled />
              <AddButton icon={<Smile className="h-6 w-6 text-yellow-500" />} label="Feeling/activity" disabled />
              <AddButton icon={<MapPin className="h-6 w-6 text-red-500" />} label="Check in" disabled />
              <AddButton icon={<Video className="h-6 w-6 text-red-600" />} label="Live video" disabled />
              <AddButton
                icon={<MoreHorizontal className="h-6 w-6 text-buddy-text-secondary" />}
                label="More"
                disabled
              />
            </div>
          </div>
        </div>

        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

        <div className="border-t p-4">
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="h-10 w-full bg-primary text-primary-foreground hover:bg-buddy-primary-hover disabled:opacity-50"
          >
            {isLoading ? <Spinner className="mr-2 h-4 w-4" /> : mode === "edit" ? "Save" : "Post"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
