import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Clock, 
  Euro, 
  Building, 
  Bookmark,
  ArrowLeft,
  Calendar,
  Target,
  TrendingUp
} from "lucide-react";
import Link from "next/link";
import { SavedJobsClient } from "./saved-jobs-client";

export default async function SavedJobsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get saved jobs for the current user
  const { data: savedJobs, error } = await supabase
    .from("saved_jobs")
    .select(`
      *,
      jobs (
        id,
        title,
        company,
        location,
        salary_min,
        salary_max,
        job_type,
        experience_level,
        description,
        created_at
      )
    `)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error fetching saved jobs:", error);
  }

  const jobsList = savedJobs?.map(item => item.jobs).filter(Boolean) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" asChild>
              <Link href="/jobs">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Jobs
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white rounded-lg p-2">
              <Bookmark className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Saved Jobs</h1>
              <p className="text-gray-600">
                {jobsList.length} job{jobsList.length !== 1 ? 's' : ''} saved
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {jobsList.length}
              </div>
              <div className="text-gray-600 font-medium">Saved Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {jobsList.filter(job => new Date(job.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
              </div>
              <div className="text-gray-600 font-medium">New This Week</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {jobsList.filter(job => job.salary_min && job.salary_min > 50000).length}
              </div>
              <div className="text-gray-600 font-medium">High-Paying</div>
            </div>
          </div>
        </div>

        {jobsList.length === 0 ? (
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="pt-6">
              <Bookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved jobs yet</h3>
              <p className="text-gray-600 mb-4">
                Start browsing jobs and save the ones you're interested in for later.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 transition-all shadow-lg">
                  <Link href="/jobs">
                    <Target className="h-5 w-5 mr-2" />
                    Browse Jobs
                  </Link>
                </Button>
                <Button size="lg" asChild variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 px-8 py-3 transition-all">
                  <Link href="/dashboard">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    View Dashboard
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <SavedJobsClient initialJobs={jobsList} />
        )}
      </div>
    </div>
  );
}
