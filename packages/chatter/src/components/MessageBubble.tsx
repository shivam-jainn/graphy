"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@workspace/ui/lib/utils";
import { AlertCircle, Copy, Check } from "lucide-react";
import useSound from "use-sound";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface IMessageBubble {
  message: {
    content: string;
    type: "text" | "image" | "video" | "audio";
  };
  isSender?: boolean;
  isError?: boolean;
  isLoading?: boolean;
  color?: string;
  gradient?: string;
  onRetry?: () => void;
  soundUrl?: string;
}

export function MessageBubble({
  message,
  isSender = false,
  isError = false,
  isLoading = false,
  color = "bg-blue-500",
  gradient = "",
  onRetry,
  soundUrl,
}: IMessageBubble) {
  const [play] = useSound(soundUrl || "", { volume: 0.5 });
  const [copiedCode, setCopiedCode] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (soundUrl) {
      play();
    }
  }, [message.content, play]);

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode((prev) => new Set(prev).add(code));
      setTimeout(() => {
        setCopiedCode((prev) => {
          const newSet = new Set(prev);
          newSet.delete(code);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const alignment = isSender ? "justify-end" : "justify-start";
  const backgroundStyle = gradient ? `bg-gradient-to-r ${gradient}` : color;
  const bubbleRadius = isSender ? "rounded-2xl rounded-tr-md" : "rounded-2xl rounded-tl-md";

  return (
    <div className={`flex ${alignment} mb-2`}>
      <div className="flex items-end max-w-xs md:max-w-md">
        {isLoading && <div className="animate-pulse text-gray-400 mr-2">...</div>}

        <div className={cn("relative px-4 py-2 text-white shadow-sm", backgroundStyle, bubbleRadius)}>
          {message.type === "text" && (
            <ReactMarkdown
            components={{
              code({ inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                const code = String(children).replace(/\n$/, '');
          
                return !inline ? (
                  <div className="relative">
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match?.[1] || 'text'}
                      PreTag="div"
                      {...props} // Ensure props are properly passed
                    >
                      {code}
                    </SyntaxHighlighter>
                    <button
                      onClick={() => handleCopyCode(code)}
                      className="absolute top-2 right-2 p-1 rounded bg-gray-800 hover:bg-gray-700"
                    >
                      {copiedCode === code ? (
                        <Check size={14} className="text-green-400" />
                      ) : (
                        <Copy size={14} className="text-gray-400" />
                      )}
                    </button>
                  </div>
                ) : (
                  <code className="bg-gray-800 rounded px-1">
                    {children}
                  </code>
                );
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
          
          )}
          {message.type === "image" && <img src={message.content} alt="Sent image" className="rounded-lg max-w-full" />}
          {message.type === "video" && (
            <video controls className="rounded-lg max-w-full">
              <source src={message.content} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          {message.type === "audio" && (
            <audio controls className="max-w-full">
              <source src={message.content} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          )}
        </div>

        {isError && (
          <button onClick={onRetry} className="ml-2 text-red-500 hover:text-red-600 transition-colors">
            <AlertCircle size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
