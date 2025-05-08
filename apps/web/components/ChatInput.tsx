"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Paperclip, FileText, ImageIcon, FileVideo, FileAudio, Search, MessageCircle, Send } from "lucide-react";

import { selectedBoardAtom, selectedChatAtom } from '@/lib/atoms/board-atom';
import { useAtom } from 'jotai';

const allowedExtensions = [".pdf", ".docx"];

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading?: boolean;  // Add this prop
}

export function ChatInput({ input, handleInputChange, handleSubmit, isLoading }: ChatInputProps) {
  const [selectedBoard] = useAtom(selectedBoardAtom);
  const [selectedChat] = useAtom(selectedChatAtom);
  console.log(selectedChat)
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showAttachDropdown, setShowAttachDropdown] = useState(false);
  const [activeFeatures, setActiveFeatures] = useState<Record<string, boolean>>({
    search: false,
    reason: false
  });

  // Remove duplicate useChat hook since we're getting these as props

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

  // Remove pendingFiles state, just use files
  const handleFileUpload = useCallback(async (fileList: FileList) => {
    const validFiles = Array.from(fileList).filter((file) => {
      const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
      return allowedExtensions.includes(ext);
    });
    setFiles(prev => [...prev, ...validFiles]); // Update files directly
    setShowAttachDropdown(false); // Close dropdown after selection
  }, []);

  // Add loading state
  const [isUploading, setIsUploading] = useState(false);

  const uploadFiles = async () => {
    setIsUploading(true);
    const uploadedFiles = [];
    try {
      // Add null checks
      if (!selectedChat) {
        throw new Error('No active chat session');
      }
      
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        if (selectedBoard) {
          formData.append("boardId", String(selectedBoard));
        }
        formData.append("chatId", String(selectedChat));

        const response = await fetch("/api/uploads/pdf", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || `Failed to upload ${file.name}`);
        }
        uploadedFiles.push(file);
      }
    } catch (error) {
      console.error("Failed to upload file:", error);
    } finally {
      setIsUploading(false);
      setFiles([]); // Clear files after attempts
    }
    return uploadedFiles.length > 0;
  };

  // Update the Send button in the return JSX
  // Update form submit handler with better error handling
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      let uploadSuccess = false;
      if (files.length > 0) {
        uploadSuccess = await uploadFiles();
      }
      
      // Only proceed with chat submission if either there were no files
      // or the upload was successful
      if (!files.length || uploadSuccess) {
        handleSubmit(e);
      }
    } catch (error) {
      console.error("Form submission failed:", error);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files);
    }
  }, [handleFileUpload]);

  return (
    <form
      onSubmit={handleFormSubmit}
      className="flex flex-col gap-3 w-full p-4 bg-white rounded-xl shadow-sm border border-solid border-gray-300 "
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
        value={input}
        onChange={handleInputChange}
        className="w-full bg-transparent border-none outline-none resize-none text-left align-top shadow-none focus:ring-0 focus:outline-none focus:border-none hover:border-none focus-visible:ring-0 focus-visible:outline-none"
        placeholder="Type your message..."
      />

      {/* Files Tags - now showing the correct files state */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((file, index) => (
            <Badge
              key={index}
              variant="outline"
              className="gap-2 py-1 px-3 bg-blue-50 border-blue-200"
            >
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="text-blue-800">{truncateFileName(file.name)}</span>
            </Badge>
          ))}
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
              type="button"
              variant={activeFeatures[key] ? 'default' : 'ghost'}
              className={`gap-2 rounded-lg ${activeFeatures[key] ? 'bg-blue-100 text-blue-600 hover:bg-blue-100' : 'hover:bg-gray-100'
                }`}
              onClick={() => toggleFeature(key)}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Button>

          ))}
        </div>

        {/* Update Send Button */}
        <Button
          type="submit"
          variant="default"
          className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-10 h-10"
          disabled={isUploading || isLoading}
        >
          {isUploading || isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
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
    </form>
  );
}