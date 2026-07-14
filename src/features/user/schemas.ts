import { z } from "zod";

export const editProfileFormSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  bio: z.string().max(500, { message: "Bio must be 500 characters or less" }).optional(),
  headline: z.string().max(100, { message: "Headline must be 100 characters or less" }).optional(),
  photoUrl: z.string().url({ message: "Photo URL must be a valid URL" }).optional(),
  coverUrl: z.string().url({ message: "Cover URL must be a valid URL" }).optional(),
});

export type EditProfileFormValues = z.infer<typeof editProfileFormSchema>;
