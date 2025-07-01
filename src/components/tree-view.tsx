import { type TreeItem } from "@/types"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronRightIcon, FileIcon, FolderIcon } from "lucide-react"

interface TreeViewProps {
  data: TreeItem[]
  value?: string | null
  onSelect?: (s: string) => void
}

export function TreeView({ data, value, onSelect }: TreeViewProps) {
  return (
    <SidebarProvider >
      <Sidebar collapsible="none" className="w-full">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {data.map((item, index) => (
                  <Tree key={index} item={item} selectedValue={value} onSelect={onSelect} parentPath="" />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>

    </SidebarProvider>
  )
}

interface TreeProps {
  item: TreeItem
  selectedValue?: string | null
  onSelect?: (value: string) => void
  parentPath: string;
}

function Tree({ item, selectedValue, onSelect, parentPath }: TreeProps) {
  const [name, ...items] = Array.isArray(item) ? item : [item]
  const curentPath = parentPath ? `${parentPath}/${name}` : name
  if (!items.length) {
    // its a file
    const isSelected = selectedValue === curentPath
    return (
      <SidebarMenuButton isActive={isSelected} className="data-[active='true']:bg-transparent" onClick={() => onSelect?.(curentPath)}>
        <FileIcon />
        <span className="truncate">{name}</span>
      </SidebarMenuButton>
    )
  }
  // its a folder
  return (
    <SidebarMenuItem>
      <Collapsible className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90" defaultOpen>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton >
            <ChevronRightIcon className="transition-transform" />
            <FolderIcon />
            <span className="truncate">
              {name}
            </span>
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {items.map((subitem, index) => (
              <Tree key={index} item={subitem} selectedValue={selectedValue} onSelect={onSelect} parentPath={curentPath} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  )
}
