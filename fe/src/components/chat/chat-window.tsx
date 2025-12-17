import { useEffect } from "react";
import { ChatHeader } from "./chat-header";
import { ChatMessageList } from "./chat-message-list";
import { ChatInput } from "./chat-input";
import { ChatAuthGate } from "./chat-auth-gate";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/chatStore";
import { useUserStore } from "@/store/userStore";
import { useSendMessage, useLoadChatHistory } from "@/hooks/chat";

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatWindow({ isOpen, onClose }: ChatWindowProps) {
  const isTyping = useChatStore((state) => state.isTyping);
  const getCurrentMessages = useChatStore((state) => state.getCurrentMessages);
  const currentContext = useChatStore((state) => state.currentContext);
  const contextMetadata = useChatStore((state) => state.contextMetadata);
  const { isLoggedIn } = useUserStore();

  const { sendMessage, isSending } = useSendMessage();
  const { loadHistory, isLoading } = useLoadChatHistory();

  // Get current messages
  const messages = getCurrentMessages();

  // Load chat history when window opens and user is logged in
  useEffect(() => {
    if (isOpen && isLoggedIn) {
      loadHistory(currentContext, contextMetadata).catch((error) => {
        console.error("Failed to load chat history:", error);
      });
    }
  }, [isOpen, isLoggedIn, currentContext, contextMetadata, loadHistory]);

  const handleSendMessage = async (message: string) => {
    try {
      await sendMessage(message);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
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
          "flex-1 flex flex-col transition-all duration-500 ease-out overflow-y-auto",
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
            <ChatMessageList messages={messages} isTyping={isTyping} isLoading={isLoading} />
            <ChatInput onSendMessage={handleSendMessage} disabled={isTyping || isSending} />
          </>
        )}
      </div>
    </div>
  );
}

