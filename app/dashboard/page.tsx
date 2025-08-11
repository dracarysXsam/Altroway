import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CheckCircle, MapPin, TrendingUp, Users } from "lucide-react";
import { DashboardClient } from "./dashboard-client";
import { RolePlaceholder } from "./role-placeholder";

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // Fetch profile, including the role
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("user_id", user.id)
    .single();

  // Redirect to profile edit page if profile is not created yet, which can happen.
  if (!profile) {
    redirect("/profile/edit");
  }

  // Render a different dashboard based on the user's role
  if (profile.role === "employer" || profile.role === "legal_advisor") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {profile.full_name ?? "User"}!</h1>
            <p className="text-gray-600">Your Employer Dashboard</p>
          </div>
          <RolePlaceholder role={profile.role} />
        </div>
        <Footer />
      </div>
    );
  }

  // Default to Job Seeker dashboard
  const [applicationsData, documentsData] = await Promise.all([
    supabase.from("applications").select("*").eq("user_id", user.id),
    supabase.from("documents").select("*").eq("user_id", user.id),
  ]);

  const applications = applicationsData.data ?? [];
  const documents = documentsData.data ?? [];

  // TODO: Calculate this dynamically based on profile fields
  const profileCompletion = 75;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

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
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{applications.length}</div>
              <p className="text-xs text-muted-foreground">Track your progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Documents Verified</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{documents.filter((d) => d.status === "Verified").length}</div>
              <p className="text-xs text-muted-foreground">
                {documents.filter((d) => d.status !== "Verified").length} pending
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profileCompletion}%</div>
              <Progress value={profileCompletion} className="mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Countries Explored</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">Germany, Netherlands, France</p>
            </CardContent>
          </Card>
        </div>

        <DashboardClient
          applications={applications}
          documents={documents}
          profileCompletion={profileCompletion}
        />
      </div>

      <Footer />
    </div>
  );
}
