"use client";

import { useState } from "react";

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
}

export default function ChatHistory() {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    // Example chat sessions
    { id: "1", title: "Chat with Alice", lastMessage: "See you tomorrow!", timestamp: "Yesterday" },
    { id: "2", title: "Project Discussion", lastMessage: "Let's finalize the design.", timestamp: "2 days ago" },
  ]);

  return (
    <div className="h-64 overflow-y-auto border rounded-lg p-4">
      {chatSessions.map((session) => (
        <div key={session.id} className="mb-4 cursor-pointer">
          <div className="font-bold">{session.title}</div>
          <div className="text-sm text-gray-500">{session.lastMessage}</div>
          <div className="text-xs text-gray-400">{session.timestamp}</div>
        </div>
      ))}
    </div>
  );
}