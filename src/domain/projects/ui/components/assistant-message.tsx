import type { Fragment, Message } from "@/db/schema"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import Image from "next/image"
import { FragmentCard } from "./fragment-card"

interface Props {
  message: Message
  fragment: Fragment | null
  onFragmentClick: (fragment: Fragment) => void
  isActiveFragment: boolean
}

export function AssitantMessage({ message, fragment, onFragmentClick, isActiveFragment }: Props) {
  return (
    <div className={cn(
      "flex flex-col group px-2 pb-4",
      message.type === "error" && "text-red-700 dark:text-red-500",

    )}>
      <div className="flex items-center gap-2 pl-2 mb-2">
        <Image src="/logo.svg" height={20} width={20} alt="vibe" className="shrink-0" />
        <span className="text-sm font-medium">
          Vibe
        </span>
        <span className="text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
          {format(message.createdAt || Date.now(), "HH:mm 'on' MMM dd, yyyy")}
        </span>
      </div>
      <div className="pl-8.5 flex flex-col gap-y-4">
        <span>{message.content}</span>
        {fragment && message.type === "result" && (
          <FragmentCard fragment={fragment} isActiveFragment={isActiveFragment} onFragmentClick={onFragmentClick} />
        )}
      </div>
    </div>
  )
}
