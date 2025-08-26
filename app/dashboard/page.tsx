import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Footer } from "@/components/footer";
import { CheckCircle, MapPin, TrendingUp, Users, Briefcase, Building } from "lucide-react";
import { DashboardClient } from "./dashboard-client";
import { RolePlaceholder } from "./role-placeholder";
import { EmployerDashboard } from "./employer-dashboard";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  
  if (authError || !user) {
    console.error("Auth error:", authError);
    redirect("/login");
  }

  // Fetch profile, including the role
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, profile_completion")
    .eq("user_id", user.id)
    .single();

  // Redirect to profile edit page if profile is not created yet
  if (!profile) {
    redirect("/profile/edit");
  }

  // Render a different dashboard based on the user's role
  if (profile.role === "employer") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {profile.full_name ?? "User"}!</h1>
            <p className="text-gray-600">Your Employer Dashboard</p>
          </div>
          <EmployerDashboard />
        </div>
        <Footer />
      </div>
    );
  }

  if (profile.role === "legal_advisor") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {profile.full_name ?? "User"}!</h1>
            <p className="text-gray-600">Your Legal Advisor Dashboard</p>
          </div>
          <RolePlaceholder role={profile.role} />
        </div>
        <Footer />
      </div>
    );
  }

  // Default to Job Seeker dashboard
  const [jobApplicationsData, savedJobsData, jobsData] = await Promise.all([
    supabase.from("job_applications").select("*").eq("applicant_id", user.id),
    supabase.from("saved_jobs").select("job_id").eq("user_id", user.id),
    supabase.from("jobs").select("id, title, company, location").eq("status", "active").limit(5),
  ]);

  const jobApplications = jobApplicationsData.data ?? [];
  const savedJobs = savedJobsData.data ?? [];
  const recentJobs = jobsData.data ?? [];

  // Calculate profile completion
  const profileCompletion = profile.profile_completion ?? 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {profile.full_name ?? "User"}!</h1>
          <p className="text-gray-600">Track your applications and manage your European job search</p>
        </div>

        {/* Stats Cards for Job Seeker */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{jobApplications.length}</div>
              <p className="text-xs text-gray-500">Track your progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saved Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{savedJobs.length}</div>
              <p className="text-xs text-gray-500">Jobs you've saved</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profileCompletion}%</div>
              <Progress value={profileCompletion} className="mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Jobs</CardTitle>
              <Building className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentJobs.length}</div>
              <p className="text-xs text-gray-500">Recent opportunities</p>
            </CardContent>
          </Card>
        </div>

        <DashboardClient
          jobApplications={jobApplications}
          savedJobs={savedJobs}
          recentJobs={recentJobs}
          profileCompletion={profileCompletion}
        />
      </div>

      <Footer />
    </div>
  );
}
