import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Upload
} from "lucide-react";
import Link from "next/link";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    redirect("/profile/edit");
  }

  // Get user's applications
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
        salary_max
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
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "reviewed": return "bg-blue-100 text-blue-800";
      case "shortlisted": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "hired": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getUnreadMessageCount = (messages: any[], currentUserId: string) => {
    if (!messages) return 0;
    return messages.filter(msg => !msg.read && msg.sender_id !== currentUserId).length;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your profile, applications, and messages</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={profile.avatar_url} />
                    <AvatarFallback>
                      {profile.full_name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{profile.full_name}</CardTitle>
                    <p className="text-sm text-gray-600">{profile.headline || "Job Seeker"}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{profile.email}</span>
                  </div>
                  {profile.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                  {profile.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <Button asChild className="w-full">
                    <Link href="/profile/edit">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Applications</span>
                  <span className="font-semibold">{applications?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Conversations</span>
                  <span className="font-semibold">{conversations?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Shortlisted</span>
                  <span className="font-semibold text-green-600">
                    {applications?.filter(a => a.status === 'shortlisted').length || 0}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="applications" className="space-y-6">
              <TabsList>
                <TabsTrigger value="applications">Applications</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
                <TabsTrigger value="resume">Resume</TabsTrigger>
              </TabsList>

              <TabsContent value="applications" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">My Applications</h2>
                  <Link href="/jobs">
                    <Button>Browse More Jobs</Button>
                  </Link>
                </div>

                {!applications || applications.length === 0 ? (
                  <Card className="text-center py-12">
                    <CardContent>
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
                      <p className="text-gray-600 mb-4">Start applying to jobs to see your applications here</p>
                      <Link href="/jobs">
                        <Button>Browse Jobs</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {applications.map((application) => (
                      <Card key={application.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-lg">
                                  {application.jobs?.title}
                                </h3>
                                <Badge className={getApplicationStatusColor(application.status)}>
                                  {application.status}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center gap-4 text-gray-600 mb-2">
                                <div className="flex items-center gap-1">
                                  <Building className="h-4 w-4" />
                                  <span>{application.jobs?.company}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  <span>{application.jobs?.location}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span>{formatSalary(application.jobs?.salary_min, application.jobs?.salary_max)}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>Applied {formatDate(application.applied_at)}</span>
                                </div>
                              </div>

                              {application.cover_letter && (
                                <div className="mt-3">
                                  <p className="text-sm text-gray-600 line-clamp-2">
                                    <strong>Cover Letter:</strong> {application.cover_letter}
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className="flex flex-col gap-2 ml-4">
                              <Link href={`/jobs/${application.jobs?.id}`}>
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4 mr-1" />
                                  View Job
                                </Button>
                              </Link>
                              {application.resume_path && (
                                <Button size="sm" variant="outline">
                                  <Download className="h-4 w-4 mr-1" />
                                  Resume
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="messages" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Messages</h2>
                  <Link href="/messages">
                    <Button>View All Messages</Button>
                  </Link>
                </div>

                {!conversations || conversations.length === 0 ? (
                  <Card className="text-center py-12">
                    <CardContent>
                      <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
                      <p className="text-gray-600 mb-4">Messages from employers will appear here</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {conversations.map((conversation) => {
                      const unreadCount = getUnreadMessageCount(conversation.messages, user.id);
                      const lastMessage = conversation.messages?.[conversation.messages.length - 1];

                      return (
                        <Link key={conversation.id} href={`/messages/${conversation.id}`}>
                          <Card className="hover:shadow-md transition-shadow cursor-pointer">
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h3 className="font-semibold text-lg">
                                      {conversation.job_applications?.jobs?.title} at {conversation.job_applications?.jobs?.company}
                                    </h3>
                                    {unreadCount > 0 && (
                                      <Badge variant="destructive">
                                        {unreadCount} new
                                      </Badge>
                                    )}
                                  </div>
                                  
                                  {lastMessage && (
                                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                      {lastMessage.content}
                                    </p>
                                  )}

                                  <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Clock className="h-3 w-3" />
                                    <span>{formatDate(conversation.updated_at)}</span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="resume" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Resume & Documents</h2>
                  <Button>
                    <Edit className="h-4 w-4 mr-2" />
                    Upload Resume
                  </Button>
                </div>

                <Card>
                  <CardContent className="p-6">
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No resume uploaded</h3>
                      <p className="text-gray-600 mb-4">Upload your resume to make applying to jobs easier</p>
                      <Button>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Resume
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
