import { EVisibility } from "@/features/feed/types";
import { z } from "zod";

export const createPostSchema = z.object({
  content: z.string().min(1, { message: "Post content is required" }),
  imageUrl: z.string().optional(),
  visibility: z.enum([EVisibility.PUBLIC, EVisibility.PRIVATE]).default(EVisibility.PUBLIC),
});

export const updatePostSchema = z.object({
  content: z.string().min(1, { message: "Post content is required" }),
  imageUrl: z.string().optional(),
  visibility: z.enum([EVisibility.PUBLIC, EVisibility.PRIVATE]),
});

export const createCommentSchema = z.object({
  postId: z.string(),
  parentId: z.string().optional(),
  content: z.string().min(1, { message: "Comment cannot be empty" }),
});

export const updateCommentSchema = z.object({
  content: z.string().min(1, { message: "Comment cannot be empty" }),
});

export type CreatePostFormValues = z.infer<typeof createPostSchema>;
export type UpdatePostFormValues = z.infer<typeof updatePostSchema>;
export type CreateCommentFormValues = z.infer<typeof createCommentSchema>;
export type UpdateCommentFormValues = z.infer<typeof updateCommentSchema>;
