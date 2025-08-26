"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Send, Clock } from "lucide-react";
import Link from "next/link";
import { sendMessage, markMessagesAsRead } from "@/app/actions/messaging-actions";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  read: boolean;
  profiles: {
    full_name: string;
    avatar_url: string;
  };
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
    jobs: {
      id: string;
      title: string;
      company: string;
      employer_id: string;
    };
    profiles: {
      full_name: string;
      avatar_url: string;
    };
  };
  messages: Message[];
}

interface ConversationClientProps {
  conversation: Conversation;
  currentUserId: string;
}

export function ConversationClient({ conversation, currentUserId }: ConversationClientProps) {
  const [messages, setMessages] = useState<Message[]>(conversation.messages || []);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    // Mark messages as read when component mounts
    markMessagesAsRead(conversation.id);
  }, [conversation.id, messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    const result = await sendMessage(conversation.id, newMessage.trim());
    
    if (result.success) {
      setNewMessage("");
      // Optimistically add the message to the UI
      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        content: newMessage.trim(),
        sender_id: currentUserId,
        created_at: new Date().toISOString(),
        read: false,
        profiles: {
          full_name: "You",
          avatar_url: ""
        }
      };
      setMessages(prev => [...prev, optimisticMessage]);
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

  const application = conversation.job_applications;
  const job = application?.jobs;
  const applicant = application?.profiles;

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
              <div>
                <CardTitle className="text-xl">
                  {job?.title} at {job?.company}
                </CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={applicant?.avatar_url} />
                    <AvatarFallback>
                      {applicant?.full_name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">
                    {applicant?.full_name}
                  </span>
                  <Badge variant={application?.status === 'pending' ? 'secondary' : 'default'}>
                    {application?.status}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

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
                          <AvatarImage src={message.profiles?.avatar_url} />
                          <AvatarFallback>
                            {message.profiles?.full_name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-first' : ''}`}>
                        <div className={`rounded-lg px-3 py-2 ${
                          isOwnMessage 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <div className={`flex items-center gap-1 mt-1 text-xs text-muted-foreground ${
                          isOwnMessage ? 'justify-end' : 'justify-start'
                        }`}>
                          <Clock className="h-3 w-3" />
                          {formatTime(message.created_at)}
                        </div>
                      </div>
                      
                      {isOwnMessage && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={message.profiles?.avatar_url} />
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
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
