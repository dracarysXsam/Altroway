import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  FileText, 
  MessageSquare, 
  Calendar, 
  MapPin, 
  Mail, 
  Phone,
  Edit,
  Download,
  Eye,
  Building,
  CheckCircle,
  Clock,
  AlertCircle,
  Upload,
  Star,
  TrendingUp,
  Award,
  Briefcase,
  Euro,
  Globe,
  Heart,
  Share2,
  Settings,
  Bell,
  Bookmark,
  ExternalLink,
  ArrowRight,
  Plus,
  Target,
  Zap,
  Shield,
  Users,
  BarChart3
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user profile with enhanced data
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // If no profile exists, create a basic one
  if (!profile) {
    // Create a basic profile
    const { data: newProfile } = await supabase
      .from("profiles")
      .insert({
        user_id: user.id,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        email: user.email,
        role: 'job_seeker',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (newProfile) {
      redirect("/profile/edit");
    }
  }

  // Get user's applications with enhanced data
  const { data: applications } = await supabase
    .from("job_applications")
    .select(`
      id,
      status,
      applied_at,
      cover_letter,
      resume_path,
      jobs (
        id,
        title,
        company,
        location,
        salary_min,
        salary_max,
        job_type,
        experience_level
      )
    `)
    .eq("applicant_id", user.id)
    .order("applied_at", { ascending: false });

  // Get user's conversations
  const { data: conversations } = await supabase
    .from("conversations")
    .select(`
      id,
      updated_at,
      job_applications (
        jobs (
          title,
          company
        )
      ),
      messages (
        id,
        content,
        sender_id,
        created_at,
        read
      )
    `)
    .eq("job_applications.applicant_id", user.id)
    .order("updated_at", { ascending: false });

  // Calculate statistics
  const totalApplications = applications?.length || 0;
  const pendingApplications = applications?.filter(app => app.status === 'pending').length || 0;
  const shortlistedApplications = applications?.filter(app => app.status === 'shortlisted').length || 0;
  const hiredApplications = applications?.filter(app => app.status === 'hired').length || 0;
  const totalConversations = conversations?.length || 0;
  const unreadMessages = conversations?.reduce((total, conv) => {
    return total + (conv.messages?.filter(msg => !msg.read && msg.sender_id !== user.id).length || 0);
  }, 0) || 0;

  // Calculate profile completion percentage
  const profileFields = [
    profile?.full_name,
    profile?.headline,
    profile?.bio,
    profile?.location,
    profile?.phone,
    profile?.avatar_url
  ];
  const completedFields = profileFields.filter(field => field && field.trim() !== '').length;
  const profileCompletion = Math.round((completedFields / profileFields.length) * 100);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatSalary = (min?: number, max?: number) => {
    if (min && max) {
      return `€${min.toLocaleString()} - €${max.toLocaleString()}`;
    } else if (min) {
      return `€${min.toLocaleString()}+`;
    } else if (max) {
      return `Up to €${max.toLocaleString()}`;
    }
    return "Salary not specified";
  };

  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "reviewed": return "bg-blue-100 text-blue-800 border-blue-200";
      case "shortlisted": return "bg-green-100 text-green-800 border-green-200";
      case "rejected": return "bg-red-100 text-red-800 border-red-200";
      case "hired": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="h-4 w-4" />;
      case "reviewed": return <Eye className="h-4 w-4" />;
      case "shortlisted": return <CheckCircle className="h-4 w-4" />;
      case "rejected": return <AlertCircle className="h-4 w-4" />;
      case "hired": return <Award className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative mb-8">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl"></div>
          
          <div className="relative p-8 rounded-3xl border border-white/20 backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              {/* Profile Avatar */}
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {profile?.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1 border-2 border-white">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {profile?.full_name || user.email?.split('@')[0] || 'User'}
                    </h1>
                    <p className="text-xl text-gray-600 mb-3">
                      {profile?.headline || 'Professional looking for opportunities'}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      {profile?.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{profile.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Member since {formatDate(profile?.created_at || user.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="capitalize">
                          {profile?.role?.replace('_', ' ') || 'job seeker'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                      <Link href="/profile/edit">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Link>
                    </Button>
                    <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="outline" size="icon" className="border-gray-300 hover:bg-gray-50">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Applications</p>
                  <p className="text-2xl font-bold text-blue-900">{totalApplications}</p>
                </div>
                <div className="p-3 bg-blue-500 rounded-full">
                  <FileText className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">Pending Review</p>
                  <p className="text-2xl font-bold text-yellow-900">{pendingApplications}</p>
                </div>
                <div className="p-3 bg-yellow-500 rounded-full">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Shortlisted</p>
                  <p className="text-2xl font-bold text-green-900">{shortlistedApplications}</p>
                </div>
                <div className="p-3 bg-green-500 rounded-full">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Messages</p>
                  <p className="text-2xl font-bold text-purple-900">{totalConversations}</p>
                  {unreadMessages > 0 && (
                    <p className="text-xs text-purple-600">{unreadMessages} unread</p>
                  )}
                </div>
                <div className="p-3 bg-purple-500 rounded-full">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Completion */}
        {profileCompletion < 100 && (
          <Card className="mb-8 border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-500 rounded-full">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-orange-900 mb-2">Complete Your Profile</h3>
                  <p className="text-sm text-orange-700 mb-3">
                    A complete profile increases your chances of getting hired by {100 - profileCompletion}%
                  </p>
                  <div className="flex items-center gap-3">
                    <Progress value={profileCompletion} className="flex-1 h-2" />
                    <span className="text-sm font-medium text-orange-900">{profileCompletion}%</span>
                  </div>
                </div>
                <Button asChild size="sm" className="bg-orange-600 hover:bg-orange-700">
                  <Link href="/profile/edit">
                    Complete Now
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content - No Tabs */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* About Section */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  About
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile?.bio ? (
                  <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No bio added yet</p>
                    <Button asChild variant="outline" size="sm" className="mt-2">
                      <Link href="/profile/edit">Add Bio</Link>
                    </Button>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-gray-600">{profile?.email || user.email}</p>
                    </div>
                  </div>
                  {profile?.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Phone</p>
                        <p className="text-sm text-gray-600">{profile.phone}</p>
                      </div>
                    </div>
                  )}
                  {profile?.location && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Location</p>
                        <p className="text-sm text-gray-600">{profile.location}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Member Since</p>
                      <p className="text-sm text-gray-600">{formatDate(profile?.created_at || user.created_at)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link href="/jobs">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Browse Jobs
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link href="/messages">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    View Messages
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link href="/saved-jobs">
                    <Bookmark className="h-4 w-4 mr-2" />
                    Saved Jobs
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link href="/profile/edit">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Applications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Applications ({totalApplications})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!applications || applications.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications yet</h3>
                  <p className="text-gray-600 mb-4">Start applying to jobs to see your applications here</p>
                  <Button asChild>
                    <Link href="/jobs">
                      <Plus className="h-4 w-4 mr-2" />
                      Browse Jobs
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.slice(0, 3).map((application) => (
                    <div key={application.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {application.jobs?.title}
                            </h3>
                            <Badge className={`${getApplicationStatusColor(application.status)} border`}>
                              {getStatusIcon(application.status)}
                              <span className="ml-1 capitalize">{application.status}</span>
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-2">{application.jobs?.company}</p>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {application.jobs?.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Euro className="h-3 w-3" />
                              {formatSalary(application.jobs?.salary_min, application.jobs?.salary_max)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Applied {formatDate(application.applied_at)}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                          <Button asChild size="sm" variant="outline">
                            <Link href={`/jobs/${application.jobs?.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              View Job
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {applications.length > 3 && (
                    <div className="text-center pt-4">
                      <Button asChild variant="outline">
                        <Link href="/messages">
                          View All Applications
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Conversations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Recent Conversations ({totalConversations})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!conversations || conversations.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversations yet</h3>
                  <p className="text-gray-600 mb-4">Start applying to jobs to begin conversations with employers</p>
                  <Button asChild>
                    <Link href="/jobs">
                      <Plus className="h-4 w-4 mr-2" />
                      Browse Jobs
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {conversations.slice(0, 3).map((conversation) => {
                    const lastMessage = conversation.messages?.[conversation.messages.length - 1];
                    const unreadCount = conversation.messages?.filter(msg => !msg.read && msg.sender_id !== user.id).length || 0;
                    
                    return (
                      <div key={conversation.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {conversation.job_applications?.jobs?.title} at {conversation.job_applications?.jobs?.company}
                            </h3>
                            {lastMessage && (
                              <p className="text-sm text-gray-600 line-clamp-1">
                                {lastMessage.content}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              {lastMessage ? formatDate(lastMessage.created_at) : 'No messages yet'}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            {unreadCount > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                {unreadCount}
                              </Badge>
                            )}
                            <Button asChild size="sm">
                              <Link href={`/messages/${conversation.id}`}>
                                <MessageSquare className="h-4 w-4 mr-1" />
                                Open
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {conversations.length > 3 && (
                    <div className="text-center pt-4">
                      <Button asChild variant="outline">
                        <Link href="/messages">
                          View All Conversations
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
