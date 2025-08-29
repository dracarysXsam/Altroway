import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Globe, 
  Target, 
  Heart, 
  Shield, 
  Award, 
  TrendingUp, 
  Zap,
  Building,
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  ArrowRight,
  CheckCircle,
  Star,
  Lightbulb,
  Users2,
  Briefcase,
  Scale,
  MessageSquare,
  Search
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <Badge variant="outline" className="mb-6 text-blue-600 border-blue-600">
            <Heart className="h-4 w-4 mr-2" />
            About Altroway
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Connecting Dreams to
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              European Opportunities
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're on a mission to bridge the gap between talented professionals worldwide and the incredible opportunities that Europe has to offer.
          </p>
        </section>

        {/* Mission & Vision */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4 text-green-600 border-green-600">
                <Target className="h-4 w-4 mr-2" />
                Our Mission
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Empowering Global Talent
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                At Altroway, we believe that talent knows no borders. Our mission is to create a seamless platform that connects skilled professionals from around the world with the best opportunities across Europe.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We're not just a job board – we're your complete partner in your European career journey, providing everything from job matching to legal support and ongoing guidance.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">Verified Employers</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">Legal Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">Direct Communication</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <div className="text-center">
                <Globe className="h-16 w-16 mx-auto mb-6 text-white/80" />
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-lg text-blue-100 leading-relaxed">
                  To become the leading platform that makes European career opportunities accessible to every talented professional worldwide, fostering cultural diversity and economic growth across the continent.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 text-purple-600 border-purple-600">
              <Star className="h-4 w-4 mr-2" />
              Our Values
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              What Drives Us Forward
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do and shape the experience we provide to our users.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center p-8 hover:shadow-xl transition-all border-0 bg-white">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl mb-4">Inclusivity</CardTitle>
              <p className="text-gray-600">
                We believe in creating opportunities for everyone, regardless of background, nationality, or location.
              </p>
            </Card>

            <Card className="text-center p-8 hover:shadow-xl transition-all border-0 bg-white">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl mb-4">Trust & Security</CardTitle>
              <p className="text-gray-600">
                Your data and privacy are our top priorities. We maintain the highest standards of security and transparency.
              </p>
            </Card>

            <Card className="text-center p-8 hover:shadow-xl transition-all border-0 bg-white">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl mb-4">Innovation</CardTitle>
              <p className="text-gray-600">
                We continuously innovate to provide the best tools and experiences for our users and partners.
              </p>
            </Card>

            <Card className="text-center p-8 hover:shadow-xl transition-all border-0 bg-white">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl mb-4">Empathy</CardTitle>
              <p className="text-gray-600">
                We understand the challenges of international job seeking and provide compassionate support throughout the journey.
              </p>
            </Card>

            <Card className="text-center p-8 hover:shadow-xl transition-all border-0 bg-white">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl mb-4">Excellence</CardTitle>
              <p className="text-gray-600">
                We strive for excellence in everything we do, from user experience to customer support.
              </p>
            </Card>

            <Card className="text-center p-8 hover:shadow-xl transition-all border-0 bg-white">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl mb-4">Global Perspective</CardTitle>
              <p className="text-gray-600">
                We embrace diversity and understand the value of different perspectives and experiences.
              </p>
            </Card>
          </div>
        </section>

        {/* Story */}
        <section className="mb-20">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-12 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge variant="secondary" className="mb-6 text-gray-900 bg-white/90">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Our Story
                </Badge>
                <h2 className="text-3xl font-bold mb-6">
                  How It All Began
                </h2>
                <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                  Altroway was born from a simple observation: talented professionals around the world were struggling to access European opportunities, while European companies were looking for diverse talent.
                </p>
                <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                  Our founders experienced this challenge firsthand when trying to help friends and colleagues navigate the complex process of finding jobs in Europe. They realized that there was a need for a comprehensive platform that could bridge this gap.
                </p>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Today, we're proud to have helped thousands of professionals find their dream jobs in Europe, and we're just getting started.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 mb-6">
                  <Users2 className="h-16 w-16 mx-auto mb-4 text-white/80" />
                  <h3 className="text-2xl font-bold mb-2">500+</h3>
                  <p className="text-blue-100">Success Stories</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-xl p-4">
                    <h4 className="text-xl font-bold mb-1">27</h4>
                    <p className="text-gray-300 text-sm">Countries</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <h4 className="text-xl font-bold mb-1">150+</h4>
                    <p className="text-gray-300 text-sm">Active Jobs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 text-indigo-600 border-indigo-600">
              <Users2 className="h-4 w-4 mr-2" />
              Our Team
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Meet the People Behind Altroway
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're a diverse team of professionals passionate about connecting global talent with European opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center p-8 hover:shadow-xl transition-all border-0 bg-white">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">A</span>
              </div>
              <CardTitle className="text-xl mb-2">Alex Chen</CardTitle>
              <p className="text-gray-600 mb-4">CEO & Co-Founder</p>
              <p className="text-sm text-gray-500">
                Former tech executive with 15+ years experience in international business and talent acquisition.
              </p>
            </Card>

            <Card className="text-center p-8 hover:shadow-xl transition-all border-0 bg-white">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">S</span>
              </div>
              <CardTitle className="text-xl mb-2">Sarah Rodriguez</CardTitle>
              <p className="text-gray-600 mb-4">CTO & Co-Founder</p>
              <p className="text-sm text-gray-500">
                Full-stack developer and AI specialist with expertise in building scalable platforms.
              </p>
            </Card>

            <Card className="text-center p-8 hover:shadow-xl transition-all border-0 bg-white">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">M</span>
              </div>
              <CardTitle className="text-xl mb-2">Michael Schmidt</CardTitle>
              <p className="text-gray-600 mb-4">Head of Legal Affairs</p>
              <p className="text-sm text-gray-500">
                Immigration lawyer with 10+ years experience in European visa and work permit processes.
              </p>
            </Card>

            <Card className="text-center p-8 hover:shadow-xl transition-all border-0 bg-white">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">E</span>
              </div>
              <CardTitle className="text-xl mb-2">Emma Thompson</CardTitle>
              <p className="text-gray-600 mb-4">Head of Customer Success</p>
              <p className="text-sm text-gray-500">
                Former HR professional with deep understanding of the job market and candidate experience.
              </p>
            </Card>

            <Card className="text-center p-8 hover:shadow-xl transition-all border-0 bg-white">
              <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">D</span>
              </div>
              <CardTitle className="text-xl mb-2">David Kim</CardTitle>
              <p className="text-gray-600 mb-4">Head of Product</p>
              <p className="text-sm text-gray-500">
                Product manager with expertise in user experience and platform optimization.
              </p>
            </Card>

            <Card className="text-center p-8 hover:shadow-xl transition-all border-0 bg-white">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">L</span>
              </div>
              <CardTitle className="text-xl mb-2">Lisa Wang</CardTitle>
              <p className="text-gray-600 mb-4">Head of Marketing</p>
              <p className="text-sm text-gray-500">
                Marketing strategist with experience in global brand development and user acquisition.
              </p>
            </Card>
          </div>
        </section>

        {/* Services Overview */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 text-green-600 border-green-600">
              <Briefcase className="h-4 w-4 mr-2" />
              What We Offer
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Comprehensive Solutions for Your Success
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From job discovery to legal support, we provide everything you need for your European career journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6 hover:shadow-lg transition-all border-0 bg-gradient-to-br from-blue-50 to-blue-100">
              <Search className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <CardTitle className="text-lg mb-2">Job Matching</CardTitle>
              <p className="text-sm text-gray-600">
                AI-powered job recommendations based on your skills and preferences.
              </p>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-all border-0 bg-gradient-to-br from-green-50 to-green-100">
              <Scale className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <CardTitle className="text-lg mb-2">Legal Support</CardTitle>
              <p className="text-sm text-gray-600">
                Expert guidance for visas, work permits, and immigration processes.
              </p>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-all border-0 bg-gradient-to-br from-purple-50 to-purple-100">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-purple-600" />
              <CardTitle className="text-lg mb-2">Direct Communication</CardTitle>
              <p className="text-sm text-gray-600">
                Connect directly with employers and legal advisors through our platform.
              </p>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-all border-0 bg-gradient-to-br from-orange-50 to-orange-100">
              <Shield className="h-12 w-12 mx-auto mb-4 text-orange-600" />
              <CardTitle className="text-lg mb-2">Verified Employers</CardTitle>
              <p className="text-sm text-gray-600">
                All employers are thoroughly vetted to ensure quality opportunities.
              </p>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white p-12 border-0">
            <CardTitle className="text-3xl mb-6">Ready to Start Your Journey?</CardTitle>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who have already found their dream jobs in Europe through Altroway.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg px-8 py-6 bg-white text-blue-900 hover:bg-gray-100">
                <Link href="/register">
                  <Users className="h-5 w-5 mr-2" />
                  Get Started Today
                </Link>
              </Button>
              <Button size="lg" asChild className="text-lg px-8 py-6 bg-blue-700 text-white hover:bg-blue-800">
                <Link href="/contact">
                  <Mail className="h-5 w-5 mr-2" />
                  Contact Us
                </Link>
              </Button>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
