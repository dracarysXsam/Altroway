import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Chatbot } from "@/components/chatbot/chatbot"
import { Toaster } from "@/components/ui/sonner"
import { Header } from "@/components/header"
import { MessageNotification } from "@/components/message-notification"
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
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
<<<<<<< HEAD
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
=======
        <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light">
>>>>>>> d617ea28f66047611f222d4169d33e7c51d38692
          <Header user={user} />
          {children}
          <Chatbot />
          <Toaster />
          <MessageNotification />
        </ThemeProvider>
      </body>
    </html>
  )
}
