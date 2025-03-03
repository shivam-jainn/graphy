"use client";
import { useState } from "react";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Paperclip, FileText, Search, MessageCircle, Send } from "lucide-react";

const allowedExtensions = [".pdf", ".docx", ".png", ".jpg"];
const buttons = [
  { label: "Search", icon: Search },
  { label: "Reason", icon: MessageCircle },
];

export function ChatInput() {
  const [files, setFiles] = useState<File[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const uploadedFiles = Array.from(event.target.files).filter((file) =>
      allowedExtensions.includes(file.name.slice(file.name.lastIndexOf(".")))
    );
    setFiles((prev) => [...prev, ...uploadedFiles]);
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4 rounded-2xl shadow-md border bg-white relative">
      <div className="absolute bottom-full left-0 w-full flex flex-wrap gap-2 p-2">
        {files.map((file, index) => (
          <Badge key={index} className="flex items-center gap-2 p-2">
            <FileText className="w-4 h-4" />
            {file.name}
          </Badge>
        ))}
      </div>

      <Input 
        className="w-full min-h-[100px] border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent resize-none" 
        placeholder="Type a message..." 
      />

      <div className="flex items-center justify-between gap-2 mt-2">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowDropdown(!showDropdown)}
              className="rounded-3xl"
            >
              <Paperclip className="w-5 h-5" />
            </Button>
            {showDropdown && (
              <div className="absolute left-0 mt-2 w-32 bg-white shadow-lg rounded-md border">
                <label className="block px-4 py-2 cursor-pointer hover:bg-gray-100">
                  Local
                  <input type="file" className="hidden" onChange={handleFileUpload} multiple />
                </label>
                <button className="block px-4 py-2 text-left w-full hover:bg-gray-100">
                  Google Drive
                </button>
                <button className="block px-4 py-2 text-left w-full hover:bg-gray-100">
                  OneDrive
                </button>
              </div>
            )}
          </div>

          {buttons.map(({ label, icon: Icon }) => (
            <Button key={label} variant="secondary" className="rounded-3xl">
              <Icon className="w-5 h-5" />
              {label}
            </Button>
          ))}
        </div>

        <Button variant="default" className="rounded-full w-10 h-10 flex items-center ">
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
