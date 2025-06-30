"use server"

import { inngest } from "@/server/inngest/client"

export async function invokeAgent(prompt: string) {
  const result = await inngest.send({
    name: "code/generate.code",
    data: {
      prompt
    }
  })
  console.log(result)
}
