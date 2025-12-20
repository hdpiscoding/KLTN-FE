import { create } from "zustand";

export interface ChatMessage {
  id: string;
  message: string;
  isBot: boolean;
  timestamp: string;
}

export type ChatContext = "general" | "insight" | "prediction";

interface ContextMetadata {
  propertyId?: number;
  predictionId?: string;
}

interface ChatState {
  // UI State
  isOpen: boolean;
  isTyping: boolean;
  streamingMessageId: string | null; // Track which message is streaming

  // Context State
  currentContext: ChatContext;
  contextMetadata: ContextMetadata;

  // Messages per context
  generalMessages: ChatMessage[];
  insightMessages: ChatMessage[];
  predictionMessages: ChatMessage[];

  // Token checker function
  checkTokenExpired: (() => boolean) | null;

  // Actions - UI
  setIsOpen: (isOpen: boolean) => void;
  toggleChat: () => void;
  setIsTyping: (isTyping: boolean) => void;
  setStreamingMessageId: (messageId: string | null) => void;

  // Actions - Token checker
  setCheckTokenExpired: (checker: (() => boolean) | null) => void;

  // Actions - Context Management
  setContext: (context: ChatContext, metadata?: ContextMetadata) => void;

  // Actions - Messages
  addMessage: (message: ChatMessage, context?: ChatContext) => void;
  setMessages: (messages: ChatMessage[], context?: ChatContext) => void;
  clearMessages: (context?: ChatContext) => void;
  getCurrentMessages: () => ChatMessage[];

  // Actions - Reset
  resetChat: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  // Initial UI State
  isOpen: false,
  isTyping: false,
  streamingMessageId: null,

  // Initial Context State
  currentContext: "general",
  contextMetadata: {},

  // Initial Messages State
  generalMessages: [],
  insightMessages: [],
  predictionMessages: [],

  // Initial Token Checker
  checkTokenExpired: null,

  // UI Actions
  setIsOpen: (isOpen) => set({ isOpen }),

  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),

  setIsTyping: (isTyping) => set({ isTyping }),

  setStreamingMessageId: (messageId) => set({ streamingMessageId: messageId }),

  // Token Checker Actions
  setCheckTokenExpired: (checker) => set({ checkTokenExpired: checker }),

  // Context Management Actions
  setContext: (context, metadata = {}) =>
    set({
      currentContext: context,
      contextMetadata: metadata,
    }),

  // Message Actions
  addMessage: (message, context) => {
    const targetContext = context || get().currentContext;

    set((state) => {
      switch (targetContext) {
        case "general":
          return { generalMessages: [...state.generalMessages, message] };
        case "insight":
          return { insightMessages: [...state.insightMessages, message] };
        case "prediction":
          return { predictionMessages: [...state.predictionMessages, message] };
        default:
          return state;
      }
    });
  },

  setMessages: (messages, context) => {
    const targetContext = context || get().currentContext;

    set((state) => {
      switch (targetContext) {
        case "general":
          return { generalMessages: messages };
        case "insight":
          return { insightMessages: messages };
        case "prediction":
          return { predictionMessages: messages };
        default:
          return state;
      }
    });
  },

  clearMessages: (context) => {
    const targetContext = context || get().currentContext;

    set((state) => {
      switch (targetContext) {
        case "general":
          return { generalMessages: [] };
        case "insight":
          return { insightMessages: [] };
        case "prediction":
          return { predictionMessages: [] };
        default:
          return state;
      }
    });
  },

  getCurrentMessages: () => {
    const state = get();
    switch (state.currentContext) {
      case "general":
        return state.generalMessages;
      case "insight":
        return state.insightMessages;
      case "prediction":
        return state.predictionMessages;
      default:
        return [];
    }
  },


  // Reset Actions
  resetChat: () =>
    set({
      currentContext: "general",
      contextMetadata: {},
      generalMessages: [],
      insightMessages: [],
      predictionMessages: [],
      isTyping: false,
      streamingMessageId: null,
    }),
}));

