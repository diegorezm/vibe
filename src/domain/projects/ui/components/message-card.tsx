import type { Message, Fragment } from "@/db/schema"
import { UserMessage } from "./user-message";
import { AssitantMessage } from "./assistant-message";

interface Props {
  message: Message;
  fragment: Fragment | null
  isActiveFragment: boolean
  onFragmentClick: (fragment: Fragment) => void
}

export function MessageCard({ message, fragment, isActiveFragment, onFragmentClick }: Props) {
  if (message.role === "assistant") {
    return <AssitantMessage fragment={fragment} message={message} onFragmentClick={onFragmentClick} isActiveFragment={isActiveFragment} />
  }
  return (
    <UserMessage content={message.content} />
  )
}
