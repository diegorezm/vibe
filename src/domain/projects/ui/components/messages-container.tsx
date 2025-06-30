import { findAllMessagesByProjectId } from "@/domain/messages/server/controller"
import { useSuspenseQuery } from "@tanstack/react-query"
import { MessageCard } from "./message-card"
import { MessageForm } from "./message-form"
import { useEffect, useRef } from "react"

interface Props {
  projectId: string
}
export function MessagesContainer({ projectId }: Props) {
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const { data: messages } = useSuspenseQuery({
    queryKey: ["messages", { projectId }],
    queryFn: async () => {
      return await findAllMessagesByProjectId(projectId)
    }
  })

  useEffect(() => {
    const lastAssistantMessage = messages.findLast(
      (message) => message.messages.role === "assistant"
    )
    if (lastAssistantMessage) {
      // TODO: Set active fragment
    }
  }, [messages])
  useEffect(() => {
    bottomRef.current?.scrollIntoView()
  }, [messages.length])

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 min-h-0  overflow-y-auto">
        <div className="py-2 pr-1">
          {messages.map((m, i) => (
            <MessageCard key={m.messages.id} fragment={m.fragments} message={m.messages} isActiveFragment={false} onFragmentClick={(fragment) => {
              console.log(fragment)
            }} />
          ))}
          <div ref={bottomRef}></div>
        </div>
      </div>
      <div className="relative p-3 pt-1">
        <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-bacgrkound/70 pointer-events-none"></div>
        <MessageForm projectId={projectId} />
      </div>
    </div>
  )
}
