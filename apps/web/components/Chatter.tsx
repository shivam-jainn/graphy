"use client";

import { useChat } from '@ai-sdk/react';
import { ChatInput } from './ChatInput';
import { MessageBubble } from './MessageBubble';

export default function Chatter() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        id: '1',
        role: 'assistant',
        content: "Hey, I am Graphy! What can I do for you?"
      }
    ]
  });

  return (
    <div className="flex flex-col h-screen w-full">
      <div className="flex-1 overflow-y-auto h-screen space-y-4 p-4 pb-20">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={{
              content: message.content
            }}
            isSender={message.role === 'user'}
          />
        ))}
      </div>
      
      <div className="w-full p-4 bg-transparent">
        <ChatInput 
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
