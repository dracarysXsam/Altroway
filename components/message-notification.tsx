"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";

export function MessageNotification() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    // Get initial unread count
    const fetchUnreadCount = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

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
          setUnreadCount(0);
          return;
        }

        const { count } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("read", false)
          .neq("sender_id", user.id)
          .in("conversation_id", conversationIds);

        setUnreadCount(count || 0);
      } catch (error) {
        console.error("Error fetching unread count:", error);
      }
    };

    fetchUnreadCount();

    // Set up real-time subscription for new messages
    const channel = supabase
      .channel('message_notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        async (payload) => {
          const newMessage = payload.new as any;
          
          // Check if this message is for a conversation the current user is part of
          const { data: { user } } = await supabase.auth.getUser();
          if (!user || newMessage.sender_id === user.id) return;

          // Get conversation details
          const { data: conversation } = await supabase
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
            .eq("id", newMessage.conversation_id)
            .single();

          if (!conversation) return;

          // Check if current user is part of this conversation
          const application = conversation.job_applications;
          const isPartOfConversation = user.id === application.applicant_id || 
                                      user.id === application.jobs.employer_id;

          if (isPartOfConversation) {
            // Increment unread count
            setUnreadCount(prev => prev + 1);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: 'read=eq.true'
        },
        async (payload) => {
          const updatedMessage = payload.new as any;
          
          // Check if this message is for a conversation the current user is part of
          const { data: { user } } = await supabase.auth.getUser();
          if (!user || updatedMessage.sender_id === user.id) return;

          // Get conversation details
          const { data: conversation } = await supabase
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
            .eq("id", updatedMessage.conversation_id)
            .single();

          if (!conversation) return;

          // Check if current user is part of this conversation
          const application = conversation.job_applications;
          const isPartOfConversation = user.id === application.applicant_id || 
                                      user.id === application.jobs.employer_id;

          if (isPartOfConversation) {
            // Decrement unread count
            setUnreadCount(prev => Math.max(0, prev - 1));
          }
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  if (unreadCount === 0) {
    return null;
  }

  return (
    <div className="relative">
      <Bell className="h-5 w-5" />
      <Badge 
        variant="destructive" 
        className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
      >
        {unreadCount > 99 ? '99+' : unreadCount}
      </Badge>
    </div>
  );
}
