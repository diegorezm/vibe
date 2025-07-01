import { Navbar } from "@/domain/home/ui/components/navbar";
import { ReactNode } from "react";

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex flex-col min-h-screen max-h-screen">
      <Navbar />
      <div className="flex-1 flex-col px-4 pb-4">
        <div className="absolute inset-0 -z-10 w-full h-full bg-background dark:bg-[radial-gradient(#393e4a_1px,transparent_1px)] bg-[radial-gradient(#dadde2,transparent_1px)] [background-size:16px_16px]"></div>
        {children}
      </div>
    </main>
  )
}
