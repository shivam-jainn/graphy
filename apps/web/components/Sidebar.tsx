import { isSidebarOpenAtom } from '@/lib/atoms/sidebar-atom';
import { Button } from '@workspace/ui/components/button';
import { useAtom } from 'jotai';
import React from 'react';
import BoardSelector from './BoardSelector';
import ChatHistory from './ChatHistory';
import UploadPad from './UploadPad';
import { FaCaretRight } from 'react-icons/fa6';
export default function Sidebar() {
  const [isSideBarOpen, setIsSidebarOpen] = useAtom(isSidebarOpenAtom);

  return (
    <div className={`flex flex-col ${isSideBarOpen ? "w-64" : "w-16"} h-screen overflow-hidden transition-all duration-300 border-r`}>
      {/* Toggle Button */}
      <Button
        onClick={() => setIsSidebarOpen(!isSideBarOpen)}
        variant="ghost"
        className="flex justify-center items-center p-2 hover:bg-gray-100 transition-colors"
      >
        <FaCaretRight />
      </Button>

      {/* Board Selector */}
      <div className="p-2">
        <BoardSelector />
      </div>

      {/* Main Sidebar Content */}
      {isSideBarOpen && (
        <div className="flex flex-col flex-1 gap-4 p-2 overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <ChatHistory />
          </div>
          <div className="flex-1 overflow-hidden">
            <UploadPad />
          </div>
        </div>
      )}
    </div>
  );
}
