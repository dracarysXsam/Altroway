"use server";

import { createClient } from "@/lib/supabase/server";

export async function testEmployerAccess() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Authentication required" };
  }

  // Test 1: Get user profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (profileError) {
    return { error: `Profile error: ${profileError.message}` };
  }

  // Test 2: Get jobs posted by this user
  const { data: jobs, error: jobsError } = await supabase
    .from("jobs")
    .select("id, title")
    .eq("employer_id", user.id);

  if (jobsError) {
    return { error: `Jobs error: ${jobsError.message}` };
  }

  // Test 3: Get applications for these jobs
  if (jobs && jobs.length > 0) {
    const jobIds = jobs.map(job => job.id);
    const { data: applications, error: appsError } = await supabase
      .from("job_applications")
      .select("id, status")
      .in("job_id", jobIds);

    if (appsError) {
      return { error: `Applications error: ${appsError.message}` };
    }

    return {
      success: true,
      profile: profile,
      jobs: jobs,
      applications: applications || [],
      message: `Found ${jobs.length} jobs and ${applications?.length || 0} applications`
    };
  }

  return {
    success: true,
    profile: profile,
    jobs: [],
    applications: [],
    message: "No jobs posted yet"
  };
}
