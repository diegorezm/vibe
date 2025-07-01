"use client"

import { cn } from "@/lib/utils"
import { toast } from "sonner"
import TextareaAutosize from "react-textarea-autosize"
import { ArrowUpIcon, Loader2Icon } from "lucide-react"
import { startTransition, useActionState, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { useQueryClient } from "@tanstack/react-query"
import { createProjectWithMessageAction } from "@/domain/projects/server/controller"
import { useRouter } from "next/navigation"
import { PROJECT_TEMPLATES } from "../constants"

interface Props {
  isAuthenticated: boolean
}

export function ProjectForm({ isAuthenticated }: Props) {
  const formRef = useRef<HTMLFormElement | null>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [formValue, setFormValue] = useState("")
  const [state, action, isPending] = useActionState(createProjectWithMessageAction, null)
  const queryClient = useQueryClient()
  const router = useRouter()

  useEffect(() => {
    if (!isPending && state?.status === "error") {
      toast(state.message ?? "Something went wrong!")
    }
    if (!isPending && state?.status === "success") {
      if (formRef.current) {
        formRef.current.reset()
      }
      router.push(`/projects/${state.data?.projectId}`)
    }
  }, [state, isPending, router, queryClient])

  return (
    <>
      <form action={action} ref={formRef} className={cn("relative border p-4 pt-1 rounded-xl bg-sidebar dark:bg-sidebar transition-all",
        isFocused && "shadow-xs",
      )}>
        <TextareaAutosize
          minRows={2}
          maxRows={8}
          minLength={1}
          maxLength={1024}
          disabled={isPending}
          name="value"
          value={formValue}
          onChange={e => setFormValue(e.target.value)}
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
        <div className="flex gap-x-2 items-end justify-between pt-2">
          <div className="text-[10px] text-muted-foreground font-mono">
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
              <span>&#8984;</span> Enter
            </kbd>
            &nbsp; To submit
          </div>
          <Button className={cn("size-8 rounded-full", isPending && "bg-muted")} disabled={isPending}>
            {isPending ? <Loader2Icon className="animate-spin" /> : <ArrowUpIcon />}
          </Button>
        </div>
      </form>
      <div className="flex-wrap justify-center hidden md:flex max-w-3xl mt-6 gap-2">
        {PROJECT_TEMPLATES.map((pj) => (
          <Button key={pj.title} variant="outline" size="sm" onClick={() => setFormValue(pj.prompt)}>
            {pj.emoji}{pj.title}
          </Button>
        ))}
      </div>
    </>
  )
}
