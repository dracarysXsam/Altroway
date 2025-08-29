import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Code, 
  Database, 
  Shield, 
  Users, 
  MessageSquare, 
  Briefcase, 
  Settings,
  Globe,
  Zap,
  Target,
  CheckCircle,
  Clock,
  AlertCircle,
  Star,
  GitBranch,
  Package,
  Server,
  Monitor,
  Lock,
  ArrowRight,
  FileText,
  Search,
  Building,
  Scale,
  Bookmark,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Euro,
  Award,
  TrendingUp,
  BarChart3,
  Download,
  Upload,
  Edit,
  Trash2,
  Eye,
  Plus,
  Save,
  Loader2
} from "lucide-react";
import Link from "next/link";

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <Badge variant="outline" className="mb-6 text-blue-600 border-blue-600">
            <BookOpen className="h-4 w-4 mr-2" />
            Project Documentation
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Altroway
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Technical Documentation
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Comprehensive guide to the Altroway platform architecture, features, and development status.
          </p>
        </section>

        {/* Project Overview */}
        <section className="mb-16">
          <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white p-8 border-0">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-3">
                <Globe className="h-8 w-8" />
                Project Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">Phase 2</div>
                  <div className="text-blue-100">Development Phase</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">85%</div>
                  <div className="text-blue-100">Completion</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">v1.2.0</div>
                  <div className="text-blue-100">Current Version</div>
                </div>
              </div>
              <p className="text-lg text-blue-100 leading-relaxed">
                Altroway is a comprehensive job platform connecting global talent with European opportunities. 
                Built with Next.js 15, Supabase, and modern web technologies, featuring real-time messaging, 
                legal support integration, and advanced job matching capabilities.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Technology Stack */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 text-green-600 border-green-600">
              <Code className="h-4 w-4 mr-2" />
              Technology Stack
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Modern Tech Stack
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built with cutting-edge technologies for performance, scalability, and user experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6 hover:shadow-lg transition-all border-0 bg-white">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Code className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-lg mb-2">Frontend</CardTitle>
              <div className="space-y-2 text-sm text-gray-600">
                <div>Next.js 15</div>
                <div>React 18</div>
                <div>TypeScript</div>
                <div>Tailwind CSS</div>
                <div>Shadcn UI</div>
              </div>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-all border-0 bg-white">
              <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Database className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-lg mb-2">Backend</CardTitle>
              <div className="space-y-2 text-sm text-gray-600">
                <div>Supabase</div>
                <div>PostgreSQL</div>
                <div>Real-time</div>
                <div>Row Level Security</div>
                <div>Edge Functions</div>
              </div>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-all border-0 bg-white">
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-lg mb-2">Security</CardTitle>
              <div className="space-y-2 text-sm text-gray-600">
                <div>Supabase Auth</div>
                <div>JWT Tokens</div>
                <div>RLS Policies</div>
                <div>HTTPS Only</div>
                <div>Data Encryption</div>
              </div>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-all border-0 bg-white">
              <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Server className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-lg mb-2">Deployment</CardTitle>
              <div className="space-y-2 text-sm text-gray-600">
                <div>Vercel</div>
                <div>Edge Runtime</div>
                <div>CDN</div>
                <div>Auto Scaling</div>
                <div>Git Integration</div>
              </div>
            </Card>
          </div>
        </section>

        {/* Features Documentation */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 text-purple-600 border-purple-600">
              <Zap className="h-4 w-4 mr-2" />
              Features
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Core Features & Implementation
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Detailed documentation of all implemented features and their technical specifications.
            </p>
          </div>

          <div className="space-y-8">
            {/* Authentication System */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-green-600" />
                  Authentication System
                  <Badge variant="secondary" className="ml-auto">Complete</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Comprehensive authentication system built with Supabase Auth, supporting email/password, 
                  social login, and role-based access control.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">Components:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Login/Register pages</li>
                      <li>• Password reset functionality</li>
                      <li>• Email verification</li>
                      <li>• Session management</li>
                      <li>• Role-based routing</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">Security Features:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• JWT token authentication</li>
                      <li>• Secure password hashing</li>
                      <li>• CSRF protection</li>
                      <li>• Rate limiting</li>
                      <li>• Session timeout</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Management */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                  Job Management System
                  <Badge variant="secondary" className="ml-auto">Complete</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Full-featured job posting and application system with advanced filtering, search, and management capabilities.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">Job Seeker Features:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Browse and search jobs</li>
                      <li>• Apply with cover letter</li>
                      <li>• Save favorite jobs</li>
                      <li>• Track applications</li>
                      <li>• Job recommendations</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">Employer Features:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Post job listings</li>
                      <li>• Manage applications</li>
                      <li>• Review candidates</li>
                      <li>• Analytics dashboard</li>
                      <li>• Application tracking</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Messaging System */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                  Real-time Messaging System
                  <Badge variant="secondary" className="ml-auto">Complete</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Advanced messaging system with real-time updates, file sharing, and conversation management.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">Core Features:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Real-time messaging</li>
                      <li>• Message status tracking</li>
                      <li>• File attachments</li>
                      <li>• Conversation history</li>
                      <li>• Unread notifications</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">Technical Implementation:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Supabase Realtime</li>
                      <li>• WebSocket connections</li>
                      <li>• Optimistic UI updates</li>
                      <li>• Message encryption</li>
                      <li>• Fallback polling</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Management */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-orange-600" />
                  Profile Management
                  <Badge variant="secondary" className="ml-auto">Complete</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Comprehensive profile system with customizable fields, avatar upload, and professional information management.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">Profile Features:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Professional bio</li>
                      <li>• Skills and experience</li>
                      <li>• Portfolio uploads</li>
                      <li>• Contact information</li>
                      <li>• Social links</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">Management:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Profile completion tracking</li>
                      <li>• Privacy settings</li>
                      <li>• Data export</li>
                      <li>• Account deletion</li>
                      <li>• Activity history</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Legal Support Integration */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Scale className="h-6 w-6 text-indigo-600" />
                  Legal Support Integration
                  <Badge variant="outline" className="ml-auto">In Progress</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Integration with legal advisors for visa and work permit assistance.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">Planned Features:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Legal advisor profiles</li>
                      <li>• Consultation booking</li>
                      <li>• Document upload</li>
                      <li>• Progress tracking</li>
                      <li>• Payment integration</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">Status:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Basic structure complete</li>
                      <li>• Advisor profiles in development</li>
                      <li>• Booking system planned</li>
                      <li>• Payment gateway pending</li>
                      <li>• Document management planned</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Database Schema */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 text-indigo-600 border-indigo-600">
              <Database className="h-4 w-4 mr-2" />
              Database Schema
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Data Architecture
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive database design with proper relationships and security policies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Users & Profiles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-gray-600">
                  <strong>profiles</strong> - User profile information
                </div>
                <div className="text-sm text-gray-600">
                  <strong>auth.users</strong> - Authentication data
                </div>
                <div className="text-sm text-gray-600">
                  <strong>user_roles</strong> - Role assignments
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Job Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-gray-600">
                  <strong>jobs</strong> - Job listings
                </div>
                <div className="text-sm text-gray-600">
                  <strong>job_applications</strong> - Applications
                </div>
                <div className="text-sm text-gray-600">
                  <strong>saved_jobs</strong> - User favorites
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Messaging</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-gray-600">
                  <strong>conversations</strong> - Chat threads
                </div>
                <div className="text-sm text-gray-600">
                  <strong>messages</strong> - Individual messages
                </div>
                <div className="text-sm text-gray-600">
                  <strong>message_attachments</strong> - Files
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Legal Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-gray-600">
                  <strong>legal_advisors</strong> - Advisor profiles
                </div>
                <div className="text-sm text-gray-600">
                  <strong>consultations</strong> - Booking records
                </div>
                <div className="text-sm text-gray-600">
                  <strong>legal_documents</strong> - Document storage
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">System</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-gray-600">
                  <strong>site_settings</strong> - Configuration
                </div>
                <div className="text-sm text-gray-600">
                  <strong>notifications</strong> - User alerts
                </div>
                <div className="text-sm text-gray-600">
                  <strong>audit_logs</strong> - Activity tracking
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Analytics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-gray-600">
                  <strong>job_views</strong> - View tracking
                </div>
                <div className="text-sm text-gray-600">
                  <strong>application_stats</strong> - Statistics
                </div>
                <div className="text-sm text-gray-600">
                  <strong>user_activity</strong> - Engagement data
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Development Status */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 text-orange-600 border-orange-600">
              <GitBranch className="h-4 w-4 mr-2" />
              Development Status
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Current Phase & Roadmap
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Overview of completed features, current development, and future plans.
            </p>
          </div>

          <div className="space-y-6">
            {/* Phase 1 - Complete */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-green-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  Phase 1: Foundation (Complete)
                  <Badge variant="secondary" className="ml-auto">100%</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Completed:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Authentication system</li>
                      <li>• Basic user profiles</li>
                      <li>• Job posting system</li>
                      <li>• Application process</li>
                      <li>• Basic messaging</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Technologies:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Next.js 15 setup</li>
                      <li>• Supabase integration</li>
                      <li>• UI component library</li>
                      <li>• Database schema</li>
                      <li>• Basic security</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Phase 2 - Current */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Clock className="h-6 w-6 text-blue-600" />
                  Phase 2: Enhancement (Current)
                  <Badge variant="outline" className="ml-auto">85%</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">In Progress:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Advanced messaging system</li>
                      <li>• Profile optimization</li>
                      <li>• Legal support integration</li>
                      <li>• Admin dashboard</li>
                      <li>• Performance optimization</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Next Steps:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Payment integration</li>
                      <li>• Advanced search</li>
                      <li>• Analytics dashboard</li>
                      <li>• Mobile app</li>
                      <li>• API documentation</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Phase 3 - Planned */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-purple-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Target className="h-6 w-6 text-purple-600" />
                  Phase 3: Advanced Features (Planned)
                  <Badge variant="outline" className="ml-auto">0%</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Planned Features:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• AI-powered job matching</li>
                      <li>• Video interviews</li>
                      <li>• Skill assessments</li>
                      <li>• Career coaching</li>
                      <li>• Community features</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Advanced Tech:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Machine learning</li>
                      <li>• Real-time analytics</li>
                      <li>• Advanced security</li>
                      <li>• Microservices</li>
                      <li>• Cloud optimization</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* API Documentation */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 text-red-600 border-red-600">
              <Code className="h-4 w-4 mr-2" />
              API Reference
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              API Endpoints
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              RESTful API endpoints for external integrations and mobile applications.
            </p>
          </div>

          <div className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Authentication Endpoints</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-mono text-sm bg-green-100 text-green-800 px-2 py-1 rounded">POST</span>
                      <span className="ml-3 font-mono text-sm">/api/auth/login</span>
                    </div>
                    <span className="text-sm text-gray-600">User authentication</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-mono text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">POST</span>
                      <span className="ml-3 font-mono text-sm">/api/auth/register</span>
                    </div>
                    <span className="text-sm text-gray-600">User registration</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-mono text-sm bg-red-100 text-red-800 px-2 py-1 rounded">POST</span>
                      <span className="ml-3 font-mono text-sm">/api/auth/logout</span>
                    </div>
                    <span className="text-sm text-gray-600">User logout</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Job Management Endpoints</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-mono text-sm bg-green-100 text-green-800 px-2 py-1 rounded">GET</span>
                      <span className="ml-3 font-mono text-sm">/api/jobs</span>
                    </div>
                    <span className="text-sm text-gray-600">List all jobs</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-mono text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">POST</span>
                      <span className="ml-3 font-mono text-sm">/api/jobs</span>
                    </div>
                    <span className="text-sm text-gray-600">Create new job</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-mono text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">PUT</span>
                      <span className="ml-3 font-mono text-sm">/api/jobs/[id]</span>
                    </div>
                    <span className="text-sm text-gray-600">Update job</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Messaging Endpoints</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-mono text-sm bg-green-100 text-green-800 px-2 py-1 rounded">GET</span>
                      <span className="ml-3 font-mono text-sm">/api/conversations</span>
                    </div>
                    <span className="text-sm text-gray-600">List conversations</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-mono text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">POST</span>
                      <span className="ml-3 font-mono text-sm">/api/messages</span>
                    </div>
                    <span className="text-sm text-gray-600">Send message</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-mono text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">GET</span>
                      <span className="ml-3 font-mono text-sm">/api/messages/[id]</span>
                    </div>
                    <span className="text-sm text-gray-600">Get conversation</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Performance & Monitoring */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 text-yellow-600 border-yellow-600">
              <Monitor className="h-4 w-4 mr-2" />
              Performance & Monitoring
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              System Performance
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Current performance metrics and monitoring systems in place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6 border-0 shadow-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-lg mb-2">Response Time</CardTitle>
              <div className="text-2xl font-bold text-green-600 mb-2">~200ms</div>
              <p className="text-sm text-gray-600">Average API response</p>
            </Card>

            <Card className="text-center p-6 border-0 shadow-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Server className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-lg mb-2">Uptime</CardTitle>
              <div className="text-2xl font-bold text-blue-600 mb-2">99.9%</div>
              <p className="text-sm text-gray-600">Service availability</p>
            </Card>

            <Card className="text-center p-6 border-0 shadow-lg">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-lg mb-2">Concurrent Users</CardTitle>
              <div className="text-2xl font-bold text-purple-600 mb-2">1000+</div>
              <p className="text-sm text-gray-600">Supported capacity</p>
            </Card>

            <Card className="text-center p-6 border-0 shadow-lg">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="h-8 w-8 text-orange-600" />
              </div>
              <CardTitle className="text-lg mb-2">Database</CardTitle>
              <div className="text-2xl font-bold text-orange-600 mb-2">~50ms</div>
              <p className="text-sm text-gray-600">Query response time</p>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-12 border-0">
            <CardTitle className="text-3xl mb-6">Need Technical Support?</CardTitle>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              For technical questions, API integration, or development support, our team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg px-8 py-6 bg-white text-gray-900 hover:bg-gray-100">
                <Link href="/contact">
                  <Mail className="h-5 w-5 mr-2" />
                  Contact Support
                </Link>
              </Button>
              <Button size="lg" asChild className="text-lg px-8 py-6 bg-blue-600 text-white hover:bg-blue-700">
                <Link href="/about">
                  <Users className="h-5 w-5 mr-2" />
                  Meet the Team
                </Link>
              </Button>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
