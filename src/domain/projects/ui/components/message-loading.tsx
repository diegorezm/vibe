import { useEffect, useState } from "react"
import Image from "next/image"

function ShimmerMessage() {
  const messages = [
    "Thinking...",
    "Loading...",
    "Generating...",
    "Almost ready...",
    "Building your website...",
    "Vibing..."
  ]
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length)
    }, 5000)
    return () => {
      clearInterval(interval)
    }
  }, [messages.length])

  return (
    <div className="flex items-center gap-2">
      <span className="text-base text-muted-foreground animate-pulse">{messages[currentMessageIndex]}</span>
    </div>
  )
}



export function MessageLoading() {
  return (
    <div className="flex flex-col group px-2 pb-4">
      <div className="flex items-center gap-2 pl-2 mb-2">
        <Image src="/logo.svg" width={20} height={20} alt="vibe" className="shrink-0" />
        <span className="text-sm font-medium">vibe</span>
      </div>
      <div className="pl-8.5 flex flex-col gap-y-4">
        <ShimmerMessage />
      </div>
    </div>
  )
}
