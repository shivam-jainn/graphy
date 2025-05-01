import { Card } from '@workspace/ui/components/card';
import React, { useCallback, useState, useRef, useEffect } from 'react';
import { FiUpload, FiFile, FiX, FiImage, FiFileText, FiMusic, FiVideo, FiCode } from "react-icons/fi";

type FileCardPosition = {
  id: string;
  x: number;
  y: number;
  file: File;
  previewUrl?: string;
};

export default function UploadPad() {
  const [isDragging, setIsDragging] = useState(false);
  const [fileCards, setFileCards] = useState<FileCardPosition[]>([]);
  const [draggedCard, setDraggedCard] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const [previewFile, setPreviewFile] = useState<FileCardPosition | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Handle keyboard events for shift key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setIsShiftPressed(true);
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setIsShiftPressed(false);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  // Generate preview URLs for files
  useEffect(() => {
    fileCards.forEach(card => {
      if (!card.previewUrl && isPreviewable(card.file)) {
        const url = URL.createObjectURL(card.file);
        setFileCards(prev => prev.map(c => 
          c.id === card.id ? { ...c, previewUrl: url } : c
        ));
      }
    });
    
    return () => {
      fileCards.forEach(card => {
        if (card.previewUrl) URL.revokeObjectURL(card.previewUrl);
      });
    };
  }, [fileCards]);
  
  const isPreviewable = (file: File) => {
    return file.type.startsWith('image/') || 
           file.type.startsWith('video/') || 
           file.type.startsWith('audio/') ||
           file.type === 'application/pdf';
  };
  
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <FiImage className="text-blue-500" />;
    if (file.type.startsWith('video/')) return <FiVideo className="text-purple-500" />;
    if (file.type.startsWith('audio/')) return <FiMusic className="text-green-500" />;
    if (file.type.includes('text') || file.type.includes('json') || file.type.includes('javascript')) 
      return <FiCode className="text-orange-500" />;
    if (file.type === 'application/pdf') return <FiFileText className="text-red-500" />;
    return <FiFile className="text-gray-500" />;
  };
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      const containerRect = containerRef.current?.getBoundingClientRect();
      
      if (containerRect) {
        const centerX = containerRect.width / 2 - 40; // Half thumbnail width
        const centerY = containerRect.height / 2 - 50; // Half thumbnail height
        
        const newFileCards = newFiles.map((file, index) => ({
          id: `file-${Date.now()}-${index}`,
          x: centerX + index * 15, // Stagger position
          y: centerY + index * 15, // Stagger position
          file
        }));
        
        setFileCards(prev => [...prev, ...newFileCards]);
      }
    }
  }, []);
  
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const containerRect = containerRef.current?.getBoundingClientRect();
      
      if (containerRect) {
        const centerX = containerRect.width / 2 - 40; // Half thumbnail width
        const centerY = containerRect.height / 2 - 50; // Half thumbnail height
        
        const newFileCards = newFiles.map((file, index) => ({
          id: `file-${Date.now()}-${index}`,
          x: centerX + index * 15, // Stagger position
          y: centerY + index * 15, // Stagger position
          file
        }));
        
        setFileCards(prev => [...prev, ...newFileCards]);
      }
    }
  }, []);
  
  const openFileDialog = () => {
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.click();
  };
  
  const startDragging = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    
    const card = fileCards.find(c => c.id === id);
    if (card) {
      if (isShiftPressed && isPreviewable(card.file)) {
        setPreviewFile(card);
      } else {
        setDraggedCard(id);
        setDragOffset({
          x: e.clientX - card.x,
          y: e.clientY - card.y
        });
      }
    }
  };
  
  const onDrag = (e: React.MouseEvent) => {
    if (draggedCard) {
      e.preventDefault();
      setFileCards(prev => prev.map(card => {
        if (card.id === draggedCard) {
          return {
            ...card,
            x: e.clientX - dragOffset.x,
            y: e.clientY - dragOffset.y
          };
        }
        return card;
      }));
    }
  };
  
  const stopDragging = () => {
    setDraggedCard(null);
  };
  
  const removeFile = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFileCards(prev => {
      const cardToRemove = prev.find(card => card.id === id);
      if (cardToRemove?.previewUrl) {
        URL.revokeObjectURL(cardToRemove.previewUrl);
      }
      return prev.filter(card => card.id !== id);
    });
  };
  
  const closePreview = () => {
    setPreviewFile(null);
  };
  
  const getFileExtension = (filename: string) => {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
  };
  
  return (
    <div 
      className="h-full w-full overflow-hidden relative"
      ref={containerRef}
      onMouseMove={onDrag}
      onMouseUp={stopDragging}
      onMouseLeave={stopDragging}
    >
      {fileCards.length === 0 ? (
        <Card className="w-full h-full rounded-2xl p-2 flex flex-col items-center justify-center gap-4 drop-shadow-xs">
          <FiUpload className='text-4xl text-gray-300' />
          <h1 className='text-xl font-medium text-gray-400 text-center'>No Files Uploaded</h1>
        </Card>
      ) : (
        <div className="w-full h-full rounded-2xl p-2 relative bg-gray-50">
          {fileCards.map((fileCard) => (
            <div
              key={fileCard.id}
              className="absolute rounded-md shadow-md w-20 cursor-move select-none"
              style={{
                left: `${fileCard.x}px`,
                top: `${fileCard.y}px`,
                zIndex: draggedCard === fileCard.id ? 10 : 1,
                transition: draggedCard === fileCard.id ? 'none' : 'all 0.1s ease'
              }}
              onMouseDown={(e) => startDragging(e, fileCard.id)}
            >
              <div className="relative">
                {fileCard.file.type.startsWith('image/') && fileCard.previewUrl ? (
                  <div className="w-20 h-20 bg-white rounded-md overflow-hidden flex items-center justify-center">
                    <img 
                      src={fileCard.previewUrl} 
                      alt={fileCard.file.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-white rounded-md flex items-center justify-center">
                    <div className="text-3xl">
                      {getFileIcon(fileCard.file)}
                    </div>
                  </div>
                )}
                <button 
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                  onClick={(e) => removeFile(e, fileCard.id)}
                >
                  <FiX size={12} />
                </button>
              </div>
              <div className="mt-1 text-center">
                <p className="text-xs font-medium text-gray-700 truncate px-1">
                  {fileCard.file.name.length > 15 
                    ? fileCard.file.name.substring(0, 8) + '...' + getFileExtension(fileCard.file.name)
                    : fileCard.file.name}
                </p>
              </div>
            </div>
          ))}
          
          {isShiftPressed && (
            <div className="absolute bottom-4 left-4 bg-white px-3 py-2 rounded-md shadow-md text-sm text-gray-600">
              Hold Shift + Click to preview files
            </div>
          )}
          
          {/* Keep the preview modal code */}
        </div>
      )}
    </div>
  );
}