import type { Metadata } from "next";
import { DM_Sans, DM_Mono } from "next/font/google";
import { QueryProvider } from "@/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs"

import "./globals.css";
import { ThemeProvider } from "next-themes";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"]
});

export const metadata: Metadata = {
  title: "Vibe",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{
      variables: {
        colorPrimary: "#a37764"
      }
    }}>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${dmSans.variable} ${dmMono.variable} antialiased`}
        >
          <QueryProvider>
            <ThemeProvider attribute={"class"} defaultTheme="system" disableTransitionOnChange>
              {children}
            </ThemeProvider >
            <Toaster />
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
