"use client";

import { useChat } from './chat-context';
import { ChatInput } from './ChatInput';
import { MessageBubble } from './MessageBubble';

export default function Chatter() {
  const { messages } = useChat();

  return (
    <div className="flex flex-col h-screen w-full relative">
      
      {/* Input fixed at the bottom */}
      <div className="absolute left-0 bottom-0 w-full p-4 bg-transparent">
        <ChatInput />
      </div>

      {/* Messages take the full available space above input */}
      <div className="flex-1 overflow-y-auto h-screen space-y-4 p-4 pb-20">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={{
              content: message.content,
              type: message.type
            }}
            isSender={message.sender === 'user'}
          />
        ))}
      </div>
      
    </div>
  );
}
