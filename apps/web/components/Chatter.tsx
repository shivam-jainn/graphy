"use client";

import { useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { ChatInput } from "./ChatInput";
import { MessageBubble } from "./MessageBubble";
import { useAtomValue } from "jotai";
import { selectedBoardAtom, selectedChatAtom } from "@/lib/atoms/board-atom";

export default function Chatter() {
  const selectedChat = useAtomValue(selectedChatAtom);
  const selectedBoard = useAtomValue(selectedBoardAtom);

  console.log("Selected Chat:", selectedChat);
  console.log("Selected Board:", selectedBoard);
  
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        id: "1",
        role: "assistant",
        content: "Hey, I am Graphy! What can I do for you?",
      },
    ],
    body: {
      chatId: selectedChat || 'active-chat-id',
      boardID: selectedBoard || 'active-board-id'
    },
    onResponse: async (response) => {
      // This callback is triggered when a response is received from the API
      console.log("Response received:", response);
      if (response.status === 200) {
        try {
          const responseData = await response.json();
          // If the API response contains messages, update the messages state
          console.log("Response data:", responseData);

          console.log("Final Messages:", [...messages, responseData]);
          setMessages(prevMessages => [...prevMessages, responseData]);
        } catch (error) {
          console.error("Failed to process API response:", error);
        }
      }
    }
  });

  // Debug logs
  useEffect(() => {
    console.log("Current messages:", messages);
  }, [messages]);

  return (
    <div className="flex flex-col h-screen w-full">
      <div className="flex-1 overflow-y-auto h-screen space-y-4 p-4 pb-20">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={{
              content: message.content,
              role: message.role,
            }}
            isSender={message.role === "user"}
          />
        ))}
      </div>

      <div className="w-full p-4 bg-transparent">
        <ChatInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
