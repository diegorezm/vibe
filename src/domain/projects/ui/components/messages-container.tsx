import { findAllMessagesByProjectId } from "@/domain/messages/server/controller"
import { useSuspenseQuery } from "@tanstack/react-query"
import { MessageCard } from "./message-card"
import { MessageForm } from "./message-form"
import { useEffect, useRef } from "react"
import { Fragment } from "@/db/schema"
import { MessageLoading } from "./message-loading"

interface Props {
  projectId: string
  activeFragment: Fragment | null
  setActiveFragment: (f: Fragment | null) => void
}
export function MessagesContainer({ projectId, activeFragment, setActiveFragment }: Props) {
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const { data: messages } = useSuspenseQuery({
    queryKey: ["messages", { projectId }],
    queryFn: async () => {
      return await findAllMessagesByProjectId(projectId)
    },
    refetchInterval: 5000
  })

  useEffect(() => {
    const lastAssistantMessage = messages.findLast(
      (message) => message.messages.role === "assistant"
    )
    if (lastAssistantMessage) {
      setActiveFragment(lastAssistantMessage.fragments)
    }
  }, [messages, setActiveFragment])

  useEffect(() => {
    bottomRef.current?.scrollIntoView()
  }, [messages.length])

  const lastMessage = messages[messages.length - 1]
  const isLastMessageFromUser = lastMessage.messages.role === "user"

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 min-h-0  overflow-y-auto">
        <div className="py-2 pr-1">
          {messages.map((m) => (
            <MessageCard key={m.messages.id} fragment={m.fragments} message={m.messages} isActiveFragment={activeFragment?.id === m.fragments?.id} onFragmentClick={(fragment) => {
              setActiveFragment(fragment)
            }} />
          ))}
          {isLastMessageFromUser && <MessageLoading />}
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
