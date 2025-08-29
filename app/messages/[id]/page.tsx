import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ConversationClient } from "./conversation-client";

export default async function ConversationPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get conversation with messages
  const { data: conversation } = await supabase
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
    .eq("id", id)
    .single();

  if (!conversation) {
    redirect("/messages");
  }

  // Get user information for all participants
  const allUserIds = new Set<string>();
  if (conversation.job_applications?.applicant_id) {
    allUserIds.add(conversation.job_applications.applicant_id);
  }
  if (conversation.job_applications?.jobs?.employer_id) {
    allUserIds.add(conversation.job_applications.jobs.employer_id);
  }
  conversation.messages?.forEach(message => {
    allUserIds.add(message.sender_id);
  });

  // Get user details
  const { data: users } = await supabase.auth.admin.listUsers();
  const userMap = new Map();
  users?.users.forEach(u => {
    userMap.set(u.id, {
      email: u.email,
      full_name: u.user_metadata?.full_name || u.email?.split('@')[0] || 'Unknown User',
      role: u.user_metadata?.role || 'user'
    });
  });

  // Add user information to messages
  const messagesWithUsers = conversation.messages?.map(message => ({
    ...message,
    sender: userMap.get(message.sender_id)
  })) || [];

  // Add user information to conversation
  const conversationWithUsers = {
    ...conversation,
    messages: messagesWithUsers,
    applicant: userMap.get(conversation.job_applications?.applicant_id),
    employer: userMap.get(conversation.job_applications?.jobs?.employer_id)
  };

  return <ConversationClient conversation={conversationWithUsers} currentUserId={user.id} />;
}
