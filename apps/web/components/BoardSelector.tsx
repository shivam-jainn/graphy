"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@workspace/ui/components/dialog";
import { useSession } from "@/lib/auth/auth-client";
import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { isSidebarOpenAtom } from '@/lib/atoms/sidebar-atom';
import { selectedBoardAtom } from '@/lib/atoms/board-atom';

interface Board {
  id: string;
  boardName: string;
}

export default function BoardSelector() {
  const session = useSession();
  const [isSidebarOpen] = useAtom(isSidebarOpenAtom);
  const [boards, setBoards] = useState<Board[]>([]);
  const [selectedBoard, setSelectedBoard] = useAtom(selectedBoardAtom);

  // Fetch boards from backend
  useEffect(() => {
    async function fetchBoards() {
      try {
        const response = await fetch("/api/boards");
        const boards = await response.json();
        setBoards(boards || []);
      } catch (error) {
        console.error("Failed to fetch boards:", error);
      }
    }
    fetchBoards();
  }, []); // Empty dependency array to run only once

  // Set initial board on load
  useEffect(() => {
    if (boards.length > 0 && !selectedBoard) {
      console.log("Setting selectedBoard to:", boards[0]?.id);
      setSelectedBoard(boards[0]?.id);
    }
  }, [boards, selectedBoard, setSelectedBoard]);
  

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");

  // Create a new board
  const handleCreateBoard = async () => {
    if (!newBoardName.trim()) return;

    try {
      const response = await fetch("/api/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ boardName: newBoardName }),
      });

      if (response.ok) {
        const newBoard = await response.json();
        setBoards((prev) => [...prev, newBoard]);
        setNewBoardName("");
        setIsDialogOpen(false);
      } else {
        console.error("Failed to create board");
      }
    } catch (error) {
      console.error("Error creating board:", error);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div
            className="p-2 h-12 bg-muted/50 rounded-lg cursor-pointer bg-red-400"
            style={{
              backgroundImage: "url('/board1.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {isSidebarOpen ? (
              <span className="relative z-10 font-black text-xl text-white">
                {boards.find((board) => board.id === selectedBoard)?.boardName || "Select Board"}
              </span>
            ) : null}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[var(--radix-dropdown-menu-trigger-width)]">
          {boards.length > 0 ? (
            boards.map((board) => (
              <DropdownMenuItem key={board.id} onClick={() => setSelectedBoard(board.id)}>
                {board.boardName}
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>+ Add Board</DropdownMenuItem>
          <DropdownMenuItem>Manage Boards</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Board</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              placeholder="Enter board name"
              className="p-2 border rounded-md w-full"
            />
            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
              </DialogClose>
              <button
                onClick={handleCreateBoard}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
