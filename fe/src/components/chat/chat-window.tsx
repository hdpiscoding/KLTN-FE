import { ChatHeader } from "./chat-header";
import { ChatMessageList } from "./chat-message-list";
import { ChatInput } from "./chat-input";
import { ChatAuthGate } from "./chat-auth-gate";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/chatStore";
import { useUserStore } from "@/store/userStore";

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatWindow({ isOpen, onClose }: ChatWindowProps) {
  const { messages, isTyping, sendMessage } = useChatStore();
  const { isLoggedIn } = useUserStore();

  const handleSendMessage = async (message: string) => {
    await sendMessage(message);
  };

  return (
    <div
      className={cn(
        "fixed bottom-24 right-6 w-[380px] h-[600px] bg-white rounded-lg shadow-2xl z-50 flex flex-col overflow-hidden",
        "sm:w-[420px] sm:h-[650px]",
        "transition-all duration-500 ease-out",
        isOpen
          ? "opacity-100 scale-100 translate-y-0 visible"
          : "opacity-0 scale-90 translate-y-8 invisible"
      )}
      style={{
        transformOrigin: "bottom right",
      }}
    >
      {/* Header with slide down animation */}
      <div
        className={cn(
          "transition-all duration-500 ease-out",
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        )}
        style={{
          transitionDelay: isOpen ? "100ms" : "0ms",
        }}
      >
        <ChatHeader onMinimize={onClose} />
      </div>

      {/* Content with fade in animation */}
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-500 ease-out",
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}
        style={{
          transitionDelay: isOpen ? "200ms" : "0ms",
        }}
      >
        {!isLoggedIn ? (
          <ChatAuthGate />
        ) : (
          <>
            <ChatMessageList messages={messages} isTyping={isTyping} />
            <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
          </>
        )}
      </div>
    </div>
  );
}

