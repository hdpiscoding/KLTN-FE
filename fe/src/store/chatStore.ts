import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ChatMessage {
  id: string;
  message: string;
  isBot: boolean;
  timestamp: string;
}

interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  isTyping: boolean;
  sessionId: string | null;

  // Actions
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
  setIsOpen: (isOpen: boolean) => void;
  toggleChat: () => void;
  setIsTyping: (isTyping: boolean) => void;
  setSessionId: (sessionId: string | null) => void;
  sendMessage: (userMessage: string) => Promise<void>;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [],
      isOpen: false,
      isTyping: false,
      sessionId: null,

      addMessage: (message) =>
        set((state) => ({
          messages: [...state.messages, message],
        })),

      clearMessages: () =>
        set({
          messages: [],
          sessionId: null,
        }),

      setIsOpen: (isOpen) => set({ isOpen }),

      toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),

      setIsTyping: (isTyping) => set({ isTyping }),

      setSessionId: (sessionId) => set({ sessionId }),

      sendMessage: async (userMessage) => {
        // Add user message
        const userMsg: ChatMessage = {
          id: Date.now().toString(),
          message: userMessage,
          isBot: false,
          timestamp: new Date().toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        get().addMessage(userMsg);
        set({ isTyping: true });

        try {
          // TODO: Replace with actual API call
          // const response = await chatbotAPI.sendMessage(userMessage, get().sessionId);

          // Simulate bot response for now
          await new Promise((resolve) => setTimeout(resolve, 1500));

          const botMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            message: "Xin chào! Tôi là trợ lý AI. Tôi sẽ giúp bạn tìm kiếm và tư vấn về bất động sản.",
            isBot: true,
            timestamp: new Date().toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };

          get().addMessage(botMsg);
        } catch (error) {
          console.error("Error sending message:", error);

          // Add error message
          const errorMsg: ChatMessage = {
            id: (Date.now() + 2).toString(),
            message: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.",
            isBot: true,
            timestamp: new Date().toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };

          get().addMessage(errorMsg);
        } finally {
          set({ isTyping: false });
        }
      },
    }),
    {
      name: "chat-storage",
      partialize: (state) => ({
        messages: state.messages,
        sessionId: state.sessionId,
      }),
    }
  )
);

