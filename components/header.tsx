"use client"

import { Button } from "@/components/ui/button"
import { MapPin, FileText, Users, BookOpen } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { MobileNav } from "./mobile-nav" // Add this import

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white rounded-lg p-2">
              <MapPin className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Altroway</span>
          </Link>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/jobs" className="text-gray-600 hover:text-blue-600 transition-colors">
              Jobs
            </Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
              Dashboard
            </Link>
            <Link href="/legal-support" className="text-gray-600 hover:text-blue-600 transition-colors">
              Legal Support
            </Link>
            <Link href="/guides" className="text-gray-600 hover:text-blue-600 transition-colors">
              Guides
            </Link>
          </nav>
          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
          {/* Mobile Menu Button */}
          <MobileNav user={null} handleSignOut={async () => {}} /> {/* Pass user and signOut action */}
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
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
    </header>
  )
}
