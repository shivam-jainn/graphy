"use client";

import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { FiChevronLeft, FiChevronRight, FiMessageSquare, FiFile } from "react-icons/fi";
import { isSidebarOpenAtom } from '@/lib/atoms/sidebar-atom';
import BoardSelector from '@/components/BoardSelector';
import ChatHistory from '@/components/ChatHistory';
import Uploads from '@/components/Uploads';
import AccountSelector from '@/components/AccountSelector';
import { Button } from "@workspace/ui/components/button";

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useAtom(isSidebarOpenAtom);

  return (
    <aside className={`h-screen bg-background border-r transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-16'} relative flex flex-col`}>
      
      {/* Sidebar Toggle Button */}
      <div className="p-2 flex justify-end">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="hover:bg-muted"
        >
          {isSidebarOpen ? <FiChevronLeft /> : <FiChevronRight />}
        </Button>
      </div>

      {/* Board Selector - Fixed at the top */}
      <div className="p-2 border-b">
        <BoardSelector />
      </div>

      {/* Scrollable Content in the middle */}
      <div className="flex-1 overflow-y-auto px-2">
        <SidebarItem icon={<FiMessageSquare />} label="Chat History" isOpen={isSidebarOpen}>
          <ChatHistory />
        </SidebarItem>

        <SidebarItem icon={<FiFile />} label="Uploads" isOpen={isSidebarOpen}>
          <Uploads />
        </SidebarItem>
      </div>

      {/* Account Selector - Fixed at the bottom */}
      <div className="p-2 border-t">
        <AccountSelector isOpen={isSidebarOpen} />
      </div>
    </aside>
  );
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
  children: React.ReactNode;
}

function SidebarItem({ icon, label, isOpen, children }: SidebarItemProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative">
      <div
        className={`flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-all cursor-pointer ${!isOpen ? 'justify-center' : ''}`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="text-muted-foreground flex items-center justify-center h-5 w-5">{icon}</div>
        {isOpen && <span className="font-medium">{label}</span>}
      </div>
      {expanded && isOpen && <div className="mt-2">{children}</div>}
      {!isOpen && (
        <div className="absolute left-16 top-0 hidden group-hover:block bg-popover border rounded-lg p-2 min-w-[200px] shadow-lg z-50">
          <span className="font-medium mb-2 block">{label}</span>
          {children}
        </div>
      )}
    </div>
  );
}
