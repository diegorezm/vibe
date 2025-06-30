"use server"

import { ActionState } from "../common/action-state"
import { inngest } from "@/inngest/client"
import { generateSlug } from "random-word-slugs"
import { db } from "@/db"
import { messageTable, projectsTable } from "@/db/schema"
import { CreateProjectWithMessageSchema } from "./schema"

type CreateProjectResponse = {
  projectId: string
}
export async function createProjectWithMessageAction(_prevState: unknown, formData: FormData): Promise<ActionState<CreateProjectResponse>> {
  const validatedFields = CreateProjectWithMessageSchema.safeParse({
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

  const txResult = await db.transaction(async (tx) => {
    try {
      const [newProject] = await tx.insert(projectsTable).values({
        name: generateSlug(2, {
          format: "kebab"
        })
      }).returning()

      if (!newProject) {
        throw new Error("Something went wrong while creating the project!")
      }

      await tx.insert(messageTable).values({
        content: prompt,
        role: "user",
        type: "result",
        projectId: newProject.id
      })

      return { success: true, projectId: newProject.id }
    } catch (error) {
      tx.rollback()
      console.error(error)
      return { success: false }
    }
  })
  if (txResult.success) {
    await inngest.send({
      name: "code/generate.code",
      data: {
        prompt,
        projectId: txResult.projectId
      }
    })

    return {
      status: "success",
      data: {
        projectId: txResult.projectId!
      }
    }
  }

  return {
    status: "error",
    message: "Something went wrong!",
    errors: {
      general: ["Something went wrong!"]
    }

  }
}

