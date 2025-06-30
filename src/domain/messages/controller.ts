"use server"

import { ActionState } from "../common/action-state"
import { messageRepository } from "./repository"
import { inngest } from "@/inngest/client"
import { CreateMessageSchema } from "./schemas"
import { tryCatch } from "../common/try-catch"

export async function findAllMessages() {
  const result = await tryCatch(messageRepository.getAll())
  if (result.error) {
    throw result.error
  }
  return result.data
}

export async function createMessageAction(_prevState: unknown, formData: FormData): Promise<ActionState> {
  const validatedFields = CreateMessageSchema.safeParse({
    value: formData.get("value"),
  })

  if (!validatedFields.success) {
    return {
      status: "error",
      message: "Something went wrong while validating!",
      errors: validatedFields.error.flatten().fieldErrors
    }
  }
  const prompt = validatedFields.data.value

  const result = await tryCatch(messageRepository.create({
    content: prompt,
    role: "user",
    type: "result",
  }))

  if (result.error) {
    return {
      status: "error",
      message: "Something went wrong while creating the message!",
      errors: {
        general: [result.error.message]
      }
    }
  }

  await inngest.send({
    name: "code/generate.code",
    data: {
      prompt
    }
  })

  return {
    status: "success",
  }
}
