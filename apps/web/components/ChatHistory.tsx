"use client";

import { useEffect, useState } from "react";
import { selectedBoardAtom } from '@/lib/atoms/board-atom';
import { useAtom } from 'jotai';

export default function ChatHistory() {
  const [selectedBoard] = useAtom(selectedBoardAtom);
  const [chatSessions, setChatSessions] = useState<any[]>([]);

  useEffect(() => {
    if (selectedBoard) {
      fetch(`/api/chats?boardId=${selectedBoard}`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch chats');
          return res.json();
        })
        .then(({ chats }) => setChatSessions(chats || [])) // Ensure array fallback
        .catch(error => {
          console.error('Fetch error:', error);
          setChatSessions([]);
        });
    }
  }, [selectedBoard]);

  return (
    <div className=" overflow-y-auto border rounded-lg p-4">
      {chatSessions?.map((session) => (
        <div key={session.id} className="mb-4 cursor-pointer">
          <div className="font-bold">{session.title}</div>
          <div className="text-sm text-gray-500">{session.createdAt}</div>
        </div>
      ))}
    </div>
  );
}