import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/userStore";
import { useTypingEffect } from "@/hooks/chat";
import ReactMarkdown from "react-markdown";
import { useRef, useEffect } from "react";

interface ChatMessageItemProps {
  message: string;
  isBot: boolean;
  timestamp?: string;
  enableTypingEffect?: boolean; // Enable typing effect for streaming messages
}

export function ChatMessageItem({ message, isBot, timestamp, enableTypingEffect = false }: ChatMessageItemProps) {
  const { isLoggedIn, avatarUrl } = useUserStore();
  const wasTypingEnabledRef = useRef(false);

  // Track if typing effect was ever enabled for this message
  useEffect(() => {
    if (enableTypingEffect) {
      wasTypingEnabledRef.current = true;
    }
  }, [enableTypingEffect]);

  // Apply typing effect when enabled or if it was enabled before
  const shouldUseTypingEffect = isBot && (enableTypingEffect || wasTypingEnabledRef.current);

  const { displayedText, isTyping } = useTypingEffect(
    shouldUseTypingEffect ? message : "",
    {
      speed: 20, // 20ms per character for smooth typing
    }
  );

  // Use typing effect text if it should be used and still typing, otherwise show full message
  const displayMessage = shouldUseTypingEffect && (isTyping || displayedText) ? displayedText : message;

  return (
    <div className={cn("flex gap-3 mb-4", !isBot && "flex-row-reverse")}>
      <div
        className={cn(
          "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden",
          isBot ? "bg-[#008DDA]" : "bg-gray-200"
        )}
      >
        {isBot ? (
          <Bot className="h-5 w-5 text-white" />
        ) : isLoggedIn && avatarUrl ? (
          <img
            src={avatarUrl}
            alt="User avatar"
            className="h-full w-full object-cover"
          />
        ) : (
          <User className="h-5 w-5 text-gray-600" />
        )}
      </div>
      <div className={cn("flex flex-col gap-1 max-w-[85%]", !isBot && "items-end")}>
        <div
          className={cn(
            "px-4 py-2 rounded-2xl break-words",
            isBot
              ? "bg-gray-100 text-gray-800 rounded-tl-none"
              : "text-white rounded-tr-none"
          )}
          style={!isBot ? { backgroundColor: "#008DDA", wordBreak: "break-word" } : { wordBreak: "break-word" }}
        >
          {isBot ? (
            <div className="text-sm prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc list-inside mb-2 last:mb-0">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside mb-2 last:mb-0">{children}</ol>,
                  li: ({ children }) => <li className="mb-1">{children}</li>,
                  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                  em: ({ children }) => <em className="italic">{children}</em>,
                  code: ({ children }) => <code className="bg-gray-200 px-1 py-0.5 rounded text-xs">{children}</code>,
                  a: ({ children, href }) => (
                    <a href={href} className="text-[#008DDA] underline" target="_blank" rel="noopener noreferrer">
                      {children}
                    </a>
                  ),
                }}
              >
                {displayMessage}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm whitespace-pre-wrap">{displayMessage}</p>
          )}
        </div>
        {timestamp && (
          <span className="text-xs text-gray-400 px-2">{timestamp}</span>
        )}
      </div>
    </div>
  );
}

