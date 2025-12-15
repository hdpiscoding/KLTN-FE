import { useEffect, useRef } from "react";
import { ChatMessageItem } from "./chat-message-item";
import { ChatTypingIndicator } from "./chat-typing-indicator";

interface Message {
  id: string;
  message: string;
  isBot: boolean;
  timestamp?: string;
}

interface ChatMessageListProps {
  messages: Message[];
  isTyping?: boolean;
}

export function ChatMessageList({ messages, isTyping }: ChatMessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center px-4">
          <div className="h-16 w-16 rounded-full bg-[#008DDA]/10 flex items-center justify-center mb-4">
            <svg
              className="h-8 w-8 text-[#008DDA]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Xin chào! 👋
          </h3>
          <p className="text-sm text-gray-500">
            Tôi là trợ lý AI của bạn. Hãy hỏi tôi bất kỳ điều gì về bất động sản!
          </p>
        </div>
      ) : (
        <>
          {messages.map((msg) => (
            <ChatMessageItem
              key={msg.id}
              message={msg.message}
              isBot={msg.isBot}
              timestamp={msg.timestamp}
            />
          ))}
          {isTyping && <ChatTypingIndicator />}
        </>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}

