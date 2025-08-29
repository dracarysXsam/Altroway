"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
  job_application_id: string;
  job_applications: {
    id: string;
    status: string;
    applied_at: string;
    applicant_id: string;
    jobs: {
      id: string;
      title: string;
      company: string;
      employer_id: string;
    };
    profiles?: {
      full_name: string;
      avatar_url: string;
    };
  };
  messages: Array<{
    id: string;
    content: string;
    sender_id: string;
    created_at: string;
    read: boolean;
    profiles?: {
      full_name: string;
      avatar_url: string;
    };
  }>;
}

export async function getConversations() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Authentication required" };
  }

  // Get user's role to filter conversations appropriately
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  const userRole = profile?.role || "job_seeker";

  let conversations: Conversation[] = [];

  // Filter conversations based on user role
  if (userRole === "employer") {
    // Employers can only see conversations for jobs they posted
    const { data: employerJobs } = await supabase
      .from("jobs")
      .select("id")
      .eq("employer_id", user.id);

    if (employerJobs && employerJobs.length > 0) {
      const jobIds = employerJobs.map(job => job.id);
      
      const { data: employerApplications } = await supabase
        .from("job_applications")
        .select("id")
        .in("job_id", jobIds);

      if (employerApplications && employerApplications.length > 0) {
        const applicationIds = employerApplications.map(app => app.id);
        
        const { data: employerConversations, error } = await supabase
          .from("conversations")
          .select(`
            id,
            created_at,
            updated_at,
            job_application_id,
            job_applications (
              id,
              status,
              applied_at,
              applicant_id,
              jobs (
                id,
                title,
                company,
                employer_id
              ),
              profiles!job_applications_applicant_id_fkey (
                full_name,
                avatar_url
              )
            ),
            messages (
              id,
              content,
              sender_id,
              created_at,
              read
            )
          `)
          .in("job_application_id", applicationIds)
          .order("updated_at", { ascending: false });

        if (error) {
          console.error("Error fetching employer conversations:", error);
          return { error: "Failed to fetch conversations" };
        }

        conversations = employerConversations || [];
      }
    }
  } else if (userRole === "job_seeker") {
    // Job seekers can only see conversations for their applications
    const { data: jobSeekerApplications } = await supabase
      .from("job_applications")
      .select("id")
      .eq("applicant_id", user.id);

    if (jobSeekerApplications && jobSeekerApplications.length > 0) {
      const applicationIds = jobSeekerApplications.map(app => app.id);
      
      const { data: jobSeekerConversations, error } = await supabase
        .from("conversations")
        .select(`
          id,
          created_at,
          updated_at,
          job_application_id,
          job_applications (
            id,
            status,
            applied_at,
            applicant_id,
            jobs (
              id,
              title,
              company,
              employer_id
            ),
            profiles!job_applications_applicant_id_fkey (
              full_name,
              avatar_url
            )
          ),
          messages (
            id,
            content,
            sender_id,
            created_at,
            read
          )
        `)
        .in("job_application_id", applicationIds)
        .order("updated_at", { ascending: false });

      if (error) {
        console.error("Error fetching job seeker conversations:", error);
        return { error: "Failed to fetch conversations" };
      }

      conversations = jobSeekerConversations || [];
    }
  } else {
    // Super admins can see all conversations
    const { data: allConversations, error } = await supabase
      .from("conversations")
      .select(`
        id,
        created_at,
        updated_at,
        job_application_id,
        job_applications (
          id,
          status,
          applied_at,
          applicant_id,
          jobs (
            id,
            title,
            company,
            employer_id
          ),
          profiles!job_applications_applicant_id_fkey (
            full_name,
            avatar_url
          )
        ),
        messages (
          id,
          content,
          sender_id,
          created_at,
          read
        )
      `)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching all conversations:", error);
      return { error: "Failed to fetch conversations" };
    }

    conversations = allConversations || [];
  }

  return { conversations };
}

export async function getConversation(conversationId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Authentication required" };
  }

  // First check if user is authorized to access this conversation
  const { data: conversationCheck } = await supabase
    .from("conversations")
    .select(`
      job_application_id,
      job_applications (
        applicant_id,
        jobs (
          employer_id
        )
      )
    `)
    .eq("id", conversationId)
    .single();

  if (!conversationCheck) {
    return { error: "Conversation not found" };
  }

  // Check authorization
  const application = conversationCheck.job_applications;
  const isAuthorized = user.id === application.applicant_id || 
                      user.id === application.jobs.employer_id;

  // For super admins, allow access to all conversations
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (!isAuthorized && profile?.role !== "super_admin") {
    return { error: "Access denied" };
  }

  const { data: conversation, error } = await supabase
    .from("conversations")
    .select(`
      id,
      created_at,
      updated_at,
      job_application_id,
      job_applications (
        id,
        status,
        applied_at,
        applicant_id,
        jobs (
          id,
          title,
          company,
          employer_id
        ),
        profiles!job_applications_applicant_id_fkey (
          full_name,
          avatar_url
        )
      ),
      messages (
        id,
        content,
        sender_id,
        created_at,
        read,
        profiles!messages_sender_id_fkey (
          full_name,
          avatar_url
        )
      )
    `)
    .eq("id", conversationId)
    .single();

  if (error) {
    console.error("Error fetching conversation:", error);
    return { error: "Failed to fetch conversation" };
  }

  return { conversation };
}

export async function sendMessage(conversationId: string, content: string) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Authentication required" };
    }

    if (!content.trim()) {
      return { success: false, error: "Message content is required" };
    }

    // Check if user is authorized to send messages in this conversation
    const { data: conversationCheck } = await supabase
      .from("conversations")
      .select(`
        job_application_id,
        job_applications (
          applicant_id,
          jobs (
            employer_id
          )
        )
      `)
      .eq("id", conversationId)
      .single();

    if (!conversationCheck) {
      return { success: false, error: "Conversation not found" };
    }

    // Check authorization
    const application = conversationCheck.job_applications;
    const isAuthorized = user.id === application.applicant_id || 
                        user.id === application.jobs.employer_id;

    // For super admins, allow sending messages in all conversations
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (!isAuthorized && profile?.role !== "super_admin") {
      return { success: false, error: "Access denied" };
    }

    // Insert the message
    const { data: message, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: content.trim(),
        read: false
      })
      .select()
      .single();

    if (error) {
      console.error("Error sending message:", error);
      return { success: false, error: error.message };
    }

    // Update conversation's updated_at timestamp
    await supabase
      .from("conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", conversationId);

    revalidatePath("/messages");
    revalidatePath(`/messages/${conversationId}`);

    return { success: true, data: message };
  } catch (error) {
    console.error("sendMessage error:", error);
    return { success: false, error: "Failed to send message" };
  }
}

export async function createConversation(jobApplicationId: string) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Authentication required" };
    }

    // Check if user is authorized to create a conversation for this application
    const { data: application } = await supabase
      .from("job_applications")
      .select(`
        id,
        applicant_id,
        jobs (
          employer_id
        )
      `)
      .eq("id", jobApplicationId)
      .single();

    if (!application) {
      return { success: false, error: "Job application not found" };
    }

    // Check authorization
    const isAuthorized = user.id === application.applicant_id || 
                        user.id === application.jobs.employer_id;

    // For super admins, allow creating conversations for any application
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (!isAuthorized && profile?.role !== "super_admin") {
      return { success: false, error: "Access denied" };
    }

    // Check if conversation already exists
    const { data: existingConversation } = await supabase
      .from("conversations")
      .select("id")
      .eq("job_application_id", jobApplicationId)
      .single();

    if (existingConversation) {
      return { success: true, data: existingConversation };
    }

    // Create new conversation
    const { data: conversation, error } = await supabase
      .from("conversations")
      .insert({
        job_application_id: jobApplicationId
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating conversation:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/messages");

    return { success: true, data: conversation };
  } catch (error) {
    console.error("createConversation error:", error);
    return { success: false, error: "Failed to create conversation" };
  }
}

export async function markMessagesAsRead(conversationId: string) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Authentication required" };
    }

    // Check if user is authorized to mark messages as read in this conversation
    const { data: conversationCheck } = await supabase
      .from("conversations")
      .select(`
        job_application_id,
        job_applications (
          applicant_id,
          jobs (
            employer_id
          )
        )
      `)
      .eq("id", conversationId)
      .single();

    if (!conversationCheck) {
      return { success: false, error: "Conversation not found" };
    }

    // Check authorization
    const application = conversationCheck.job_applications;
    const isAuthorized = user.id === application.applicant_id || 
                        user.id === application.jobs.employer_id;

    // For super admins, allow marking messages as read in all conversations
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (!isAuthorized && profile?.role !== "super_admin") {
      return { success: false, error: "Access denied" };
    }

    // Mark all unread messages in this conversation as read
    const { error } = await supabase
      .from("messages")
      .update({ read: true })
      .eq("conversation_id", conversationId)
      .neq("sender_id", user.id)
      .eq("read", false);

    if (error) {
      console.error("Error marking messages as read:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("markMessagesAsRead error:", error);
    return { success: false, error: "Failed to mark messages as read" };
  }
}

export async function getUnreadMessageCount() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { count: 0 };
  }

  // Get user's role to filter conversations appropriately
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  const userRole = profile?.role || "job_seeker";

  let conversationIds: string[] = [];

  // Filter conversations based on user role
  if (userRole === "employer") {
    // Employers can only see conversations for jobs they posted
    const { data: employerJobs } = await supabase
      .from("jobs")
      .select("id")
      .eq("employer_id", user.id);

    if (employerJobs && employerJobs.length > 0) {
      const jobIds = employerJobs.map(job => job.id);
      
      const { data: employerApplications } = await supabase
        .from("job_applications")
        .select("id")
        .in("job_id", jobIds);

      if (employerApplications && employerApplications.length > 0) {
        const applicationIds = employerApplications.map(app => app.id);
        
        const { data: employerConversations } = await supabase
          .from("conversations")
          .select("id")
          .in("job_application_id", applicationIds);

        if (employerConversations) {
          conversationIds = employerConversations.map(conv => conv.id);
        }
      }
    }
  } else if (userRole === "job_seeker") {
    // Job seekers can only see conversations for their applications
    const { data: jobSeekerApplications } = await supabase
      .from("job_applications")
      .select("id")
      .eq("applicant_id", user.id);

    if (jobSeekerApplications && jobSeekerApplications.length > 0) {
      const applicationIds = jobSeekerApplications.map(app => app.id);
      
      const { data: jobSeekerConversations } = await supabase
        .from("conversations")
        .select("id")
        .in("job_application_id", applicationIds);

      if (jobSeekerConversations) {
        conversationIds = jobSeekerConversations.map(conv => conv.id);
      }
    }
  } else {
    // Super admins can see all conversations
    const { data: allConversations } = await supabase
      .from("conversations")
      .select("id");

    if (allConversations) {
      conversationIds = allConversations.map(conv => conv.id);
    }
  }

  if (conversationIds.length === 0) {
    return { count: 0 };
  }

  const { count, error } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("read", false)
    .neq("sender_id", user.id)
    .in("conversation_id", conversationIds);

  if (error) {
    console.error("Error getting unread count:", error);
    return { count: 0 };
  }

  return { count: count || 0 };
}
