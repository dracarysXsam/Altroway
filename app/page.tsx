import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Users, Globe, Scale, MessageSquare, Bookmark, Shield, Star } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/footer";

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch dynamic stats
  const { count: jobCount } = await supabase
    .from("jobs")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <Badge variant="secondary" className="mb-4 text-blue-600 bg-white/90">
                <Globe className="h-4 w-4 mr-2" />
                Your Gateway to Europe
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Find Your Dream Job in
                <span className="block text-white">Europe</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Connect with top European employers and build your career across the continent.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button size="lg" asChild className="text-lg px-8 py-6 bg-white text-blue-900">
                  <Link href="/jobs">
                    <Search className="h-5 w-5 mr-2" />
                    Browse Jobs
                  </Link>
                </Button>
                <Button size="lg" asChild className="text-lg px-8 py-6 bg-white text-blue-900">
                  <Link href="/register">
                    <Users className="h-5 w-5 mr-2" />
                    Join Now
                  </Link>
                </Button>
              </div>

              {/* Simple Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{jobCount || 150}+</div>
                  <div className="text-blue-100">Active Jobs</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">27</div>
                  <div className="text-blue-100">Countries</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">500+</div>
                  <div className="text-blue-100">Success Stories</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">10+</div>
                  <div className="text-blue-100">Legal Partners</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Simple Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Choose Altroway?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Everything you need for your European career journey
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Card className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl mb-2">Smart Job Matching</CardTitle>
                <p className="text-gray-600">
                  Find the perfect job opportunities based on your skills and experience.
                </p>
              </Card>

              <Card className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Scale className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl mb-2">Legal Support</CardTitle>
                <p className="text-gray-600">
                  Get expert guidance for visas, work permits, and immigration processes.
                </p>
              </Card>

              <Card className="text-center p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl mb-2">Direct Communication</CardTitle>
                <p className="text-gray-600">
                  Connect directly with employers and legal advisors.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Simple CTA Section */}
        <section className="py-16 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Start Your European Journey?
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who have already found their dream jobs in Europe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg px-8 py-6 bg-white text-blue-900">
                <Link href="/register">
                  <Users className="h-5 w-5 mr-2" />
                  Get Started Today
                </Link>
              </Button>
              <Button size="lg" asChild className="text-lg px-8 py-6 bg-blue-700 text-white">
                <Link href="/jobs">
                  <Search className="h-5 w-5 mr-2" />
                  Browse Jobs
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
