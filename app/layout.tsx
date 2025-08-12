import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Chatbot } from "@/components/chatbot/chatbot"
import { Toaster } from "@/components/ui/sonner"
import { Header } from "@/components/header"
import { createClient } from "@/lib/supabase/server"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Altroway - Your Gateway to Europe",
  description: "Find your dream job in Europe with comprehensive support for visa applications and relocation",
  generator: "v0.dev",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header user={user} />
          {children}
          <Chatbot />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
