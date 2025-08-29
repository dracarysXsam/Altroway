import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Users, 
  Eye, 
  Calendar,
  MapPin,
  Building,
  Euro,
  Briefcase,
  Clock
} from "lucide-react";
import Link from "next/link";

interface JobDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const supabase = await createClient();
  const { id } = await params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get the job details
  const { data: job } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .single();

  if (!job) {
    notFound();
  }

  // Check if user owns this job or is super admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  const isOwner = job.employer_id === user.id;
  const isSuperAdmin = profile?.role === "super_admin";

  if (!isOwner && !isSuperAdmin) {
    redirect("/employer");
  }

  // Get applications for this job
  const { data: applications } = await supabase
    .from("job_applications")
    .select(`
      id,
      status,
      applied_at,
      applicant_id,
      profiles (
        full_name,
        email,
        avatar_url,
        bio,
        location
      )
    `)
    .eq("job_id", id)
    .order("applied_at", { ascending: false });

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

  const getStatusCount = (status: string) => {
    return applications?.filter(app => app.status === status).length || 0;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/employer" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Employer Portal
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <p className="text-gray-600">{job.company}</p>
            </div>
            
            <div className="flex gap-2">
              <Link href={`/employer/jobs/${id}/edit`}>
                <Button variant="outline" className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Job
                </Button>
              </Link>
              
              <Button variant="destructive" className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Details */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Job Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{job.company}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{job.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600 capitalize">{job.job_type?.replace('-', ' ')}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Euro className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{formatSalary(job.salary_min, job.salary_max)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600 capitalize">{job.experience_level?.replace('-', ' ')}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Posted {formatDate(job.created_at)}</span>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                    {job.status}
                  </Badge>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold mb-2">Job Description</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
                </div>

                {/* Requirements */}
                {job.requirements && (
                  <div>
                    <h3 className="font-semibold mb-2">Requirements & Qualifications</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{job.requirements}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Applications */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Applications ({applications?.length || 0})</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="outline">{getStatusCount('pending')} Pending</Badge>
                    <Badge variant="outline">{getStatusCount('shortlisted')} Shortlisted</Badge>
                    <Badge variant="outline">{getStatusCount('hired')} Hired</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {!applications || applications.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">No applications yet</p>
                    <p className="text-sm text-gray-500">Applications will appear here when candidates apply</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((application) => (
                      <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            {application.profiles?.avatar_url ? (
                              <img 
                                src={application.profiles.avatar_url} 
                                alt={application.profiles.full_name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-sm font-medium">
                                {application.profiles?.full_name?.charAt(0) || "U"}
                              </span>
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold">{application.profiles?.full_name || "Unknown"}</h4>
                            <p className="text-sm text-gray-600">{application.profiles?.email}</p>
                            <p className="text-xs text-gray-500">{application.profiles?.location}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Badge className={getApplicationStatusColor(application.status)}>
                            {application.status}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {formatDate(application.applied_at)}
                          </span>
                          <Link href={`/dashboard?tab=applications&application=${application.id}`}>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Quick Stats */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Applications</span>
                  <span className="font-semibold">{applications?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Pending Review</span>
                  <span className="font-semibold text-yellow-600">{getStatusCount('pending')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Shortlisted</span>
                  <span className="font-semibold text-green-600">{getStatusCount('shortlisted')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Hired</span>
                  <span className="font-semibold text-blue-600">{getStatusCount('hired')}</span>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href={`/jobs/${id}`} className="w-full">
                  <Button variant="outline" className="w-full justify-start">
                    <Eye className="h-4 w-4 mr-2" />
                    View Public Page
                  </Button>
                </Link>
                
                <Link href={`/employer/jobs/${id}/edit`} className="w-full">
                  <Button variant="outline" className="w-full justify-start">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Job
                  </Button>
                </Link>
                
                <Button variant="destructive" className="w-full justify-start">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Job
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
