"use client";
import React, { useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Chatter from '@/components/Chatter';

export default function ChatPage() {
  return (
    <div className='flex h-full w-full'>
      <Sidebar />
      <Chatter />
    </div>
  );
}
