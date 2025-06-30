"use client"

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createMessageAction } from "@/domain/messages/controller";
import { useActionState } from "react";

export default function Home() {
  const [state, action, isPending] = useActionState(createMessageAction, null)

  return (
    <div className="p-4">
      <form className="space-y-2" action={action}>
        <Textarea placeholder="Write your prompt here..." name="value" minLength={1} maxLength={1024} />
        <Button disabled={isPending}>Send</Button>
      </form>
      {state?.status === "error" && (
        <p>{state.message ?? "Something went wrong!"}</p>
      )}
      {state?.status === "success" && (
        <p>Message sent!!</p>
      )}
    </div>
  );
}
