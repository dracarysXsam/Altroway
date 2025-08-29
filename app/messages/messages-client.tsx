"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Clock, Eye, Briefcase, Send, ChevronDown, ChevronUp } from "lucide-react";
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
    };
  }[];
  messages: Message[];
}

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  phone?: string;
}

interface MessagesClientProps {
  initialConversations: Conversation[];
  initialUserMap: Map<string, UserProfile>;
  userRole: string;
  currentUserId: string;
}

export function MessagesClient({ 
  initialConversations, 
  initialUserMap, 
  userRole, 
  currentUserId 
}: MessagesClientProps) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [userMap, setUserMap] = useState<Map<string, UserProfile>>(initialUserMap);
  const [expandedConversation, setExpandedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  const supabase = createClient();

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

  const getLastMessage = (messages: Message[]) => {
    if (!messages || messages.length === 0) return null;
    return messages[messages.length - 1];
  };

  const getUnreadCount = (messages: Message[], currentUserId: string) => {
    if (!messages) return 0;
    return messages.filter(msg => !msg.read && msg.sender_id !== currentUserId).length;
  };

  const sendMessage = async (conversationId: string) => {
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const { data, error } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          content: newMessage.trim(),
          sender_id: currentUserId,
          read: false
        })
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setConversations(prev => prev.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            messages: [...(conv.messages || []), data],
            updated_at: new Date().toISOString()
          };
        }
        return conv;
      }));

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const toggleConversation = (conversationId: string) => {
    setExpandedConversation(expandedConversation === conversationId ? null : conversationId);
  };

  return (
    <div className="space-y-4">
      {conversations.map((conversation) => {
        const lastMessage = getLastMessage(conversation.messages);
        const unreadCount = getUnreadCount(conversation.messages, currentUserId);
        const application = conversation.job_applications?.[0]; // Get first item from array
        const job = application?.jobs;
        
        // Get participant information
        const applicant = userMap.get(application?.applicant_id);
        const employer = userMap.get(job?.employer_id);
        const lastSender = lastMessage ? userMap.get(lastMessage.sender_id) : null;

        // Determine the other participant's name for display
        const otherParticipant = currentUserId === application?.applicant_id 
          ? employer 
          : applicant;

        const isExpanded = expandedConversation === conversation.id;

        return (
          <Card key={conversation.id} className="overflow-hidden">
            {/* Conversation Header */}
            <CardContent className="p-4 cursor-pointer hover:bg-gray-50" onClick={() => toggleConversation(conversation.id)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {job?.title} at {job?.company}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {application?.status}
                      </Badge>
                      {unreadCount > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {unreadCount} new
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {otherParticipant?.full_name || 'Unknown User'}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  )}
                </div>
              </div>

              {lastMessage && (
                <div className="mt-3 text-sm text-gray-600">
                  <span className="font-medium">
                    {lastSender?.id === currentUserId ? 'You' : lastSender?.full_name || 'Unknown'}: 
                  </span>
                  <span className="truncate">{lastMessage.content}</span>
                  <span className="text-xs text-gray-400 ml-2">
                    {formatDate(lastMessage.created_at)}
                  </span>
                </div>
              )}
            </CardContent>

            {/* Expandable Chat Area */}
            {isExpanded && (
              <div className="border-t bg-gray-50">
                <div className="p-4">
                  {/* Messages Display */}
                  <div className="max-h-64 overflow-y-auto mb-4 space-y-3">
                    {conversation.messages?.map((message) => {
                      const sender = userMap.get(message.sender_id);
                      const isOwnMessage = message.sender_id === currentUserId;
                      
                      return (
                        <div key={message.id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs px-3 py-2 rounded-lg ${
                            isOwnMessage 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-white border text-gray-900'
                          }`}>
                            <div className="text-xs opacity-75 mb-1">
                              {sender?.full_name || 'Unknown User'}
                            </div>
                            <div className="text-sm">{message.content}</div>
                            <div className="text-xs opacity-75 mt-1">
                              {formatDate(message.created_at)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Message Input */}
                  <div className="flex gap-2">
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 min-h-[60px] resize-none"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage(conversation.id);
                        }
                      }}
                    />
                    <Button 
                      onClick={() => sendMessage(conversation.id)}
                      disabled={!newMessage.trim() || sending}
                      className="px-4"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <Link href={`/profile/${otherParticipant?.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Profile
                      </Button>
                    </Link>
                    <Link href={`/jobs/${job?.id}`}>
                      <Button variant="outline" size="sm">
                        <Briefcase className="h-4 w-4 mr-2" />
                        View Job
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
