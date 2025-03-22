"use client";

import { useState, useEffect } from "react";
import io from "socket.io-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Search } from "lucide-react";

const socket = io("http://localhost:8000");

interface Message {
  id?: number;
  content: string;
  sender: string;
  timestamp: string;
}

interface User {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  online: boolean;
}

const users: User[] = [
  {
    id: "user1",
    name: "Sarah Wilson",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    lastMessage: "See you tomorrow!",
    online: true,
  },
  {
    id: "user2",
    name: "Michael Chen",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
    lastMessage: "Thanks for your help",
    online: true,
  },
  {
    id: "user3",
    name: "Emma Thompson",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    lastMessage: "Great idea!",
    online: false,
  },
];

export default function Chat() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const currentUser = "me"; // Replace with actual authenticated user ID

  // Fetch messages from the backend when a user is selected
  useEffect(() => {
    if (!selectedUser) return;

    fetch(`http://localhost:8000/${currentUser}/${selectedUser.id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setMessages(data); // Set messages when chat is loaded
      })
      .catch((err) => console.error("Error fetching messages:", err));
  }, [selectedUser]);

  // Listen for real-time messages
  useEffect(() => {
    socket.on("receiveMessage", (message: Message) => {
      // Only update messages if it is for the currently selected chat
      if (
        message.sender === selectedUser?.id ||
        message.sender === currentUser
      ) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [selectedUser]);

  const sendMessage = () => {
    if (newMessage.trim() && selectedUser) {
      const message: Message = {
        content: newMessage,
        sender: currentUser,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      // Emit message to server
      socket.emit("sendMessage", {
        sender: currentUser,
        receiver: selectedUser.id,
        content: newMessage,
      });

      setMessages((prev) => [...prev, message]); // Update messages locally
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
                selectedUser?.id === user.id ? "bg-accent" : ""
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
                <p className="font-medium truncate">{user.name}</p>
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
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                  />
                  <AvatarFallback>{selectedUser.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">{selectedUser.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedUser.online ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.sender === currentUser
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] ${
                        message.sender === currentUser
                          ? "bg-primary text-primary-foreground"
                          : "bg-accent"
                      } rounded-lg p-3`}
                    >
                      <p>{message.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t flex gap-2">
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
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-gray-500">Select a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
