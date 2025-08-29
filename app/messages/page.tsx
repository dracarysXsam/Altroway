import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Clock, User, Eye, Briefcase, ExternalLink } from "lucide-react";
import Link from "next/link";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  read: boolean;
}

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
    }[];
  }[];
  messages: Message[];
}

export default async function MessagesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user's role to filter conversations appropriately
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  const userRole = profile?.role || "job_seeker";

  let conversations: any[] = [];

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
          .in("job_application_id", applicationIds)
          .order("updated_at", { ascending: false });

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
      
      const { data: jobSeekerConversations } = await supabase
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
        .in("job_application_id", applicationIds)
        .order("updated_at", { ascending: false });

      conversations = jobSeekerConversations || [];
    }
  } else {
    // Super admins can see all conversations
    const { data: allConversations } = await supabase
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
      .order("updated_at", { ascending: false });

    conversations = allConversations || [];
  }

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

  // Get user information for all participants
  const allUserIds = new Set<string>();
  conversations?.forEach(conversation => {
    if (conversation.job_applications?.applicant_id) {
      allUserIds.add(conversation.job_applications.applicant_id);
    }
    if (conversation.job_applications?.jobs?.employer_id) {
      allUserIds.add(conversation.job_applications.jobs.employer_id);
    }
    conversation.messages?.forEach((message: any) => {
      allUserIds.add(message.sender_id);
    });
  });

  // Get user details with enhanced profile information
  const { data: users } = await supabase.auth.admin.listUsers();
  const userMap = new Map();
  users?.users.forEach(u => {
    userMap.set(u.id, {
      id: u.id,
      email: u.email,
      full_name: u.user_metadata?.full_name || u.email?.split('@')[0] || 'Unknown User',
      role: u.user_metadata?.role || 'user',
      avatar_url: u.user_metadata?.avatar_url,
      created_at: u.created_at
    });
  });

  // Get additional profile information
  const userIdsArray = Array.from(allUserIds);
  const { data: profiles } = await supabase
    .from("profiles")
    .select("user_id, full_name, avatar_url, bio, location, phone")
    .in("user_id", userIdsArray);

  // Merge profile data with user data
  profiles?.forEach(profile => {
    const userData = userMap.get(profile.user_id);
    if (userData) {
      userMap.set(profile.user_id, {
        ...userData,
        full_name: profile.full_name || userData.full_name,
        avatar_url: profile.avatar_url || userData.avatar_url,
        bio: profile.bio,
        location: profile.location,
        phone: profile.phone
      });
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground">
          {userRole === "employer" 
            ? "Communicate with job applicants" 
            : userRole === "job_seeker"
            ? "Communicate with employers about your applications"
            : "Manage all conversations"
          }
        </p>
      </div>

      {!conversations || conversations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              {userRole === "employer" 
                ? "Start conversations when applicants apply to your jobs."
                : userRole === "job_seeker"
                ? "Start conversations by applying to jobs or when employers reach out to you."
                : "No conversations are currently active."
              }
            </p>
            {userRole === "job_seeker" && (
              <Link href="/jobs">
                <Button>Browse Jobs</Button>
              </Link>
            )}
            {userRole === "employer" && (
              <Link href="/dashboard">
                <Button>View Dashboard</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {conversations.map((conversation) => {
            const lastMessage = getLastMessage(conversation.messages);
            const unreadCount = getUnreadCount(conversation.messages, user.id);
            const application = conversation.job_applications;
            const job = application?.jobs;
            
            // Get participant information
            const applicant = userMap.get(application?.applicant_id);
            const employer = userMap.get(job?.employer_id);
            const lastSender = lastMessage ? userMap.get(lastMessage.sender_id) : null;

            // Determine the other participant's name for display
            const otherParticipant = user.id === application?.applicant_id 
              ? employer 
              : applicant;

            return (
              <Card key={conversation.id} className="hover:shadow-md transition-shadow">
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
                        <span>
                          {userRole === "employer" 
                            ? `Chat with ${applicant?.full_name}`
                            : userRole === "job_seeker"
                            ? `Chat with ${employer?.full_name}`
                            : `${applicant?.full_name} → ${employer?.full_name}`
                          }
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{job?.title}</span>
                      </div>

                      {lastMessage && (
                        <div className="flex items-center gap-2 mb-3">
                          <p className="text-sm text-muted-foreground flex-1 truncate">
                            <span className="font-medium">
                              {lastSender?.id === user.id ? 'You' : lastSender?.full_name || 'Unknown'}: 
                            </span>
                            {lastMessage.content}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatDate(lastMessage.created_at)}
                          </div>
                        </div>
                      )}

                      {/* Enhanced participant information */}
                      <div className="flex items-center gap-4 pt-3 border-t">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            {otherParticipant?.avatar_url ? (
                              <img 
                                src={otherParticipant.avatar_url} 
                                alt={otherParticipant.full_name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-sm font-medium">
                                {otherParticipant?.full_name?.charAt(0) || "U"}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{otherParticipant?.full_name}</p>
                            <p className="text-xs text-muted-foreground">{otherParticipant?.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 ml-auto">
                          <Link href={`/profile/${otherParticipant?.id}`}>
                            <Button variant="outline" size="sm" className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              View Profile
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </Link>
                          
                          <Link href={`/jobs/${job?.id}`}>
                            <Button variant="outline" size="sm" className="flex items-center gap-1">
                              <Briefcase className="h-3 w-3" />
                              View Job
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </Link>
                          
                          <Link href={`/messages/${conversation.id}`}>
                            <Button size="sm">
                              Open Chat
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
