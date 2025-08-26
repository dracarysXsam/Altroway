"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getConversations() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Authentication required" };
  }

  const { data: conversations, error } = await supabase
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
    console.error("Error fetching conversations:", error);
    return { error: "Failed to fetch conversations" };
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
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Authentication required" };
  }

  const { error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content,
    });

  if (error) {
    console.error("Error sending message:", error);
    return { error: "Failed to send message" };
  }

  // Update conversation timestamp
  await supabase
    .from("conversations")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", conversationId);

  revalidatePath("/dashboard");
  revalidatePath(`/messages/${conversationId}`);

  return { success: true };
}

export async function createConversation(jobApplicationId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Authentication required" };
  }

  // Check if conversation already exists
  const { data: existingConversation } = await supabase
    .from("conversations")
    .select("id")
    .eq("job_application_id", jobApplicationId)
    .single();

  if (existingConversation) {
    return { conversationId: existingConversation.id };
  }

  const { data: conversation, error } = await supabase
    .from("conversations")
    .insert({
      job_application_id: jobApplicationId,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error creating conversation:", error);
    return { error: "Failed to create conversation" };
  }

  revalidatePath("/dashboard");
  return { conversationId: conversation.id };
}

export async function markMessagesAsRead(conversationId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Authentication required" };
  }

  const { error } = await supabase
    .from("messages")
    .update({ read: true })
    .eq("conversation_id", conversationId)
    .neq("sender_id", user.id);

  if (error) {
    console.error("Error marking messages as read:", error);
    return { error: "Failed to mark messages as read" };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/messages/${conversationId}`);

  return { success: true };
}

export async function getUnreadMessageCount() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { count: 0 };
  }

  const { count, error } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("read", false)
    .neq("sender_id", user.id)
    .in("conversation_id", 
      supabase
        .from("conversations")
        .select("id")
        .in("job_application_id", 
          supabase
            .from("job_applications")
            .select("id")
            .or(`applicant_id.eq.${user.id},jobs.employer_id.eq.${user.id}`)
        )
    );

  if (error) {
    console.error("Error getting unread count:", error);
    return { count: 0 };
  }

  return { count: count || 0 };
}
