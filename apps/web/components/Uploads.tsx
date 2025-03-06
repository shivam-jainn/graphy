"use client";

import { useState } from "react";

interface UploadFile {
  id: string;
  name: string;
  thumbnailUrl: string;
  fileUrl: string;
}

export default function Uploads() {
  const [files, setFiles] = useState<UploadFile[]>([
    // Example files
    { id: "1", name: "Document.pdf", thumbnailUrl: "/thumbnails/doc.png", fileUrl: "/files/document.pdf" },
    { id: "2", name: "Image.jpg", thumbnailUrl: "/thumbnails/image.png", fileUrl: "/files/image.jpg" },
  ]);

  return (
    <div className="grid grid-cols-3 gap-4 h-64 overflow-y-auto">
      {files.map((file) => (
        <div key={file.id} className="cursor-pointer" onClick={() => window.open(file.fileUrl, "_blank")}>
          <img src={file.thumbnailUrl} alt={file.name} className="w-full h-32 object-cover rounded-lg" />
          <div className="text-center mt-2">{file.name}</div>
        </div>
      ))}
    </div>
  );
}