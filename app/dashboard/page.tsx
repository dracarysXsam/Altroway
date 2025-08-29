import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardClient } from "./dashboard-client";
import { EmployerDashboard } from "./employer-dashboard";
import { SuperAdminDashboard } from "./super-admin-dashboard";

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

  // Use user metadata for role instead of profiles table
  const userRole = user.user_metadata?.role || 'job_seeker';

  if (userRole === "super_admin") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.email}!</h1>
            <p className="text-muted-foreground">Super Admin Dashboard - Complete control over the entire system</p>
          </div>
          <SuperAdminDashboard />
        </div>
      </div>
    );
  }

  if (userRole === "employer") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.email}!</h1>
            <p className="text-gray-600">Your Employer Dashboard</p>
          </div>
          <EmployerDashboard />
        </div>
      </div>
    );
  }

  // For job seekers - get their applications and conversations
  const [jobsData, applicationsData, conversationsData] = await Promise.all([
    supabase.from("jobs").select("*").eq("status", "active"),
    supabase.from("job_applications").select(`
      *,
      jobs(*)
    `).eq("applicant_id", user.id),
    supabase.from("conversations").select(`
      *,
      job_applications(
        jobs(*)
      )
    `).eq("job_applications.applicant_id", user.id)
  ]);

  const jobs = jobsData.data ?? [];
  const applications = applicationsData.data ?? [];
  const conversations = conversationsData.data ?? [];

  const dashboardData = {
    profile: { user_id: user.id, email: user.email, role: userRole },
    jobs,
    applications,
    conversations
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <DashboardClient data={dashboardData} />
      </div>
    </div>
  );
}
