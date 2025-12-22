'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Send, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getUserDisplayName } from '@/lib/utils/user';

interface Conversation {
  id: string;
  user: {
    name?: string;
    firstName?: string;
    lastName?: string;
    image?: string;
  };
  lastMessage: string;
  timestamp: string;
  unread: number;
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    user: { name: 'John Doe' },
    lastMessage: 'Thanks for connecting! Looking forward to collaborating.',
    timestamp: '2 min ago',
    unread: 2,
  },
  {
    id: '2',
    user: { name: 'Veteran Tech Solutions' },
    lastMessage: 'We have a great opportunity for you...',
    timestamp: '1 hour ago',
    unread: 1,
  },
  {
    id: '3',
    user: { name: 'Veteran Healthcare Services' },
    lastMessage: 'The project proposal looks great!',
    timestamp: '2 hours ago',
    unread: 0,
  },
];

export function MessagesPage() {
  const router = useRouter();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(
    mockConversations[0].id
  );
  const [messageInput, setMessageInput] = useState('');

  const activeConversation = mockConversations.find((c) => c.id === selectedConversation);

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
      <h1 className="mb-6 text-3xl font-bold">Messages</h1>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Conversations List */}
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search messages..." className="pl-9" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {mockConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                  className={`w-full p-4 text-left transition-colors hover:bg-muted ${
                    selectedConversation === conversation.id ? 'bg-muted' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-1 flex items-center justify-between">
                        <p className="font-medium">{getUserDisplayName(conversation.user)}</p>
                        {conversation.unread > 0 && (
                          <Badge variant="default" className="ml-2">
                            {conversation.unread}
                          </Badge>
                        )}
                      </div>
                      <p className="line-clamp-1 text-sm text-muted-foreground">
                        {conversation.lastMessage}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">{conversation.timestamp}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="md:col-span-2">
          {activeConversation ? (
            <>
              <CardHeader className="border-b">
                <CardTitle>{getUserDisplayName(activeConversation.user)}</CardTitle>
              </CardHeader>
              <CardContent className="flex h-[500px] flex-col p-6">
                {/* Messages */}
                <div className="mb-4 flex-1 space-y-4 overflow-y-auto">
                  <div className="flex justify-start">
                    <div className="max-w-[70%] rounded-lg bg-muted p-3">
                      <p className="text-sm">{activeConversation.lastMessage}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {activeConversation.timestamp}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="max-w-[70%] rounded-lg bg-primary p-3 text-primary-foreground">
                      <p className="text-sm">Thank you! I'm excited about this opportunity.</p>
                      <p className="mt-1 text-xs opacity-70">Just now</p>
                    </div>
                  </div>
                </div>

                {/* Message Input */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        setMessageInput('');
                      }
                    }}
                  />
                  <Button size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex h-[500px] items-center justify-center">
              <p className="text-muted-foreground">Select a conversation to start messaging</p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
