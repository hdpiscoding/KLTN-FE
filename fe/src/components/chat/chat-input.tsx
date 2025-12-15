import { useState, type KeyboardEvent } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t bg-white px-4 py-3 rounded-b-lg">
      <div className="flex gap-2 items-end">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nhập tin nhắn của bạn..."
          disabled={disabled}
          className="min-h-[40px] max-h-32 resize-none rounded-xl border-gray-200 focus-visible:ring-[#008DDA]"
          rows={1}
        />
        <Button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          size="icon"
          className="h-10 w-10 rounded-xl flex-shrink-0 cursor-pointer"
          style={{ backgroundColor: "#008DDA" }}
          onMouseEnter={(e) => {
            if (!disabled && message.trim()) {
              e.currentTarget.style.backgroundColor = "#0064A6";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#008DDA";
          }}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
      <p className="text-xs text-gray-400 mt-2 hidden md:block">
        Nhấn Enter để gửi, Shift + Enter để xuống dòng
      </p>
    </div>
  );
}

