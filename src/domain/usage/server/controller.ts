"use server"

import { tryCatch } from "@/domain/common/try-catch"
import { consumeCredits, getUsageStatus } from "@/lib/usage"
import { auth } from "@clerk/nextjs/server"

export async function getUsageStatusAction() {
  const { isAuthenticated } = await auth()

  if (!isAuthenticated) {
    throw new Error("User is not authenticated.")
  }

  const result = await tryCatch(getUsageStatus())

  if (result.error) {
    throw result.error
  }

  return result.data?.toJSON()
}

export async function consumeCreditsAction() {
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


  const result = await tryCatch(getUsageStatus())

  if (result.error) {
    console.error(result.error)
    throw result.error
  }
  return result.data
}
