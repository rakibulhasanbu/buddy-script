import { z } from "zod";

export const sendFriendRequestSchema = z.object({
  addresseeId: z.string().uuid("User ID must be valid"),
});

export type SendFriendRequestFormValues = z.infer<typeof sendFriendRequestSchema>;
