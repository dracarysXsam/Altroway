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
  Calendar
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
        </div>

        {jobsList.length === 0 ? (
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="pt-6">
              <Bookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved jobs yet</h3>
              <p className="text-gray-600 mb-4">
                Start browsing jobs and save the ones you're interested in for later.
              </p>
              <Button asChild>
                <Link href="/jobs">Browse Jobs</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <SavedJobsClient initialJobs={jobsList} />
        )}
      </div>
    </div>
  );
}
