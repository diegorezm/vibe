"use client"

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createMessageAction } from "@/domain/messages/controller";
import { createProjectWithMessageAction } from "@/domain/projects/controller";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

export default function Home() {
  const router = useRouter()
  const [state, action, isPending] = useActionState(createProjectWithMessageAction, null)

  useEffect(() => {
    if (!isPending && state?.status === "success") {
      router.push(`/projects/${state.data?.projectId}`)
    }
  }, [state, router, isPending])

  return (
    <div className="p-4 w-full h-screen flex justify-center items-center">
      <form className="max-w-7xl w-full space-y-2" action={action}>
        <Textarea placeholder="Write your prompt here..." name="value" minLength={1} maxLength={1024} />
        <Button disabled={isPending}>Send</Button>
        {state?.status === "error" && (
          <p>{state.message ?? "Something went wrong!"}</p>
        )}
        {state?.status === "success" && (
          <p>Message sent!!</p>
        )}
      </form>
    </div>
  );
}
