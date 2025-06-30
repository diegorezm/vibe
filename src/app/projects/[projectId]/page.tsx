import { findAllMessagesByProjectId } from "@/domain/messages/server/controller"
import { findProjectById } from "@/domain/projects/server/controller"
import { ProjectViewSkeleton } from "@/domain/projects/ui/components/project-view-skeleton"
import { ProjectView } from "@/domain/projects/ui/views/project-view"
import { getQueryClient } from "@/lib/get-query-client"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { Suspense } from "react"

interface Props {
  params: Promise<{ projectId: string }>
}

export default async function ProjectPage({ params }: Props) {
  const { projectId } = await params
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["messages", { projectId }],
    queryFn: async () => {
      return await findAllMessagesByProjectId(projectId)
    }
  })

  await queryClient.prefetchQuery({
    queryKey: ["project", { id: projectId }],
    queryFn: async () => {
      return await findProjectById(projectId)
    }
  })

  return <HydrationBoundary state={dehydrate(queryClient)}>
    <Suspense fallback={<ProjectViewSkeleton />}>
      <ProjectView projectId={projectId} />
    </Suspense>
  </HydrationBoundary>
}
