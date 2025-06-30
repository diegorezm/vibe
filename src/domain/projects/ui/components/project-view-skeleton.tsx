"use client"

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton" // Assuming you have this Shadcn Skeleton component

export function ProjectViewSkeleton() {
  return (
    <div className="h-screen flex flex-col">
      <ResizablePanelGroup direction="horizontal" className="flex-grow">
        <ResizablePanel defaultSize={35} minSize={20} className="flex flex-col min-h-0">
          <Card className="flex-grow flex flex-col overflow-hidden rounded-none border-t-0 border-l-0 border-b-0">
            <CardHeader className="p-4 pb-2 border-b">
              {/* Skeleton for Project Title */}
              <CardTitle className="text-lg font-semibold">
                <Skeleton className="h-6 w-3/4" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-grow overflow-hidden">
              <ScrollArea className="h-full w-full p-4 space-y-4">
                {/* Skeletons for multiple messages */}
                {[...Array(5)].map((_, i) => ( // Render 5 skeleton message cards
                  <Card key={i} className="shadow-sm">
                    <CardHeader className="p-4 pb-2">
                      <Skeleton className="h-4 w-5/6 mb-2" /> {/* Message content */}
                      <Skeleton className="h-3 w-1/3" /> {/* Timestamp */}
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-2/3 mt-1" />
                    </CardContent>
                  </Card>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={65} minSize={50} className="flex flex-col">
          <Card className="flex-grow flex flex-col overflow-hidden rounded-none border-t-0 border-r-0 border-b-0">
            <CardHeader className="p-4 pb-2 border-b">
              <CardTitle className="text-lg font-semibold">
                <Skeleton className="h-6 w-1/4" /> {/* Skeleton for "Preview" title */}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex-grow overflow-auto space-y-2">
              {/* Skeletons for preview content */}
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[90%]" />
              <Skeleton className="h-4 w-[95%]" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-full mt-4" />
              <Skeleton className="h-4 w-[85%]" />
            </CardContent>
          </Card>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
