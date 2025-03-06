"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@workspace/ui/lib/utils";
import { AlertCircle, Copy, Check } from "lucide-react";
import { useSound } from "use-sound";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export interface IMessageBubbleMessage {
  content: string;
}

interface IMessageBubble {
  message: IMessageBubbleMessage;
  isSender?: boolean;
  isError?: boolean;
  isLoading?: boolean;
  color?: string;
  gradient?: string;
  onRetry?: () => void;
  soundUrl?: string;
}

// Define custom props for the code component
interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  inline?: boolean;
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
    <div className={`flex ${alignment} mb-2 px-4`}>
      <div className="flex items-end max-w-xs md:max-w-md">
        {isLoading && <div className="animate-pulse text-gray-400 mr-2">...</div>}

        <div className={cn("relative px-4 py-2 text-white shadow-sm", backgroundStyle, bubbleRadius)}>
          <ReactMarkdown
            components={{
              p: ({ children }) => <span className="block">{children}</span>,
              code: ({ inline, className, children }: CodeProps) => {
                const match = /language-(\w+)/.exec(className || '');
                const code = String(children).replace(/\n$/, '');

                return !inline ? (
                  <span className="block relative">
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match?.[1] || 'text'}
                      PreTag="div"
                    >
                      {code}
                    </SyntaxHighlighter>
                    <button
                      onClick={() => handleCopyCode(code)}
                      className="absolute top-2 right-2 p-1 rounded bg-gray-800 hover:bg-gray-700"
                    >
                      {copiedCode.has(code) ? (
                        <Check size={14} className="text-green-400" />
                      ) : (
                        <Copy size={14} className="text-gray-400" />
                      )}
                    </button>
                  </span>
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