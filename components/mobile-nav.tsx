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
        <div className="fixed inset-0 z-50 bg-white border border-gray-200 shadow-2xl p-4">
          <div className="flex justify-end">
            <Button variant="ghost" size="icon" onClick={closeMenu} className="text-gray-700 hover:bg-gray-100">
              <X className="h-6 w-6" />
              <span className="sr-only">Close Menu</span>
            </Button>
          </div>

          <nav className="flex flex-col space-y-4 mt-8">
            <Link href="/jobs" className="flex items-center space-x-2 text-gray-800 hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors" onClick={closeMenu}>
              <FileText className="h-4 w-4" />
              <span className="font-medium">Jobs</span>
            </Link>
            
            <Link href="/about" className="flex items-center space-x-2 text-gray-800 hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors" onClick={closeMenu}>
              <Users className="h-4 w-4" />
              <span className="font-medium">About</span>
            </Link>
            
            <Link href="/documentation" className="flex items-center space-x-2 text-gray-800 hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors" onClick={closeMenu}>
              <BookOpen className="h-4 w-4" />
              <span className="font-medium">Documentation</span>
            </Link>

            <div className="flex flex-col space-y-2 pt-4 border-t border-gray-300">
              {user ? (
                <>
                  <Link href="/dashboard" className="flex items-center space-x-2 text-gray-800 hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors" onClick={closeMenu}>
                    <UserIcon className="h-4 w-4" />
                    <span className="font-medium">Profile</span>
                  </Link>
                  <Link href="/messages" className="flex items-center space-x-2 text-gray-800 hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors" onClick={closeMenu}>
                    <MessageSquare className="h-4 w-4" />
                    <span className="font-medium">Messages</span>
                  </Link>
                  <Link href="/saved-jobs" className="flex items-center space-x-2 text-gray-800 hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors" onClick={closeMenu}>
                    <Bookmark className="h-4 w-4" />
                    <span className="font-medium">Saved Jobs</span>
                  </Link>
                  <Link href="/employer" className="flex items-center space-x-2 text-gray-800 hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors" onClick={closeMenu}>
                    <Building className="h-4 w-4" />
                    <span className="font-medium">Employer Portal</span>
                  </Link>
                  <Link href="/legal-support" className="flex items-center space-x-2 text-gray-800 hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors" onClick={closeMenu}>
                    <Scale className="h-4 w-4" />
                    <span className="font-medium">Legal Support</span>
                  </Link>
                  <form action={handleSignOut}>
                    <Button variant="ghost" className="w-full justify-start text-gray-800 hover:text-red-600 hover:bg-red-50 py-2 px-3 rounded-lg transition-colors">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </form>
                </>
              ) : (
                <>
                  <Button variant="ghost" className="justify-start text-gray-800 hover:text-blue-600 hover:bg-blue-50 py-2 px-3 rounded-lg transition-colors" asChild>
                    <Link href="/login" onClick={closeMenu}>Sign In</Link>
                  </Button>
                  <Button className="justify-start bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg transition-colors" asChild>
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
