import { useSuspenseQuery } from "@tanstack/react-query"
import { findProjectById } from "../../server/controller"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ChevronDownIcon, ChevronLeftIcon, SunMoonIcon } from "lucide-react"
import Link from "next/link"
import { DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@radix-ui/react-dropdown-menu"
import { useTheme } from "next-themes"

interface Props {
  projectId: string
}
export function ProjectHeader({ projectId }: Props) {
  const { data: project } = useSuspenseQuery({
    queryKey: ["project", { id: projectId }],
    queryFn: async () => {
      return await findProjectById(projectId)
    }
  })
  const { setTheme, theme } = useTheme()
  return (
    <header className="p-2 flex justify-between items-center border-b">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="focus-visible:ring-0 hover:bg-transparent hover:opacity-75 pl-2!">
            <Image src="/logo.svg" width={20} height={20} alt="Vibe" />
            <span className="text-sm font-medium">{project.name}</span>
            <ChevronDownIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="start">
          <DropdownMenuItem asChild>
            <Link href="/">
              <ChevronLeftIcon />
              <span>Go to Dashboard</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="gap-2">
              <SunMoonIcon className="size-4- text-muted-foreground" />
              <span>Appearance</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                  <DropdownMenuRadioItem value="light">
                    <span>Light</span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="dark">
                    <span>Dark</span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="system">
                    <span>System default</span>
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
