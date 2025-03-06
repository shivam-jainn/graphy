"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Paperclip, FileText, ImageIcon, FileVideo, FileAudio, Search, MessageCircle, Send } from "lucide-react";
import { useChat } from "./chat-context";

const allowedExtensions = [".pdf", ".docx", ".png", ".jpg", ".mp4", ".mov", ".mp3", ".wav"];

export function ChatInput() {
  // Add ref for dropdown
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showAttachDropdown, setShowAttachDropdown] = useState(false);
  const [activeFeatures, setActiveFeatures] = useState<Record<string, boolean>>({
    search: false,
    reason: false
  });
  const { addMessage } = useChat();


  const featButtons = [
    { key: 'search', icon: Search, label: 'Search' },
    { key: 'reason', icon: MessageCircle, label: 'Reason' }
  ];

  const toggleFeature = (key: string) => {
    setActiveFeatures(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const truncateFileName = (name: string) => {
    const maxLength = 10;
    return name.length > maxLength 
      ? `${name.substring(0, maxLength)}...${name.split('.').pop()}`
      : name;
  };

  const handleFileUpload = useCallback((files: FileList) => {
    const validFiles = Array.from(files).filter(file => {
      const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
      return allowedExtensions.includes(ext);
    });
    setFiles(prev => [...prev, ...validFiles]);
  }, []);

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowAttachDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update onDrop to handle entire component
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    addMessage(inputValue);
    setInputValue('');  // Clear input after sending
  };

  return (
    <div 
      className="flex flex-col gap-3 w-full p-4 bg-white rounded-xl shadow-sm border"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsDragging(false);
        }
      }}
      onDrop={handleDrop}
    >
      {/* Message Box - update to remove individual drop handlers */}
      <Input 
  value={inputValue}
  onChange={(e) => setInputValue(e.target.value)}
  className="w-full bg-transparent border-none outline-none resize-none text-left align-top shadow-none focus:ring-0 focus:outline-none focus:border-none hover:border-none"
  placeholder="Type your message..."
/>

      {/* Files Tags */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((file, index) => {
            const Icon = file.type.startsWith('image/') ? ImageIcon :
                        file.type.startsWith('video/') ? FileVideo :
                        file.type.startsWith('audio/') ? FileAudio : FileText;
            
            return (
              <Badge key={index} variant="outline" className="gap-2 py-1 px-3 bg-blue-50 border-blue-200">
                <Icon className="w-4 h-4 text-blue-600" />
                <span className="text-blue-800">{truncateFileName(file.name)}</span>
              </Badge>
            )}
          )}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* Attachments Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowAttachDropdown(!showAttachDropdown)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Paperclip className="w-5 h-5 text-gray-600" />
            </button>
            
            {showAttachDropdown && (
              <div className="absolute left-0 bottom-full mb-2 w-48 bg-white shadow-lg rounded-md border z-10">
                <label className="flex px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <FileText className="w-4 h-4 mr-2" />
                  Local
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                    accept={allowedExtensions.join(',')}
                  />
                </label>
                <button className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Google Drive
                </button>
                <button className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center">
                  <FileVideo className="w-4 h-4 mr-2" />
                  OneDrive
                </button>
              </div>
            )}
          </div>

          {/* Feature Buttons */}
          {featButtons.map(({ key, icon: Icon, label }) => (
            <Button
              key={key}
              variant={activeFeatures[key] ? 'default' : 'ghost'}
              className={`gap-2 rounded-lg ${
                activeFeatures[key] ? 'bg-blue-100 text-blue-600 hover:bg-blue-100' : 'hover:bg-gray-100'
              }`}
              onClick={() => toggleFeature(key)}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Button>
          ))}
        </div>

        {/* Send Button */}
        <Button
          variant="default" 
          className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-10 h-10"
          onClick={handleSend}  // Changed from addMessage(inputValue) to handleSend
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>

      {/* Drop Zone Overlay */}
      {isDragging && (
        <div className="fixed inset-0 bg-white/90 flex items-center justify-center border-2 border-dashed border-blue-400 rounded-xl">
          <div className="text-center space-y-2">
            <Paperclip className="w-8 h-8 text-blue-500 mx-auto" />
            <p className="text-lg font-medium text-gray-700">
              Drop files to upload
            </p>
            <p className="text-sm text-gray-500">
              Supported formats: PDF, DOCX, Images, Videos, Audio
            </p>
          </div>
        </div>
      )}
    </div>
  );
}