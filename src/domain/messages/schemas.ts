import { z } from "zod";

export const CreateMessageSchema = z.object({
  value: z.string().min(1, { message: "Message is required." })
})

