import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Briefcase, Users, Eye, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

export default async function EmployerPortal() {
  const supabase = await createClient();

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // Check if user is an employer (using user metadata)
  const userRole = user.user_metadata?.role || 'job_seeker';
  if (userRole !== "employer" && userRole !== "super_admin") {
    redirect("/dashboard");
  }

  const { data: jobs, error: jobsError } = await supabase
    .from("jobs")
    .select(`
      *,
      job_applications(count)
    `)
    .eq("employer_id", user.id)
    .order("created_at", { ascending: false });

  if (jobsError) {
    console.error("Error fetching jobs:", jobsError);
  }

  // Fetch application statistics
  const { data: applications } = await supabase
    .from("job_applications")
    .select("status")
    .in("job_id", jobs?.map(job => job.id) || []);

  const totalApplications = applications?.length || 0;
  const pendingApplications = applications?.filter(app => app.status === "pending").length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Employer Portal</h1>
          <p className="text-gray-600 mt-2">Manage your job postings and applications</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{jobs?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Active job postings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalApplications}</div>
              <p className="text-xs text-muted-foreground">All applications received</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingApplications}</div>
              <p className="text-xs text-muted-foreground">Applications to review</p>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="mb-6">
          <Button asChild>
            <Link href="/employer/create-job">
              <Plus className="h-4 w-4 mr-2" />
              Post New Job
            </Link>
          </Button>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Your Job Postings</h2>
          
          {jobs && jobs.length > 0 ? (
            <div className="grid gap-6">
              {jobs.map((job) => (
                <Card key={job.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{job.title}</CardTitle>
                        <CardDescription>{job.company} - {job.location}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={job.status === "active" ? "default" : "secondary"}>
                          {job.status}
                        </Badge>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/employer/jobs/${job.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/employer/jobs/${job.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Applications: {job.job_applications?.[0]?.count || 0}</span>
                      <span>Posted: {new Date(job.created_at).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No job postings yet</h3>
                <p className="text-gray-600 mb-4">Start by creating your first job posting</p>
                <Button asChild>
                  <Link href="/employer/create-job">
                    <Plus className="h-4 w-4 mr-2" />
                    Post Your First Job
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
