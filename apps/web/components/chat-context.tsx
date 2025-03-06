"use client";

import React, { createContext, useState, useContext } from 'react';
import type { IMessageBubbleMessage } from './MessageBubble';

interface Message extends IMessageBubbleMessage {
  id: string;
  sender: 'user' | 'bot';
}

interface ChatContextType {
  messages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
}

const ChatContext = createContext<ChatContextType>({} as ChatContextType);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([{
    "id" : "1",
    "sender" : "bot",
    "content" : "Hello, how can I help you today?",
    "type" : "text"
  }
  ]);

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
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