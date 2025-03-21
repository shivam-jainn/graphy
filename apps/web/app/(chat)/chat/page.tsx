"use client";
import React, { useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Chatter from '@/components/Chatter';
import { selectedBoardAtom, selectedChatAtom } from '@/lib/atoms/board-atom';
import { useAtom } from 'jotai';

export default function ChatPage() {
  const [selectedBoard] = useAtom(selectedBoardAtom);
  const [selectedChat, setSelectedChat] = useAtom(selectedChatAtom);

  useEffect(() => {
    const createNewChat = async () => {
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ boardId: selectedBoard })
      });
      const newChat = await response.json();
      setSelectedChat(newChat.id);
    };

    if (selectedBoard && !selectedChat) {
      createNewChat();
    }
  }, [selectedBoard, selectedChat, setSelectedChat]);

  return (
    <div className='flex h-full w-full'>
      <Sidebar />
      <Chatter />
    </div>
  );
}
