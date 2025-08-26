"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getEmployerApplications() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Authentication required" };
  }

  // First get all job IDs posted by this employer
  const { data: employerJobs, error: jobsError } = await supabase
    .from("jobs")
    .select("id")
    .eq("employer_id", user.id);

  if (jobsError) {
    console.error("Error fetching employer jobs:", jobsError);
    return { error: "Failed to fetch employer jobs" };
  }

  if (!employerJobs || employerJobs.length === 0) {
    return { applications: [] };
  }

  const jobIds = employerJobs.map(job => job.id);

  // Get all applications for these jobs
  const { data: applications, error } = await supabase
    .from("job_applications")
    .select(`
      *,
      applicant:profiles(
        id,
        full_name,
        email,
        avatar_url,
        headline,
        skills
      ),
      job:jobs(
        id,
        title,
        company,
        location
      )
    `)
    .in('job_id', jobIds)
    .order("applied_at", { ascending: false });

  if (error) {
    console.error("Error fetching applications:", error);
    return { error: "Failed to fetch applications" };
  }

  console.log("Successfully fetched applications:", applications);
  return { applications };
}

export async function updateApplicationStatus(applicationId: string, status: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Authentication required" };
  }

  // Verify the employer owns the job for this application
  const { data: application, error: fetchError } = await supabase
    .from("job_applications")
    .select(`
      *,
      job:jobs(employer_id)
    `)
    .eq("id", applicationId)
    .single();

  if (fetchError || !application) {
    return { error: "Application not found" };
  }

  if (application.job.employer_id !== user.id) {
    return { error: "Unauthorized to update this application" };
  }

  // Update the application status
  const { error } = await supabase
    .from("job_applications")
    .update({ 
      status,
      updated_at: new Date().toISOString()
    })
    .eq("id", applicationId);

  if (error) {
    console.error("Error updating application:", error);
    return { error: "Failed to update application status" };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function getApplicationDetails(applicationId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Authentication required" };
  }

  // Get detailed application information
  const { data: application, error } = await supabase
    .from("job_applications")
    .select(`
      *,
      applicant:profiles(
        id,
        full_name,
        email,
        avatar_url,
        headline,
        skills,
        portfolio_url
      ),
      job:jobs(
        id,
        title,
        company,
        location,
        employer_id
      )
    `)
    .eq("id", applicationId)
    .single();

  if (error) {
    console.error("Error fetching application details:", error);
    return { error: "Failed to fetch application details" };
  }

  // Verify the employer owns the job
  if (application.job.employer_id !== user.id) {
    return { error: "Unauthorized to view this application" };
  }

  return { application };
}

export async function sendMessageToApplicant(applicationId: string, message: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Authentication required" };
  }

  // Verify the employer owns the job for this application
  const { data: application, error: fetchError } = await supabase
    .from("job_applications")
    .select(`
      *,
      job:jobs(employer_id)
    `)
    .eq("id", applicationId)
    .single();

  if (fetchError || !application) {
    return { error: "Application not found" };
  }

  if (application.job.employer_id !== user.id) {
    return { error: "Unauthorized to message this applicant" };
  }

  // Get or create conversation for this application
  let { data: conversation } = await supabase
    .from("conversations")
    .select("id")
    .eq("job_application_id", applicationId)
    .single();

  if (!conversation) {
    // Create conversation if it doesn't exist
    const { data: newConversation, error: createError } = await supabase
      .from("conversations")
      .insert({ job_application_id: applicationId })
      .select("id")
      .single();

    if (createError) {
      console.error("Error creating conversation:", createError);
      return { error: "Failed to create conversation" };
    }
    conversation = newConversation;
  }

  // Send the message
  const { error: messageError } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversation.id,
      sender_id: user.id,
      content: message,
    });

  if (messageError) {
    console.error("Error sending message:", messageError);
    return { error: "Failed to send message" };
  }

  // Update conversation timestamp
  await supabase
    .from("conversations")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", conversation.id);

  revalidatePath("/dashboard");
  revalidatePath(`/messages/${conversation.id}`);

  return { success: true, conversationId: conversation.id };
}
