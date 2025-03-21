"use client";
import { useEffect, useState } from "react";
import { selectedBoardAtom } from "@/lib/atoms/board-atom";
import { useAtom } from "jotai";

interface UploadFile {
  id: string;
  fileName: string;
  fileUrl: string;
}

export default function Uploads() {
  const [selectedBoard] = useAtom(selectedBoardAtom);
  const [files, setFiles] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (selectedBoard) {
      fetch(`/api/uploads?boardId=${selectedBoard}`)
        .then(res => res.json())
        .then(({ uploads }) => setFiles(uploads || []));
    }
  }, [selectedBoard]);

  return (
    <div className="grid grid-cols-3 gap-4 h-64 overflow-y-auto">
      {files.map((file) => (
        <div key={file.id} className="cursor-pointer" onClick={() => window.open(file.fileUrl, "_blank")}>
          <div className="text-center mt-2">{file.fileName}</div>
        </div>
      ))}
    </div>
  );
}