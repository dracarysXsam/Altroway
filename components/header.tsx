import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import Link from "next/link";
import { MobileNav } from "./mobile-nav";
import { createClient } from "@/lib/supabase/server";
import { UserMenu } from "./user-menu";
import { logout } from "@/app/actions/auth-actions";

export async function Header() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <UserMenu user={user} />
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>
          {/* Mobile Menu */}
          <MobileNav user={user} handleSignOut={logout} />
        </div>
      </div>
    </header>
  );
}
