"use client";

import React, { createContext, useState, useContext } from 'react';
import type { IMessageBubbleMessage } from './MessageBubble';

interface Message extends IMessageBubbleMessage {
  id: string;
  sender: 'user' | 'bot';
}

interface ChatContextType {
  messages: Message[];
  addMessage: (content: string) => void;  // Changed to accept string content
}

const ChatContext = createContext<ChatContextType>({} as ChatContextType);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([{
    "id": "1",
    "sender": "bot",
    "content": "Hello, how can I help you today?",
    "type": "text"
  }]);

  const addMessage = (content: string) => {  // Updated to handle string content
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content,
      type: 'text'
    };
    setMessages(prev => [...prev, newMessage]);
  };

  return (
    <ChatContext.Provider value={{ messages, addMessage }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);