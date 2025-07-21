"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, FileText, Users, BookOpen } from "lucide-react"
import Link from "next/link"

interface MobileNavProps {
  user: any // Replace with actual user type if available
  handleSignOut: () => Promise<void>
}

export const MobileNav: React.FC<MobileNavProps> = ({ user, handleSignOut }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        <span className="sr-only">Toggle Menu</span>
      </Button>

      {isMenuOpen && (
        <div className="fixed top-0 left-0 w-full h-screen bg-white z-50 p-4">
          <div className="flex justify-end">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
              <X className="h-6 w-6" />
              <span className="sr-only">Close Menu</span>
            </Button>
          </div>

          <nav className="flex flex-col space-y-4 mt-8">
            <Link
              href="/jobs"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Users className="h-4 w-4" />
              <span>Jobs</span>
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <FileText className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/legal-support"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Users className="h-4 w-4" />
              <span>Legal Support</span>
            </Link>
            <Link
              href="/guides"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <BookOpen className="h-4 w-4" />
              <span>Guides</span>
            </Link>
            <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
              <Button variant="ghost" className="justify-start" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button className="justify-start" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </div>
  )
}
