import { ChatLauncher } from "./chat-launcher";
import { ChatWindow } from "./chat-window";
import { useChatStore } from "@/store/chatStore";
import { useEffect } from "react";

interface ChatBotProps {
  checkTokenExpired: () => boolean;
}

export function ChatBot({ checkTokenExpired }: ChatBotProps) {
  const { isOpen, toggleChat, setIsOpen, setCheckTokenExpired } = useChatStore();

  // Store the checkTokenExpired function in chatStore for use in hooks
  useEffect(() => {
    setCheckTokenExpired(checkTokenExpired);

    // Cleanup on unmount
    return () => {
      setCheckTokenExpired(null);
    };
  }, [checkTokenExpired, setCheckTokenExpired]);

  return (
    <>
      <ChatLauncher isOpen={isOpen} onClick={toggleChat} />
      <ChatWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

