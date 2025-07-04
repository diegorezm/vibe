import { createMessageAction } from "@/domain/messages/server/controller"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import TextareaAutosize from "react-textarea-autosize"
import { ArrowUpIcon, Loader2Icon } from "lucide-react"
import { startTransition, useActionState, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Usage } from "@/domain/usage/ui/components/usage"
import { getUsageStatusAction } from "@/domain/usage/server/controller"

interface Props {
  projectId: string
}

export function MessageForm({ projectId }: Props) {
  const [isFocused, setIsFocused] = useState(false)
  const { data: usage, isLoading: usageIsLoading, isError: usageIsError } = useQuery({
    queryKey: ["usage"],
    queryFn: async () => {
      return await getUsageStatusAction()
    }
  })

  const formRef = useRef<HTMLFormElement | null>(null)

  const [state, action, isPending] = useActionState(createMessageAction, null)

  const queryClient = useQueryClient()

  const sowUsage = !!usage
  const hasCredits = !usageIsError && !usageIsLoading && usage && usage?.remainingPoints > 0

  useEffect(() => {
    if (!isPending && state?.status === "error") {
      toast(state.message ?? "Something went wrong!")

      queryClient.invalidateQueries({
        queryKey: ["usage"]
      }).catch(e => console.error(e))
    }

    if (!isPending && state?.status === "success") {
      queryClient.invalidateQueries({
        queryKey: ["messages", { projectId }]
      }).catch(e => console.error(e))

      queryClient.invalidateQueries({
        queryKey: ["usage"]
      }).catch(e => console.error(e))
      if (formRef.current) {
        formRef.current.reset()
      }
    }
  }, [state, isPending, queryClient, projectId])
  return (
    <>
      {sowUsage && <Usage points={usage.remainingPoints} msBeforeNext={usage.msBeforeNext} />}
      <form action={action} ref={formRef} className={cn("relative border p-4 pt-1 rounded-xl bg-sidebar dark:bg-sidebar transition-all",
        isFocused && "shadow-xs",
        sowUsage && "rounded-t-none")}>
        <TextareaAutosize
          minRows={2}
          maxRows={8}
          minLength={1}
          maxLength={1024}
          disabled={isPending || !hasCredits}
          name="value"
          onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}
          className="pt-4 resize-none border-none w-full outline-none bg-transparent"
          placeholder="What would you like to build?"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
              e.preventDefault()
              const form = e.currentTarget.form
              if (form) {
                startTransition(() => {
                  action(new FormData(form))
                })
              }
            }
          }} />
        <input type="text" name="projectId" defaultValue={projectId} hidden />
        <div className="flex gap-x-2 items-end justify-between pt-2">
          <div className="text-[10px] text-muted-foreground font-mono">
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
              <span>&#8984;</span> Enter
            </kbd>
            &nbsp; To submit
          </div>
          <Button className={cn("size-8 rounded-full", isPending && "bg-muted")} disabled={isPending || !hasCredits}>
            {isPending ? <Loader2Icon className="animate-spin" /> : <ArrowUpIcon />}
          </Button>
        </div>
      </form>
    </>
  )
}
