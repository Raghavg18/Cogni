"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Search, MoreVertical, Phone, Video } from "lucide-react";

interface Message {
  id: number;
  content: string;
  sender: string;
  timestamp: string;
}

interface User {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  online: boolean;
}

const users: User[] = [
  {
    id: 1,
    name: "Sarah Wilson",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    lastMessage: "See you tomorrow!",
    online: true,
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
    lastMessage: "Thanks for your help",
    online: true,
  },
  {
    id: 3,
    name: "Emma Thompson",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    lastMessage: "Great idea!",
    online: false,
  },
  {
    id: 4,
    name: "James Rodriguez",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    lastMessage: "Let's meet next week",
    online: true,
  },
];

const initialMessages: Message[] = [
  {
    id: 1,
    content: "Hi there! How are you?",
    sender: "Sarah Wilson",
    timestamp: "09:30 AM",
  },
  {
    id: 2,
    content: "I'm doing great, thanks! How about you?",
    sender: "me",
    timestamp: "09:31 AM",
  },
  {
    id: 3,
    content: "Pretty good! Just working on some new projects.",
    sender: "Sarah Wilson",
    timestamp: "09:32 AM",
  },
];

export default function Home() {
  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          content: newMessage,
          sender: "me",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
      setNewMessage("");
    }
  };

  return (
    <div className="flex bg-background">
      {/* Left Panel - User List */}
      <div className="w-80 border-r">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search conversations..." className="pl-8" />
          </div>
        </div>
        <ScrollArea className="h-[84vh]">
          {users.map((user) => (
            <div
              key={user.id}
              className={`p-4 cursor-pointer hover:bg-accent flex items-center gap-3 ${
                selectedUser.id === user.id ? "bg-accent" : ""
              }`}
              onClick={() => setSelectedUser(user)}
            >
              <div className="relative">
                <Avatar>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                {user.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="font-medium truncate">{user.name}</p>
                  <span className="text-xs text-muted-foreground">
                    12:30 PM
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {user.lastMessage}
                </p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Right Panel - Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
              <AvatarFallback>{selectedUser.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold">{selectedUser.name}</h2>
              <p className="text-sm text-muted-foreground">
                {selectedUser.online ? "Online" : "Offline"}
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" size="icon">
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "me" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] ${
                    message.sender === "me"
                      ? "bg-primary text-primary-foreground"
                      : "bg-accent"
                  } rounded-lg p-3`}
                >
                  <p>{message.content}</p>
                  <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button onClick={sendMessage}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
