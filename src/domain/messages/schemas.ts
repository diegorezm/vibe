import { z } from "zod";

export const CreateMessageSchema = z.object({
  value: z.string().min(1, { message: "Message is required." }).max(1024, { message: "Your message is too long." }),
  projectId: z.string().uuid()
})

