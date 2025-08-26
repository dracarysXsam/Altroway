import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Clock, User } from "lucide-react";
import Link from "next/link";

export default async function MessagesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get conversations
  const { data: conversations } = await supabase
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString();
    }
  };

  const getLastMessage = (messages: any[]) => {
    if (!messages || messages.length === 0) return null;
    return messages[messages.length - 1];
  };

  const getUnreadCount = (messages: any[], currentUserId: string) => {
    if (!messages) return 0;
    return messages.filter(msg => !msg.read && msg.sender_id !== currentUserId).length;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground">Communicate with applicants and employers</p>
      </div>

      {!conversations || conversations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Start a conversation by applying to a job or when an employer reaches out to you.
            </p>
            <Link href="/jobs">
              <Button>Browse Jobs</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {conversations.map((conversation) => {
            const lastMessage = getLastMessage(conversation.messages);
            const unreadCount = getUnreadCount(conversation.messages, user.id);
            const application = conversation.job_applications;
            const job = application?.jobs;
            const applicant = application?.profiles;

            return (
              <Link key={conversation.id} href={`/messages/${conversation.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">
                            {job?.title} at {job?.company}
                          </h3>
                          <Badge variant={application?.status === 'pending' ? 'secondary' : 'default'}>
                            {application?.status}
                          </Badge>
                          {unreadCount > 0 && (
                            <Badge variant="destructive" className="ml-auto">
                              {unreadCount} new
                            </Badge>
                          )}
                        </div>
                        
                                                 <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                           <User className="h-4 w-4" />
                           <span>{applicant?.full_name || 'Unknown'}</span>
                           <span className="text-xs text-muted-foreground">•</span>
                           <span className="text-xs text-muted-foreground">{job?.title}</span>
                         </div>

                        {lastMessage && (
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-muted-foreground flex-1 truncate">
                              {lastMessage.content}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {formatDate(lastMessage.created_at)}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
