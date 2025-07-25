"use server"

import { ActionState } from "../../common/action-state"
import { messageRepository } from "../data/repository"
import { CreateMessageSchema } from "../data/schemas"
import { tryCatch } from "../../common/try-catch"
import { inngest } from "@/inngest/client"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { consumeCredits } from "@/lib/usage"

export async function findAllMessagesByProjectId(projectId: string) {
  const { isAuthenticated } = await auth()

  if (!isAuthenticated) {
    return redirect("/sign-in")
  }

  const result = await tryCatch(messageRepository.getAllWithFragment(projectId))

  if (result.error) {
    throw result.error
  }

  return result.data
}

export async function createMessageAction(_prevState: unknown, formData: FormData): Promise<ActionState> {
  const { isAuthenticated } = await auth()

  if (!isAuthenticated) {
    return redirect("/sign-in")
  }

  const validatedFields = CreateMessageSchema.safeParse({
    value: formData.get("value"),
    projectId: formData.get("projectId")
  })

  if (!validatedFields.success) {
    return {
      status: "error",
      message: "Something went wrong while validating!",
      errors: validatedFields.error.flatten().fieldErrors
    }
  }

  const consumeCreditResult = await tryCatch(consumeCredits())
  if (consumeCreditResult.error) {
    console.error(consumeCreditResult.error)
    if (consumeCreditResult.error instanceof Error) {
      return {
        status: "error",
        message: "Something went wrong while creating your message!",
        errors: {
          general: [consumeCreditResult.error.message]
        }
      }
    } else {
      return {
        status: "error",
        message: "You don't have any more credits!",
        errors: {
          general: ["You don't have any more credits!"]
        }
      }
    }
  }


  const { value, projectId } = validatedFields.data
  const result = await tryCatch(messageRepository.create({
    content: value,
    projectId: projectId,
    role: "user",
    type: "result"
  }))
  if (result.error) {
    return {
      status: "error",
      message: "Something went wrong while creating your message!",
      errors: {
        general: [result.error.message]
      }
    }
  }

  await inngest.send({
    name: "code/generate.code",
    data: {
      prompt: value,
      projectId
    }
  })

  return {
    status: "success"
  }
}
