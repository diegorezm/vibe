import { findAllMessagesByProjectId } from "@/domain/messages/controller"
import { findProjectById } from "@/domain/projects/controller"
import { getQueryClient } from "@/lib/get-query-client"

interface Props {
  params: Promise<{ projectId: string }>
}

export default async function ProjectPage({ params }: Props) {
  const { projectId } = await params
  const queryClient = getQueryClient()

  queryClient.prefetchQuery({
    queryKey: ["messages", { projectId }],
    queryFn: async () => {
      return await findAllMessagesByProjectId(projectId)
    }
  })

  queryClient.prefetchQuery({
    queryKey: ["project", { id: projectId }],
    queryFn: async () => {
      return await findProjectById(projectId)
    }
  })

  return <div>
    project: {projectId}
  </div>
}
