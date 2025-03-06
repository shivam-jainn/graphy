"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@workspace/ui/components/dropdown-menu";
import { useSession } from "@/lib/auth/auth-client";
import { useState } from "react";
import { useAtom } from "jotai";
import { isSidebarOpenAtom, selectedBoardAtom } from "@/lib/atoms/sidebar-atom";

interface Board {
  id: string;
  name: string;
}

export default function BoardSelector() {
  const session = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useAtom(isSidebarOpenAtom);

  const [boards, setBoards] = useState<Board[]>([
    // Example boards
    { id: "1", name: "Project A" },
    { id: "2", name: "Project B" },
  ]);

  const [selectedBoard,setSelectedBoard] = useAtom(selectedBoardAtom);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="p-2 h-12 bg-muted/50 rounded-lg cursor-pointer bg-red-400"
        style={{
            backgroundImage: "url('/board1.png')", // Use background image
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        
        >

           { isSidebarOpen ? <span className="relative z-10 font-black text-xl text-white">{boards[selectedBoard]?.name}</span> : ""}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[var(--radix-dropdown-menu-trigger-width)]">
        {boards.map((board) => (
          <DropdownMenuItem key={board.id}>
            {board.name}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          + Add Board
        </DropdownMenuItem>
        <DropdownMenuItem>
          Manage Boards
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}