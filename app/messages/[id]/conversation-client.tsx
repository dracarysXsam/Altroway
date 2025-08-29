"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Send, Clock, Loader2, Check, CheckCheck, User, Eye, Phone, MapPin, Calendar, Briefcase, ExternalLink } from "lucide-react";
import Link from "next/link";
import { sendMessage, markMessagesAsRead } from "@/app/actions/messaging-actions";
import { createClient } from "@/lib/supabase/client";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  read: boolean;
  sender: {
    id: string;
    full_name: string;
    email: string;
    role: string;
    avatar_url?: string;
    bio?: string;
    location?: string;
    phone?: string;
  };
  status?: 'sending' | 'sent' | 'delivered' | 'read';
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
  };
  messages: Message[];
  applicant: {
    id: string;
    full_name: string;
    email: string;
    role: string;
    avatar_url?: string;
    bio?: string;
    location?: string;
    phone?: string;
  };
  employer: {
    id: string;
    full_name: string;
    email: string;
    role: string;
    avatar_url?: string;
    bio?: string;
    location?: string;
    phone?: string;
  };
}

interface ConversationClientProps {
  conversation: Conversation;
  currentUserId: string;
}

export function ConversationClient({ conversation, currentUserId }: ConversationClientProps) {
  const [messages, setMessages] = useState<Message[]>(conversation.messages || []);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showParticipantInfo, setShowParticipantInfo] = useState(false);
  const [lastMessageId, setLastMessageId] = useState<string | null>(
    conversation.messages?.length ? conversation.messages[conversation.messages.length - 1].id : null
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabaseRef = useRef(createClient());
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Check if current user is authorized to participate in this conversation
  const isAuthorized = useCallback(() => {
    const application = conversation.job_applications;
    return currentUserId === application.applicant_id || 
           currentUserId === application.jobs.employer_id;
  }, [conversation, currentUserId]);

  // Get the other participant (not current user)
  const getOtherParticipant = useCallback(() => {
    const application = conversation.job_applications;
    return currentUserId === application.applicant_id 
      ? conversation.employer 
      : conversation.applicant;
  }, [conversation, currentUserId]);

  // Get current user's role in this conversation
  const getCurrentUserRole = useCallback(() => {
    const application = conversation.job_applications;
    return currentUserId === application.applicant_id ? 'applicant' : 'employer';
  }, [conversation, currentUserId]);

  // Fetch new messages with enhanced user data
  const fetchNewMessages = useCallback(async () => {
    if (!lastMessageId) return;

    try {
      const { data: newMessages, error } = await supabaseRef.current
        .from("messages")
        .select(`
          id,
          content,
          sender_id,
          created_at,
          read,
          profiles!messages_sender_id_fkey (
            full_name,
            email,
            role,
            avatar_url,
            bio,
            location,
            phone
          )
        `)
        .eq("conversation_id", conversation.id)
        .gt("id", lastMessageId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching new messages:", error);
        return;
      }

      if (newMessages && newMessages.length > 0) {
        const formattedMessages: Message[] = newMessages.map(msg => ({
          ...msg,
          sender: {
            id: msg.sender_id,
            full_name: msg.profiles?.full_name || msg.profiles?.email?.split('@')[0] || 'Unknown User',
            email: msg.profiles?.email || '',
            role: msg.profiles?.role || 'user',
            avatar_url: msg.profiles?.avatar_url,
            bio: msg.profiles?.bio,
            location: msg.profiles?.location,
            phone: msg.profiles?.phone
          }
        }));

        setMessages(prev => [...prev, ...formattedMessages]);
        setLastMessageId(newMessages[newMessages.length - 1].id);
        
        // Mark messages as read if they're from other users
        const unreadMessages = formattedMessages.filter(msg => 
          msg.sender_id !== currentUserId && !msg.read
        );
        if (unreadMessages.length > 0) {
          markMessagesAsRead(conversation.id);
        }
      }
    } catch (error) {
      console.error("Error in fetchNewMessages:", error);
    }
  }, [conversation.id, lastMessageId, currentUserId]);

  // Set up polling for new messages
  useEffect(() => {
    if (!isAuthorized()) return;

    // Initial fetch
    fetchNewMessages();

    // Set up polling every 3 seconds
    pollingIntervalRef.current = setInterval(fetchNewMessages, 3000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [fetchNewMessages, isAuthorized]);

  // Set up real-time subscription for immediate updates
  useEffect(() => {
    if (!isAuthorized()) return;

    const channel = supabaseRef.current
      .channel(`conversation:${conversation.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversation.id}`
        },
        async (payload) => {
          const newMessage = payload.new as any;
          // Only add if it's not from the current user (to avoid duplicates)
          if (newMessage.sender_id !== currentUserId) {
            // Fetch the complete message with user info
            const { data: messageData, error } = await supabaseRef.current
              .from("messages")
              .select(`
                id,
                content,
                sender_id,
                created_at,
                read,
                profiles!messages_sender_id_fkey (
                  full_name,
                  email,
                  role,
                  avatar_url,
                  bio,
                  location,
                  phone
                )
              `)
              .eq("id", newMessage.id)
              .single();

            if (messageData && !error) {
              const messageWithSender: Message = {
                ...messageData,
                sender: {
                  id: messageData.sender_id,
                  full_name: messageData.profiles?.full_name || messageData.profiles?.email?.split('@')[0] || 'Unknown User',
                  email: messageData.profiles?.email || '',
                  role: messageData.profiles?.role || 'user',
                  avatar_url: messageData.profiles?.avatar_url,
                  bio: messageData.profiles?.bio,
                  location: messageData.profiles?.location,
                  phone: messageData.profiles?.phone
                }
              };
              
              setMessages(prev => [...prev, messageWithSender]);
              setLastMessageId(messageData.id);
              
              // Mark as read immediately
              markMessagesAsRead(conversation.id);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabaseRef.current.removeChannel(channel);
    };
  }, [conversation.id, currentUserId, isAuthorized]);

  useEffect(() => {
    scrollToBottom();
    // Mark messages as read when component mounts
    if (isAuthorized()) {
      markMessagesAsRead(conversation.id);
    }
  }, [conversation.id, messages, scrollToBottom, isAuthorized]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending || !isAuthorized()) return;

    setIsSending(true);
    const messageContent = newMessage.trim();
    
    // Optimistically add the message to the UI
    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      content: messageContent,
      sender_id: currentUserId,
      created_at: new Date().toISOString(),
      read: false,
      status: 'sending',
      sender: {
        id: currentUserId,
        full_name: "You",
        email: "",
        role: "user"
      }
    };
    
    setMessages(prev => [...prev, optimisticMessage]);
    setNewMessage("");

    const result = await sendMessage(conversation.id, messageContent);
    
    if (result.success && result.data) {
      // Update the optimistic message with the real message data
      setMessages(prev => prev.map(msg => 
        msg.id === optimisticMessage.id 
          ? {
              ...result.data,
              status: 'sent',
              sender: {
                id: currentUserId,
                full_name: "You",
                email: "",
                role: "user"
              }
            }
          : msg
      ));
      setLastMessageId(result.data.id);
    } else {
      // If failed, remove the optimistic message and show error
      setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
      alert("Failed to send message. Please try again.");
    }
    
    setIsSending(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return "Today";
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  const getMessageStatusIcon = (message: Message) => {
    if (message.id.startsWith('temp-')) {
      return <Loader2 className="h-3 w-3 animate-spin" />;
    }
    
    if (message.sender_id === currentUserId) {
      if (message.read) {
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      } else {
        return <Check className="h-3 w-3 text-gray-400" />;
      }
    }
    
    return null;
  };

  const application = conversation.job_applications;
  const job = application?.jobs;
  const otherParticipant = getOtherParticipant();
  const currentUserRole = getCurrentUserRole();

  // Check authorization
  if (!isAuthorized()) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
            <p className="text-muted-foreground text-center mb-4">
              You are not authorized to view this conversation.
            </p>
            <Link href="/messages">
              <Button>Back to Messages</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <Link href="/messages" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Messages
        </Link>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl">
                  {job?.title} at {job?.company}
                </CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={otherParticipant?.avatar_url} />
                    <AvatarFallback>
                      {otherParticipant?.full_name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">
                    {conversation.applicant?.full_name} → {conversation.employer?.full_name}
                  </span>
                  <Badge variant={application?.status === 'pending' ? 'secondary' : 'default'}>
                    {application?.status}
                  </Badge>
                </div>
              </div>
              
              {/* Participant Info Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowParticipantInfo(!showParticipantInfo)}
                className="flex items-center gap-1"
              >
                <User className="h-4 w-4" />
                {showParticipantInfo ? 'Hide' : 'Show'} Profile
              </Button>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Quick Action Links */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            {/* Job Offer Link */}
            <Link href={`/jobs/${job?.id}`}>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                View Job Offer
                <ExternalLink className="h-3 w-3" />
              </Button>
            </Link>

            {/* Application Details Link */}
            <Link href={`/dashboard?tab=applications&application=${application?.id}`}>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                View Application
                <ExternalLink className="h-3 w-3" />
              </Button>
            </Link>

            {/* Participant Profile Link */}
            {otherParticipant?.id && otherParticipant.id !== 'undefined' ? (
              <Link href={`/profile/${otherParticipant.id}`}>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  View {currentUserRole === 'applicant' ? 'Employer' : 'Applicant'} Profile
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </Link>
            ) : (
              <Button variant="outline" size="sm" disabled className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                Profile Unavailable
              </Button>
            )}

            {/* Current User's Own Profile */}
            <Link href="/profile">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <User className="h-4 w-4" />
                My Profile
                <ExternalLink className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Participant Information Panel */}
      {showParticipantInfo && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={otherParticipant?.avatar_url} />
                <AvatarFallback className="text-lg">
                  {otherParticipant?.full_name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{otherParticipant?.full_name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{otherParticipant?.email}</p>
                
                {otherParticipant?.bio && (
                  <p className="text-sm mb-3">{otherParticipant.bio}</p>
                )}
                
                <div className="flex flex-wrap gap-4 text-sm">
                  {otherParticipant?.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{otherParticipant.location}</span>
                    </div>
                  )}
                  
                  {otherParticipant?.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <span>{otherParticipant.phone}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Member since {new Date(otherParticipant?.created_at || '').toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="mt-3 flex gap-2">
                  <Link href={`/profile/${otherParticipant?.id}`}>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      View Full Profile
                    </Button>
                  </Link>
                  
                  {currentUserRole === 'employer' && (
                    <Link href={`/jobs/${job?.id}`}>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3" />
                        View Job Details
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Messages */}
      <Card className="mb-4">
        <CardContent className="p-0">
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((message, index) => {
                const isOwnMessage = message.sender_id === currentUserId;
                const showDate = index === 0 || 
                  formatDate(message.created_at) !== formatDate(messages[index - 1]?.created_at);
                const isOptimistic = message.id.startsWith('temp-');

                return (
                  <div key={message.id}>
                    {showDate && (
                      <div className="text-center text-xs text-muted-foreground my-4">
                        {formatDate(message.created_at)}
                      </div>
                    )}
                    
                    <div className={`flex gap-3 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                      {!isOwnMessage && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={message.sender?.avatar_url} />
                          <AvatarFallback>
                            {message.sender?.full_name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-first' : ''}`}>
                        <div className={`rounded-lg px-3 py-2 ${
                          isOwnMessage 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        } ${isOptimistic ? 'opacity-70' : ''}`}>
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <div className={`flex items-center gap-1 mt-1 text-xs text-muted-foreground ${
                          isOwnMessage ? 'justify-end' : 'justify-start'
                        }`}>
                          <Clock className="h-3 w-3" />
                          {formatTime(message.created_at)}
                          {isOwnMessage && getMessageStatusIcon(message)}
                        </div>
                      </div>
                      
                      {isOwnMessage && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={message.sender?.avatar_url} />
                          <AvatarFallback>You</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>

      {/* Message Input */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="min-h-[60px] resize-none"
              disabled={isSending}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!newMessage.trim() || isSending}
              className="px-4"
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
