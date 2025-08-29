"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, FileText, Users, BookOpen, LogOut, User as UserIcon, MessageSquare, Bookmark, Building, Scale } from "lucide-react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";

interface MobileNavProps {
  user: User | null;
  handleSignOut: () => Promise<void>;
}

export function MobileNav({ user, handleSignOut }: MobileNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        <span className="sr-only">Toggle Menu</span>
      </Button>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white p-4">
          <div className="flex justify-end">
            <Button variant="ghost" size="icon" onClick={closeMenu}>
              <X className="h-6 w-6" />
              <span className="sr-only">Close Menu</span>
            </Button>
          </div>

          <nav className="flex flex-col space-y-4 mt-8">
            <Link href="/jobs" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600" onClick={closeMenu}>
              <FileText className="h-4 w-4" />
              <span>Jobs</span>
            </Link>
            
            <Link href="/about" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600" onClick={closeMenu}>
              <Users className="h-4 w-4" />
              <span>About</span>
            </Link>
            
            <Link href="/documentation" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600" onClick={closeMenu}>
              <BookOpen className="h-4 w-4" />
              <span>Documentation</span>
            </Link>

            <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
              {user ? (
                <>
                  <Link href="/dashboard" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600" onClick={closeMenu}>
                    <UserIcon className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                  <Link href="/messages" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600" onClick={closeMenu}>
                    <MessageSquare className="h-4 w-4" />
                    <span>Messages</span>
                  </Link>
                  <Link href="/saved-jobs" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600" onClick={closeMenu}>
                    <Bookmark className="h-4 w-4" />
                    <span>Saved Jobs</span>
                  </Link>
                  <Link href="/employer" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600" onClick={closeMenu}>
                    <Building className="h-4 w-4" />
                    <span>Employer Portal</span>
                  </Link>
                  <Link href="/legal-support" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600" onClick={closeMenu}>
                    <Scale className="h-4 w-4" />
                    <span>Legal Support</span>
                  </Link>
                  <form action={handleSignOut}>
                    <Button variant="ghost" className="w-full justify-start">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </form>
                </>
              ) : (
                <>
                  <Button variant="ghost" className="justify-start" asChild>
                    <Link href="/login" onClick={closeMenu}>Sign In</Link>
                  </Button>
                  <Button className="justify-start" asChild>
                    <Link href="/register" onClick={closeMenu}>Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
