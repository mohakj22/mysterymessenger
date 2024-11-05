import { z } from "zod";
export const messageSchema = z.object({
  username: z.string(),
  messageContent: z
    .string()
    .min(1, { message: "Content must be at least of 1 characters" })
    .max(250, { message: "Content must be at most of 250 characters" }),
  isAnonymous: z.boolean()
});
