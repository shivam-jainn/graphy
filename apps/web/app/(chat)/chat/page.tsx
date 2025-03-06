"use client";

import React from 'react';
import Sidebar from '@/components/Sidebar';
import Chatter from '@/components/Chatter';
import { useChat } from '@ai-sdk/react';

export default function ChatPage() {
  const chatty = useChat()
  return (
    <div className='flex h-full w-full'>
      <Sidebar />
      <Chatter />
    </div>
  );
}
