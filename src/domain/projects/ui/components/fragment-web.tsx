import { Fragment } from "@/db/schema";
import { useState } from "react";
import { LucideExternalLink, RefreshCcwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/hint";

interface Props {
  data: Fragment
}
export function FragmentWeb({ data }: Props) {
  const [fragmentKey, setFragmentKey] = useState(0)
  const [copied, setCopied] = useState(false)
  const onRefresh = () => {
    setFragmentKey(prev => prev + 1)
  }
  const handleCopy = () => {
    if (!data.sandboxUrl) return
    navigator.clipboard.writeText(data.sandboxUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="flex flex-col w-full h-full">
      <div className="p-2 border-b bg-sidebar flex items-center gap-x-2">
        <Hint text="Refresh the page">
          <Button size="sm" variant="outline" onClick={onRefresh}>
            <RefreshCcwIcon />
          </Button>
        </Hint>

        <Hint text="Click to copy the link" side="bottom">
          <Button
            size="sm"
            variant="outline"
            disabled={!data.sandboxUrl || copied === true}
            className="flex-1 justify-start text-start font-normal"
            onClick={handleCopy}
          >
            <span className="truncate">{data.sandboxUrl}</span>
          </Button>
        </Hint>

        <Hint text="Open in a new tab" side="left">
          <Button size="sm" variant="outline" disabled={!data.sandboxUrl} onClick={() => {
            if (!data.sandboxUrl) return
            window.open(data.sandboxUrl, "_blank")
          }}>
            <LucideExternalLink />
          </Button>
        </Hint>
      </div>
      {data.sandboxUrl && (
        <iframe
          key={fragmentKey}
          className="w-full h-full"
          sandbox="allow-forms allow-scripts allow-same-origin"
          loading="lazy"
          src={data.sandboxUrl}
        />
      )}
    </div>
  )
}
