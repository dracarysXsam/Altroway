import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Users, 
  Globe, 
  Scale, 
  MessageSquare, 
  Bookmark, 
  Shield, 
  Star, 
  ArrowRight,
  CheckCircle,
  FileText,
  Building,
  MapPin,
  Euro,
  Clock,
  Award,
  TrendingUp,
  Zap,
  Target,
  Heart
} from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/footer";

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch dynamic stats
  const { count: jobCount } = await supabase
    .from("jobs")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  const { count: userCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-24 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30px_30px,rgba(255,255,255,0.1)_2px,transparent_2px)] bg-[length:60px_60px]"></div>
          </div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-5xl mx-auto">
              <Badge variant="secondary" className="mb-6 text-blue-600 bg-white/90 px-4 py-2 text-sm font-medium">
                <Globe className="h-4 w-4 mr-2" />
                Your Gateway to European Opportunities
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                Find Your Dream Job in
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">Europe</span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
                Connect with top European employers, get expert legal guidance, and build your career across the continent with our comprehensive platform.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                <Button size="lg" asChild className="text-lg px-10 py-6 bg-white text-blue-900 hover:bg-gray-100 shadow-lg transform hover:scale-105 transition-all">
                  <Link href="/jobs">
                    <Search className="h-6 w-6 mr-3" />
                    Browse Jobs
                  </Link>
                </Button>
                <Button size="lg" asChild className="text-lg px-10 py-6 bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-lg transform hover:scale-105 transition-all">
                  <Link href="/register">
                    <Users className="h-6 w-6 mr-3" />
                    Join Now
                  </Link>
                </Button>
              </div>

              {/* Enhanced Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                <div className="text-center group">
                  <div className="text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform">{jobCount || 150}+</div>
                  <div className="text-blue-100 font-medium">Active Jobs</div>
                </div>
                <div className="text-center group">
                  <div className="text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform">27</div>
                  <div className="text-blue-100 font-medium">Countries</div>
                </div>
                <div className="text-center group">
                  <div className="text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform">{userCount || 500}+</div>
                  <div className="text-blue-100 font-medium">Success Stories</div>
                </div>
                <div className="text-center group">
                  <div className="text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform">10+</div>
                  <div className="text-blue-100 font-medium">Legal Partners</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4 text-blue-600 border-blue-600">
                <Target className="h-4 w-4 mr-2" />
                How It Works
              </Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Your Journey to European Success
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Follow our proven 4-step process to land your dream job in Europe
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {/* Step 1 */}
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 h-full border border-blue-200 hover:shadow-lg transition-all group">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Create Your Profile</h3>
                  <p className="text-gray-600 mb-6">
                    Build a compelling profile showcasing your skills, experience, and career goals.
                  </p>
                  <div className="flex items-center text-blue-600 font-medium">
                    <Users className="h-5 w-5 mr-2" />
                    Get Started
                  </div>
                </div>
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className="h-8 w-8 text-blue-300" />
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 h-full border border-green-200 hover:shadow-lg transition-all group">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Find Your Job</h3>
                  <p className="text-gray-600 mb-6">
                    Browse thousands of opportunities and apply to positions that match your expertise.
                  </p>
                  <div className="flex items-center text-green-600 font-medium">
                    <Search className="h-5 w-5 mr-2" />
                    Browse Jobs
                  </div>
                </div>
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className="h-8 w-8 text-green-300" />
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 h-full border border-purple-200 hover:shadow-lg transition-all group">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Connect & Communicate</h3>
                  <p className="text-gray-600 mb-6">
                    Directly communicate with employers and get legal guidance for your application.
                  </p>
                  <div className="flex items-center text-purple-600 font-medium">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Start Chatting
                  </div>
                </div>
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className="h-8 w-8 text-purple-300" />
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative">
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 h-full border border-orange-200 hover:shadow-lg transition-all group">
                  <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-2xl font-bold text-white">4</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Land Your Dream Job</h3>
                  <p className="text-gray-600 mb-6">
                    Get hired and start your new career in Europe with our ongoing support.
                  </p>
                  <div className="flex items-center text-orange-600 font-medium">
                    <Award className="h-5 w-5 mr-2" />
                    Success!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4 text-green-600 border-green-600">
                <Zap className="h-4 w-4 mr-2" />
                Why Choose Altroway?
              </Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Everything You Need for Success
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our comprehensive platform provides all the tools and support you need for your European career journey
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card className="text-center p-8 hover:shadow-xl transition-all border-0 bg-white">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Search className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl mb-4">Smart Job Matching</CardTitle>
                <p className="text-gray-600 leading-relaxed">
                  Our AI-powered system matches you with the perfect job opportunities based on your skills, experience, and preferences.
                </p>
              </Card>

              <Card className="text-center p-8 hover:shadow-xl transition-all border-0 bg-white">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Scale className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl mb-4">Expert Legal Support</CardTitle>
                <p className="text-gray-600 leading-relaxed">
                  Get professional guidance for visas, work permits, and immigration processes from certified legal advisors.
                </p>
              </Card>

              <Card className="text-center p-8 hover:shadow-xl transition-all border-0 bg-white">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl mb-4">Direct Communication</CardTitle>
                <p className="text-gray-600 leading-relaxed">
                  Connect directly with employers and legal advisors through our integrated messaging system.
                </p>
              </Card>

              <Card className="text-center p-8 hover:shadow-xl transition-all border-0 bg-white">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl mb-4">Secure & Trusted</CardTitle>
                <p className="text-gray-600 leading-relaxed">
                  Your data is protected with enterprise-grade security and all employers are verified.
                </p>
              </Card>

              <Card className="text-center p-8 hover:shadow-xl transition-all border-0 bg-white">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Globe className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl mb-4">European Network</CardTitle>
                <p className="text-gray-600 leading-relaxed">
                  Access opportunities across 27 European countries with our extensive network of employers.
                </p>
              </Card>

              <Card className="text-center p-8 hover:shadow-xl transition-all border-0 bg-white">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl mb-4">Career Growth</CardTitle>
                <p className="text-gray-600 leading-relaxed">
                  Track your applications, get insights, and grow your career with our comprehensive tools.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Success Stories Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4 text-purple-600 border-purple-600">
                <Heart className="h-4 w-4 mr-2" />
                Success Stories
              </Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Real People, Real Success
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Join thousands of professionals who have found their dream jobs in Europe
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="p-8 hover:shadow-xl transition-all border-0 bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">M</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Maria Santos</h4>
                    <p className="text-sm text-gray-600">Software Engineer</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  "Altroway helped me find my dream job in Berlin. The legal support made the visa process so much easier!"
                </p>
                <div className="flex items-center text-blue-600">
                  <Star className="h-4 w-4 fill-current mr-1" />
                  <Star className="h-4 w-4 fill-current mr-1" />
                  <Star className="h-4 w-4 fill-current mr-1" />
                  <Star className="h-4 w-4 fill-current mr-1" />
                  <Star className="h-4 w-4 fill-current mr-2" />
                  <span className="text-sm font-medium">5.0</span>
                </div>
              </Card>

              <Card className="p-8 hover:shadow-xl transition-all border-0 bg-gradient-to-br from-green-50 to-green-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">A</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Ahmed Hassan</h4>
                    <p className="text-sm text-gray-600">Data Scientist</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  "The job matching was incredible. I found a position in Amsterdam that perfectly fits my skills and goals."
                </p>
                <div className="flex items-center text-green-600">
                  <Star className="h-4 w-4 fill-current mr-1" />
                  <Star className="h-4 w-4 fill-current mr-1" />
                  <Star className="h-4 w-4 fill-current mr-1" />
                  <Star className="h-4 w-4 fill-current mr-1" />
                  <Star className="h-4 w-4 fill-current mr-2" />
                  <span className="text-sm font-medium">5.0</span>
                </div>
              </Card>

              <Card className="p-8 hover:shadow-xl transition-all border-0 bg-gradient-to-br from-purple-50 to-purple-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">S</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Sarah Johnson</h4>
                    <p className="text-sm text-gray-600">Marketing Manager</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  "Direct communication with employers was a game-changer. I got hired within 2 weeks of joining!"
                </p>
                <div className="flex items-center text-purple-600">
                  <Star className="h-4 w-4 fill-current mr-1" />
                  <Star className="h-4 w-4 fill-current mr-1" />
                  <Star className="h-4 w-4 fill-current mr-1" />
                  <Star className="h-4 w-4 fill-current mr-1" />
                  <Star className="h-4 w-4 fill-current mr-2" />
                  <span className="text-sm font-medium">5.0</span>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
          <div className="container mx-auto px-4 text-center">
            <Badge variant="secondary" className="mb-6 text-blue-600 bg-white/90">
              <Zap className="h-4 w-4 mr-2" />
              Ready to Start?
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Your European Dream Starts Here
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
              Join thousands of professionals who have already found their dream jobs in Europe. Start your journey today!
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
              <Button size="lg" asChild className="text-lg px-10 py-6 bg-white text-blue-900 hover:bg-gray-100 shadow-lg transform hover:scale-105 transition-all">
                <Link href="/register">
                  <Users className="h-6 w-6 mr-3" />
                  Get Started Today
                </Link>
              </Button>
              <Button size="lg" asChild className="text-lg px-10 py-6 bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-lg transform hover:scale-105 transition-all">
                <Link href="/jobs">
                  <Search className="h-6 w-6 mr-3" />
                  Browse Jobs
                </Link>
              </Button>
            </div>
            <p className="text-blue-200 text-sm">
              Free to join • No hidden fees • 100% secure
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
