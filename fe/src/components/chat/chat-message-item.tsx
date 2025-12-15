import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/userStore";

interface ChatMessageItemProps {
  message: string;
  isBot: boolean;
  timestamp?: string;
}

export function ChatMessageItem({ message, isBot, timestamp }: ChatMessageItemProps) {
  const { isLoggedIn, avatarUrl } = useUserStore();

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
          <p className="text-sm whitespace-pre-wrap">{message}</p>
        </div>
        {timestamp && (
          <span className="text-xs text-gray-400 px-2">{timestamp}</span>
        )}
      </div>
    </div>
  );
}

