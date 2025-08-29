import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Building,
  ArrowLeft,
  MessageSquare,
  Eye
} from "lucide-react";
import Link from "next/link";

interface ProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const supabase = await createClient();
  const { id } = await params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Handle undefined or invalid profile ID
  if (!id || id === "undefined") {
    redirect("/profile");
  }

  // Get the profile being viewed
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", id)
    .single();

  if (!profile) {
    notFound();
  }

  // Check if current user has permission to view this profile
  // Users can view profiles if:
  // 1. It's their own profile
  // 2. They're in a conversation with this user
  // 3. They're a super admin
  const currentUserProfile = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  const isOwnProfile = user.id === id;
  const isSuperAdmin = currentUserProfile?.data?.role === "super_admin";

  // Check if users are in a conversation together
  const { data: sharedConversations } = await supabase
    .from("conversations")
    .select(`
      id,
      job_applications (
        applicant_id,
        jobs (
          employer_id
        )
      )
    `)
    .or(`job_applications.applicant_id.eq.${user.id},job_applications.jobs.employer_id.eq.${user.id}`)
    .or(`job_applications.applicant_id.eq.${id},job_applications.jobs.employer_id.eq.${id}`);

  const hasSharedConversation = sharedConversations && sharedConversations.length > 0;

  // If not authorized, redirect to own profile
  if (!isOwnProfile && !isSuperAdmin && !hasSharedConversation) {
    redirect("/profile");
  }

  // Get user's job applications (if viewing own profile)
  const applications = isOwnProfile ? await supabase
    .from("job_applications")
    .select(`
      id,
      status,
      applied_at,
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
    .order("applied_at", { ascending: false }) : null;

  // Get user's posted jobs (if employer)
  const postedJobs = profile.role === "employer" ? await supabase
    .from("jobs")
    .select(`
      id,
      title,
      company,
      location,
      salary_min,
      salary_max,
      status,
      created_at
    `)
    .eq("employer_id", id)
    .order("created_at", { ascending: false }) : null;

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/messages" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Messages
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isOwnProfile ? "My Profile" : `${profile.full_name}'s Profile`}
          </h1>
          <p className="text-gray-600">
            {isOwnProfile ? "Manage your profile and applications" : "View profile information"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profile.avatar_url} />
                    <AvatarFallback className="text-lg">
                      {profile.full_name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-xl">{profile.full_name}</CardTitle>
                    <p className="text-sm text-gray-600">{profile.headline || profile.role}</p>
                    <Badge variant={profile.role === "employer" ? "default" : "secondary"}>
                      {profile.role}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
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
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>Member since {formatDate(profile.created_at)}</span>
                  </div>
                </div>

                {profile.bio && (
                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-2">About</h4>
                    <p className="text-sm text-gray-600">{profile.bio}</p>
                  </div>
                )}

                {isOwnProfile && (
                  <div className="pt-4 border-t">
                    <Button asChild className="w-full">
                      <Link href="/profile/edit">
                        Edit Profile
                      </Link>
                    </Button>
                  </div>
                )}

                {!isOwnProfile && hasSharedConversation && (
                  <div className="pt-4 border-t space-y-2">
                    <Button asChild className="w-full">
                      <Link href="/messages">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        View Messages
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            {isOwnProfile && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Applications</span>
                    <span className="font-semibold">{applications?.data?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Shortlisted</span>
                    <span className="font-semibold text-green-600">
                      {applications?.data?.filter((a: any) => a.status === 'shortlisted').length || 0}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {profile.role === "employer" && postedJobs?.data && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Posted Jobs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Active Jobs</span>
                    <span className="font-semibold">
                      {postedJobs.data.filter((job: any) => job.status === 'active').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Jobs</span>
                    <span className="font-semibold">{postedJobs.data.length}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {isOwnProfile && applications?.data && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Applications</CardTitle>
                    <Link href="/jobs">
                      <Button size="sm">Browse More Jobs</Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {applications.data.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">No applications yet</p>
                      <Link href="/jobs">
                        <Button>Browse Jobs</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {applications.data.slice(0, 5).map((application: any) => (
                        <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-semibold">{application.jobs?.title}</h4>
                            <p className="text-sm text-gray-600">{application.jobs?.company}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getApplicationStatusColor(application.status)}>
                                {application.status}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                Applied {formatDate(application.applied_at)}
                              </span>
                            </div>
                          </div>
                          <Link href={`/jobs/${application.jobs?.id}`}>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-1" />
                              View Job
                            </Button>
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {profile.role === "employer" && postedJobs?.data && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Posted Jobs</CardTitle>
                </CardHeader>
                <CardContent>
                  {postedJobs.data.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600">No jobs posted yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {postedJobs.data.slice(0, 5).map((job: any) => (
                        <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-semibold">{job.title}</h4>
                            <p className="text-sm text-gray-600">{job.company}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                                {job.status}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {formatSalary(job.salary_min, job.salary_max)}
                              </span>
                            </div>
                          </div>
                          <Link href={`/jobs/${job.id}`}>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-1" />
                              View Job
                            </Button>
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
