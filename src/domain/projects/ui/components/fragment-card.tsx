import { type Fragment } from "@/db/schema";
import { cn } from "@/lib/utils";
import { ChevronRightIcon, Code2Icon } from "lucide-react";

interface Props {
  fragment: Fragment
  isActiveFragment: boolean
  onFragmentClick: (fragment: Fragment) => void
}

export function FragmentCard({ fragment, isActiveFragment, onFragmentClick }: Props) {
  return <button
    onClick={() => onFragmentClick(fragment)}
    className={cn(
      "flex items-start text-start gap-2 border rounded-lg bg-muted w-fit p-3 over:bg-secondary transition-colors",
      isActiveFragment && "bg-primary text-primary-foreground border-primary hover:bg-primary")}
  >
    <Code2Icon className="size-4 mt-0.5" />
    <div className="flex flex-col flex-1">
      <span className="text-sm font-medium line-clamp-1">
        {fragment.title}
      </span>
      <span className="text-sm">Preview</span>
    </div>
    <div className="flex items-center justify-center mt-0.5">
      <ChevronRightIcon className="size-4" />
    </div>
  </button>
}
