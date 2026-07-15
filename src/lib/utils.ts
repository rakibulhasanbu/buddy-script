import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const MAX_FILE_SIZE = 4 * 1024 * 1024;

export function validateImageSize(file: File): boolean {
  if (file.size > MAX_FILE_SIZE) {
    toast.error("Image must be less than 4MB");
    return false;
  }
  return true;
}
