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
    .eq("id", id)
    .single();

  if (!conversation) {
    redirect("/messages");
  }

  return <ConversationClient conversation={conversation} currentUserId={user.id} />;
}
