"use client";

import { useRef, useState } from "react";
import Image from "next/image";

import { useCreatePostMutation, useUploadImageMutation } from "@/features/feed/api";
import { EVisibility } from "@/features/feed/types";
import { toast } from "sonner";

import { Spinner } from "@/components/ui/spinner";

const ActionButton = ({ icon, label, onClick }: { icon: React.ReactNode; label?: string; onClick?: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex cursor-pointer items-center px-2.5 py-0 transition-colors hover:text-[#1890FF]"
  >
    <span className="mr-2">{icon}</span>
    {label && (
      <span className="text-base leading-5.75 font-normal text-[#666666] transition-colors hover:text-[#1890FF]">
        {label}
      </span>
    )}
  </button>
);

interface PostComposerProps {
  onPostCreated?: () => void;
}

export const PostComposer = ({ onPostCreated }: PostComposerProps) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<EVisibility>(EVisibility.PUBLIC);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [createPost, { isLoading: isCreating }] = useCreatePostMutation();
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePost = async () => {
    if (!text.trim()) {
      toast.error("Please write something");
      return;
    }

    try {
      let imageUrl: string | undefined;

      if (image) {
        const formData = new FormData();
        formData.append("image", image);
        const uploadResult = await uploadImage(formData).unwrap();
        imageUrl = uploadResult.data.url;
      }

      await createPost({
        content: text.trim(),
        imageUrl,
        visibility,
      }).unwrap();

      setText("");
      removeImage();
      toast.success("Post created successfully");
      onPostCreated?.();
    } catch {
      toast.error("Failed to create post");
    }
  };

  const isLoading = isCreating || isUploading;

  return (
    <div className="mb-4 rounded-md bg-white px-6 pt-6 pb-6">
      <div className="flex items-start gap-4">
        <div className="shrink-0 cursor-pointer">
          <Image src="/images/txt_img.png" alt="User" width={40} height={40} className="h-10 w-10 rounded-full p-px" />
        </div>
        <div className="relative w-full">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="peer h-22 w-full resize-none border-none p-2 text-sm outline-none placeholder:text-xs placeholder:text-[#666666]"
            placeholder=""
          />
          <label className="pointer-events-none absolute top-2 left-2 flex items-center gap-2 text-base leading-tight font-normal text-[#666666] transition-opacity peer-focus:opacity-0">
            Write something ...
            <svg xmlns="http://www.w3.org/2000/svg" width="23" height="24" fill="none" viewBox="0 0 23 24">
              <path
                fill="#666"
                d="M19.504 19.209c.332 0 .601.289.601.646 0 .326-.226.596-.52.64l-.081.005h-6.276c-.332 0-.602-.289-.602-.645 0-.327.227-.597.52-.64l.082-.006h6.276zM13.4 4.417c1.139-1.223 2.986-1.223 4.125 0l1.182 1.268c1.14 1.223 1.14 3.205 0 4.427L9.82 19.649a2.619 2.619 0 01-1.916.85h-3.64c-.337 0-.61-.298-.6-.66l.09-3.941a3.019 3.019 0 01.794-1.982l8.852-9.5zm-.688 2.562l-7.313 7.85a1.68 1.68 0 00-.441 1.101l-.077 3.278h3.023c.356 0 .698-.133.968-.376l.098-.096 7.35-7.887-3.608-3.87zm3.962-1.65a1.633 1.633 0 00-2.423 0l-.688.737 3.606 3.87.688-.737c.631-.678.666-1.755.105-2.477l-.105-.124-1.183-1.268z"
              />
            </svg>
          </label>
        </div>
      </div>

      {imagePreview && (
        <div className="relative mt-2 mb-4">
          <Image src={imagePreview} alt="Preview" width={600} height={400} className="h-auto w-full rounded-md" />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 rounded-full bg-black/50 p-1 text-white"
          >
            ✕
          </button>
        </div>
      )}

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

      {/* Desktop bottom */}
      <div className="mt-2.5 hidden h-16 items-center justify-between rounded-b-md bg-[rgba(24,144,255,0.05)] px-4 lg:flex">
        <div className="flex items-center">
          <ActionButton
            label="Photo"
            onClick={() => fileInputRef.current?.click()}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
                <path
                  fill="#666"
                  d="M13.916 0c3.109 0 5.18 2.429 5.18 5.914v8.17c0 3.486-2.072 5.916-5.18 5.916H5.999C2.89 20 .827 17.572.827 14.085v-8.17C.827 2.43 2.897 0 6 0h7.917zm0 1.504H5.999c-2.321 0-3.799 1.735-3.799 4.41v8.17c0 2.68 1.472 4.412 3.799 4.412h7.917c2.328 0 3.807-1.734 3.807-4.411v-8.17c0-2.678-1.478-4.411-3.807-4.411zm.65 8.68l.12.125 1.9 2.147a.803.803 0 01-.016 1.063.642.642 0 01-.894.058l-.076-.074-1.9-2.148a.806.806 0 00-1.205-.028l-.074.087-2.04 2.717c-.722.963-2.02 1.066-2.86.26l-.111-.116-.814-.91a.562.562 0 00-.793-.07l-.075.073-1.4 1.617a.645.645 0 01-.97.029.805.805 0 01-.09-.977l.064-.086 1.4-1.617c.736-.852 1.95-.897 2.734-.137l.114.12.81.905a.587.587 0 00.861.033l.07-.078 2.04-2.718c.81-1.08 2.27-1.19 3.205-.275zM6.831 4.64c1.265 0 2.292 1.125 2.292 2.51 0 1.386-1.027 2.511-2.292 2.511S4.54 8.537 4.54 7.152c0-1.386 1.026-2.51 2.291-2.51zm0 1.504c-.507 0-.918.451-.918 1.007 0 .555.411 1.006.918 1.006.507 0 .919-.451.919-1.006 0-.556-.412-1.007-.919-1.007z"
                />
              </svg>
            }
          />
          <ActionButton
            label={visibility === EVisibility.PUBLIC ? "Public" : "Private"}
            onClick={() =>
              setVisibility((prev) => (prev === EVisibility.PUBLIC ? EVisibility.PRIVATE : EVisibility.PUBLIC))
            }
            icon={
              visibility === EVisibility.PUBLIC ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#666"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#666"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              )
            }
          />
        </div>
        <button
          type="button"
          onClick={handlePost}
          disabled={isLoading}
          className="flex cursor-pointer items-center justify-center rounded-md bg-[#1890FF] px-5 py-3 transition-colors hover:bg-[#377DFF] disabled:opacity-50"
        >
          {isLoading ? (
            <Spinner className="mr-2 h-4 w-4 text-white" />
          ) : (
            <svg
              className="mr-2"
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="13"
              fill="none"
              viewBox="0 0 14 13"
            >
              <path
                fill="#fff"
                fillRule="evenodd"
                d="M6.37 7.879l2.438 3.955a.335.335 0 00.34.162c.068-.01.23-.05.289-.247l3.049-10.297a.348.348 0 00-.09-.35.341.341 0 00-.34-.088L1.75 4.03a.34.34 0 00-.247.289.343.343 0 00.16.347L5.666 7.17 9.2 3.597a.5.5 0 01.712.703L6.37 7.88zM9.097 13c-.464 0-.89-.236-1.14-.641L5.372 8.165l-4.237-2.65a1.336 1.336 0 01-.622-1.331c.074-.536.441-.96.957-1.112L11.774.054a1.347 1.347 0 011.67 1.682l-3.05 10.296A1.332 1.332 0 019.098 13z"
                clipRule="evenodd"
              />
            </svg>
          )}
          <span className="text-base leading-6 font-medium text-white">{isLoading ? "Posting..." : "Post"}</span>
        </button>
      </div>

      {/* Mobile bottom */}
      <div className="mt-4 block items-center justify-between rounded-b-md bg-[rgba(24,144,255,0.05)] p-2 lg:hidden">
        <div className="flex items-center justify-around">
          <ActionButton
            onClick={() => fileInputRef.current?.click()}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
                <path
                  fill="#666"
                  d="M13.916 0c3.109 0 5.18 2.429 5.18 5.914v8.17c0 3.486-2.072 5.916-5.18 5.916H5.999C2.89 20 .827 17.572.827 14.085v-8.17C.827 2.43 2.897 0 6 0h7.917zm0 1.504H5.999c-2.321 0-3.799 1.735-3.799 4.41v8.17c0 2.68 1.472 4.412 3.799 4.412h7.917c2.328 0 3.807-1.734 3.807-4.411v-8.17c0-2.678-1.478-4.411-3.807-4.411zm.65 8.68l.12.125 1.9 2.147a.803.803 0 01-.016 1.063.642.642 0 01-.894.058l-.076-.074-1.9-2.148a.806.806 0 00-1.205-.028l-.074.087-2.04 2.717c-.722.963-2.02 1.066-2.86.26l-.111-.116-.814-.91a.562.562 0 00-.793-.07l-.075.073-1.4 1.617a.645.645 0 01-.97.029.805.805 0 01-.09-.977l.064-.086 1.4-1.617c.736-.852 1.95-.897 2.734-.137l.114.12.81.905a.587.587 0 00.861.033l.07-.078 2.04-2.718c.81-1.08 2.27-1.19 3.205-.275zM6.831 4.64c1.265 0 2.292 1.125 2.292 2.51 0 1.386-1.027 2.511-2.292 2.511S4.54 8.537 4.54 7.152c0-1.386 1.026-2.51 2.291-2.51zm0 1.504c-.507 0-.918.451-.918 1.007 0 .555.411 1.006.918 1.006.507 0 .919-.451.919-1.006 0-.556-.412-1.007-.919-1.007z"
                />
              </svg>
            }
          />
          <ActionButton
            onClick={() =>
              setVisibility((prev) => (prev === EVisibility.PUBLIC ? EVisibility.PRIVATE : EVisibility.PUBLIC))
            }
            icon={
              visibility === EVisibility.PUBLIC ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#666"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#666"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              )
            }
          />
        </div>
        <button
          type="button"
          onClick={handlePost}
          disabled={isLoading}
          className="mt-2 flex w-full cursor-pointer items-center justify-center rounded-md bg-[#1890FF] px-5 py-3 transition-colors hover:bg-[#377DFF] disabled:opacity-50"
        >
          {isLoading ? (
            <Spinner className="mr-2 h-4 w-4 text-white" />
          ) : (
            <svg
              className="mr-2"
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="13"
              fill="none"
              viewBox="0 0 14 13"
            >
              <path
                fill="#fff"
                fillRule="evenodd"
                d="M6.37 7.879l2.438 3.955a.335.335 0 00.34.162c.068-.01.23-.05.289-.247l3.049-10.297a.348.348 0 00-.09-.35.341.341 0 00-.34-.088L1.75 4.03a.34.34 0 00-.247.289.343.343 0 00.16.347L5.666 7.17 9.2 3.597a.5.5 0 01.712.703L6.37 7.88zM9.097 13c-.464 0-.89-.236-1.14-.641L5.372 8.165l-4.237-2.65a1.336 1.336 0 01-.622-1.331c.074-.536.441-.96.957-1.112L11.774.054a1.347 1.347 0 011.67 1.682l-3.05 10.296A1.332 1.332 0 019.098 13z"
                clipRule="evenodd"
              />
            </svg>
          )}
          <span className="text-base leading-6 font-medium text-white">{isLoading ? "Posting..." : "Post"}</span>
        </button>
      </div>
    </div>
  );
};
