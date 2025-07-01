"use client"

import Link from "next/link"
import Image from "next/image"
import { useQuery } from "@tanstack/react-query"
import { findAllProjects } from "@/domain/projects/server/controller"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { Loader2 } from "lucide-react"
import { useAuth } from "@clerk/nextjs"

export function ProjectsList() {
  const { userId } = useAuth()
  const { data: projects, isLoading, isError } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      if (userId === null || userId === undefined) throw new Error("You are not authorized.")
      return await findAllProjects(userId)
    },
    enabled: !!userId
  })

  return (
    <div className="w-full rounded-xl p-8 border flex flex-col gap-y-6 sm:gap-y-4 bg-card">
      <h2 className="text-2xl font-semibold"> Previous projects</h2>
      <div className="grid grid-cols1 sm:grid-cols-3 gap-6">
        {isLoading && (
          <div className="col-span-full flex justify-center">
            <Loader2 className="animate-spin" />
          </div>
        )}
        {isError && (
          <div className="col-span-full flex justify-center">
            <p className="text-sm text-muted-foreground">Something went wrong!</p>
          </div>
        )}
        {projects?.length === 0 && (
          <div className="col-span-full text-center">
            <p className="text-sm text-muted-foreground">No projects found.</p>
          </div>
        )}
        {projects?.map((project) => (
          <Button key={project.id} variant="outline" className="font-normal h-auto justify-start w-full text-start p-4">
            <Link href={`/projects/${project.id}`}>
              <div className="flex items-center gap-x-4">
                <Image src="/logo.svg" alt="Vibe" width={32} height={32} className="object-contain" />
                <div className="flex flex-col">
                  <h3 className="truncate font-medium">{project.name}</h3>
                  <p className="text-sm text-muted-foreground">{formatDistanceToNow(project.updatedAt || project.createdAt || Date.now(), {
                    addSuffix: true
                  })}</p>
                </div>
              </div>
            </Link>
          </Button>
        ))}
      </div>
    </div>
  )
}
