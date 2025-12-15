import { ChatLauncher } from "./chat-launcher";
import { ChatWindow } from "./chat-window";
import { useChatStore } from "@/store/chatStore";

export function ChatBot() {
  const { isOpen, toggleChat, setIsOpen } = useChatStore();

  return (
    <>
      <ChatLauncher isOpen={isOpen} onClick={toggleChat} />
      <ChatWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

