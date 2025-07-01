"use server"

import { db } from "@/db"

import { inngest } from "@/inngest/client"

import { ACTION_ERRORS, ActionState } from "../../common/action-state"
import { CreateProjectWithMessageSchema } from "../data/schema"

import { generateSlug } from "random-word-slugs"

import { messageTable, projectsTable } from "@/db/schema"

import { projectRepository } from "../data/repository"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export async function findAllProjects(userId: string) {
  const { isAuthenticated } = await auth()

  if (!isAuthenticated) {
    return redirect("/sign-up")
  }
  return await projectRepository.getByUserId(userId)
}

export async function findProjectById(projectId: string) {

  const { isAuthenticated } = await auth()

  if (!isAuthenticated) {
    return redirect("/sign-in")
  }
  const project = await projectRepository.getById(projectId)
  if (!project) {
    throw new Error("No project found.")
  }
  return project
}

type CreateProjectResponse = {
  projectId: string
}

export async function createProjectWithMessageAction(_prevState: unknown, formData: FormData): Promise<ActionState<CreateProjectResponse>> {
  const { isAuthenticated, userId } = await auth()

  if (!isAuthenticated) {
    return redirect("/sign-in")
  }

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
        }),
        userId
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

