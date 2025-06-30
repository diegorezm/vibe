import { findAllMessagesByProjectId } from "@/domain/messages/server/controller"
import { useSuspenseQuery } from "@tanstack/react-query"
import { MessageCard } from "./message-card"
import { MessageForm } from "./message-form"

interface Props {
  projectId: string
}
export function MessagesContainer({ projectId }: Props) {

  const { data: messages } = useSuspenseQuery({
    queryKey: ["messages", { projectId }],
    queryFn: async () => {
      return await findAllMessagesByProjectId(projectId)
    }
  })
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 min-h-0  overflow-y-auto">
        <div className="py-2 pr-1">
          {messages.map((m) => (
            <MessageCard key={m.messages.id} fragment={m.fragments} message={m.messages} isActiveFragment={false} onFragmentClick={(fragment) => {
              console.log(fragment)
            }} />
          ))}
        </div>
      </div>
      <div className="relative p-3 pt-1">
        <MessageForm projectId={projectId} />
      </div>
    </div>
  )
}
