"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, X, Clock } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  conversation_id: string;
}

interface Conversation {
  id: string;
  job_application_id: string;
  job_applications: {
    jobs: {
      title: string;
      company: string;
    };
    profiles: {
      full_name: string;
    };
  };
}

export function MessageNotification() {
  const [notifications, setNotifications] = useState<Array<{
    message: Message;
    conversation: Conversation;
    isNew: boolean;
  }>>([]);
  const [isVisible, setIsVisible] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    // Check for new messages every 30 seconds
    const interval = setInterval(checkForNewMessages, 30000);
    checkForNewMessages(); // Check immediately on mount

    return () => clearInterval(interval);
  }, []);

  const checkForNewMessages = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get conversations for this user
    const { data: conversations } = await supabase
      .from("conversations")
      .select(`
        id,
        job_application_id,
        job_applications (
          jobs (
            title,
            company
          ),
          profiles (
            full_name
          )
        )
      `)
      .or(`job_applications.applicant_id.eq.${user.id},job_applications.jobs.employer_id.eq.${user.id}`);

    if (!conversations) return;

    // Get recent messages for these conversations
    for (const conversation of conversations) {
      const { data: messages } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversation.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (messages && messages.length > 0) {
        const latestMessage = messages[0];
        
        // Check if this is a new message (not from current user and within last 5 minutes)
        if (latestMessage.sender_id !== user.id) {
          const messageTime = new Date(latestMessage.created_at);
          const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
          
          if (messageTime > fiveMinutesAgo) {
            // Check if we already have this notification
            const exists = notifications.some(n => n.message.id === latestMessage.id);
            if (!exists) {
              setNotifications(prev => [{
                message: latestMessage,
                conversation,
                isNew: true
              }, ...prev.slice(0, 4)]); // Keep only last 5 notifications
              
              setIsVisible(true);
              
              // Auto-hide after 10 seconds
              setTimeout(() => {
                setNotifications(prev => prev.filter(n => n.message.id !== latestMessage.id));
                if (notifications.length === 0) {
                  setIsVisible(false);
                }
              }, 10000);
            }
          }
        }
      }
    }
  };

  const removeNotification = (messageId: string) => {
    setNotifications(prev => prev.filter(n => n.message.id !== messageId));
    if (notifications.length === 0) {
      setIsVisible(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  if (!isVisible || notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map(({ message, conversation, isNew }) => (
        <Card key={message.id} className={`shadow-lg border-l-4 ${isNew ? 'border-l-blue-500' : 'border-l-gray-300'}`}>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-blue-600" />
                <CardTitle className="text-sm">
                  {conversation.job_applications?.jobs?.title} at {conversation.job_applications?.jobs?.company}
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeNotification(message.id)}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
                         <div className="flex items-center gap-2 text-xs text-gray-500">
               <span>From: {conversation.job_applications?.profiles?.full_name || 'Unknown'}</span>
               <div className="flex items-center gap-1">
                 <Clock className="h-3 w-3" />
                 {formatTime(message.created_at)}
               </div>
             </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-gray-700 line-clamp-2 mb-3">
              {message.content}
            </p>
            <div className="flex items-center justify-between">
              <Link href={`/messages/${conversation.id}`}>
                <Button size="sm" variant="outline">
                  View Conversation
                </Button>
              </Link>
              {isNew && (
                <Badge variant="secondary" className="text-xs">
                  New
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
