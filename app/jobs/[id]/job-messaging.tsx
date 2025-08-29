"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, User } from "lucide-react";

interface JobMessagingProps {
  jobId: string;
  employerId: string;
}

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  read: boolean;
}

export function JobMessaging({ jobId, employerId }: JobMessagingProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);

  useEffect(() => {
    initializeMessaging();
  }, [jobId]);

  const initializeMessaging = async () => {
    const supabase = createClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    setCurrentUser(user);

    // Check if conversation exists for this job and user
    const { data: existingConversation } = await supabase
      .from("conversations")
      .select("id")
      .eq("job_application_id", jobId)
      .eq("participant_ids", [user.id, employerId])
      .single();

    if (existingConversation) {
      setConversationId(existingConversation.id);
      loadMessages(existingConversation.id);
    }
  };

  const loadMessages = async (convId: string) => {
    const supabase = createClient();
    
    const { data: messagesData } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", convId)
      .order("created_at", { ascending: true });

    if (messagesData) {
      setMessages(messagesData);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUser) return;

    setLoading(true);
    const supabase = createClient();

    try {
      let convId = conversationId;

      // Create conversation if it doesn't exist
      if (!convId) {
        const { data: newConversation } = await supabase
          .from("conversations")
          .insert({
            job_application_id: jobId,
            participant_ids: [currentUser.id, employerId]
          })
          .select("id")
          .single();

        if (newConversation) {
          convId = newConversation.id;
          setConversationId(convId);
        }
      }

      if (convId) {
        // Send message
        const { data: message } = await supabase
          .from("messages")
          .insert({
            conversation_id: convId,
            sender_id: currentUser.id,
            content: newMessage.trim(),
            read: false
          })
          .select()
          .single();

        if (message) {
          setMessages(prev => [...prev, message]);
          setNewMessage("");
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!currentUser) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Job Messaging
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Please log in to send messages to the employer.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Message Employer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Messages Display */}
        <div className="max-h-64 overflow-y-auto space-y-3 border rounded-lg p-3">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No messages yet. Start the conversation!
            </p>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender_id === currentUser.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg ${
                    message.sender_id === currentUser.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender_id === currentUser.id ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {formatTime(message.created_at)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Input */}
        <div className="flex gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message to the employer..."
            className="flex-1"
            rows={2}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim() || loading}
            className="self-end"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-xs text-gray-500">
          You can ask questions about the job, discuss requirements, or schedule interviews.
        </p>
      </CardContent>
    </Card>
  );
}
