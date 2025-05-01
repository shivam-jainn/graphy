import { useEffect, useState } from "react";
import { selectedBoardAtom, selectedChatAtom } from '@/lib/atoms/board-atom';
import { useAtom } from 'jotai';
import { Card, CardHeader, CardTitle, CardContent } from "@workspace/ui/components/card";
import { Plus } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

export default function ChatHistory() {
  const [chatSessions, setChatSessions] = useState<any[]>([]);
  const [selectedBoard, setSelectedBoard] = useAtom(selectedBoardAtom);
  const [selectedChat,setSelectedChat] = useAtom(selectedChatAtom);
  
  console.log(selectedBoard)
  useEffect(() => {
    if (selectedBoard) {
      fetch(`/api/chats?boardId=${selectedBoard}`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch chats');
          return res.json();
        })
        .then(({ chats }) => setChatSessions(chats || []))
        .catch(error => {
          console.error('Fetch error:', error);
          setChatSessions([]);
        });
    }
  }, [selectedBoard]);

  const handleNewChat = async () => {
    try {
      console.log(selectedBoard)
      const res = await fetch('/api/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          boardId: selectedBoard,
        }),
      });
      
      if (!res.ok) throw new Error('Failed to create new chat');
      const newChat = await res.json();
      console.log(newChat)
      setChatSessions(prev => [newChat, ...prev]);
      setSelectedChat(newChat.id);
      
    } catch (error) {
      console.error('New chat error:', error);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className=" border-b flex items-center justify-between">
        <p className="text-lg font-medium w-fit">Chat History</p>

        <Button 
          onClick={handleNewChat}
          className=" w-full bg-gray-100 rounded-full hover:bg-black hover:text-white"
          title="Start new chat"
          variant={"ghost"}
        >
          <Plus size={12} />
        </Button>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-3">
        {chatSessions?.length > 0 ? (
          chatSessions.map((session) => (
            <div 
              key={session.id} 
              className="mb-2 p-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
            >
              <div className="font-medium text-sm">{session.title}</div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 mt-4">
            No chat history available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
