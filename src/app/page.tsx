"use client"

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { invokeAgent } from "./actions";

export default function Home() {
  const [prompt, setPrompt] = useState("")

  return (
    <div className="p-4">
      <form className="space-y-2" onSubmit={(e) => {
        e.preventDefault()
        invokeAgent(prompt).catch(e => console.error(e))
      }}>
        <Textarea placeholder="Write your prompt here..." onChange={e => setPrompt(e.target.value)} value={prompt} />
        <Button>Send</Button>
      </form>
    </div>
  );
}
