import { useCallback, useState } from "react";
import { useChatStore } from "@/store/chatStore";
import type { ChatContext, ChatMessage } from "@/store/chatStore";
import {
  sendGeneralMessage,
  sendPredictionMessage,
  sendPropertyInsightMessage,
} from "@/services/chatbotServices";
import type { GeneralChatRequest } from "@/types/chat/general-chat-request";
import type { PredictionChatRequest } from "@/types/chat/prediction-chat-request";
import type { PropertyChatRequest } from "@/types/chat/propery-chat-request";
import type { ChatResponse } from "@/types/chat/chat-response";
import { formatMessageTime } from "@/utils/generalFormat";

/**
 * Hook to send messages with streaming support
 */
export const useSendMessage = () => {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const currentContext = useChatStore((state) => state.currentContext);
  const contextMetadata = useChatStore((state) => state.contextMetadata);
  const addMessage = useChatStore((state) => state.addMessage);
  const setIsTyping = useChatStore((state) => state.setIsTyping);
  const setStreamingMessageId = useChatStore((state) => state.setStreamingMessageId);
  const checkTokenExpired = useChatStore((state) => state.checkTokenExpired);

  const sendMessage = useCallback(
    async (
      userMessage: string,
      context?: ChatContext,
      metadata?: { propertyId?: number; predictionId?: string }
    ) => {
      // Check if token is expired before sending message
      if (checkTokenExpired && checkTokenExpired()) {
        return; // Stop execution if token is expired (dialog will be shown)
      }

      const targetContext = context || currentContext;
      const targetMetadata = metadata || contextMetadata;

      setIsSending(true);
      setError(null);

      // Add user message immediately
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        message: userMessage,
        isBot: false,
        timestamp: formatMessageTime(new Date().toISOString()),
      };
      addMessage(userMsg, targetContext);

      // Start typing indicator
      setIsTyping(true);

      // Accumulate bot response from stream chunks
      let botResponse = "";
      const botMessageId = `bot-${Date.now()}`;

      // Mark this message as streaming
      setStreamingMessageId(botMessageId);

      try {
        const onMessage = (data: ChatResponse) => {
          if (data.text) {
            botResponse += data.text;

            // Update or add bot message with accumulated text
            const botMsg: ChatMessage = {
              id: botMessageId,
              message: botResponse,
              isBot: true,
              timestamp: formatMessageTime(new Date().toISOString()),
            };

            // Update the existing bot message in the store
            const currentMessages = useChatStore.getState().getCurrentMessages();
            const existingBotMsgIndex = currentMessages.findIndex((msg) => msg.id === botMessageId);

            if (existingBotMsgIndex === -1) {
              // First chunk - add new message
              addMessage(botMsg, targetContext);
            } else {
              // Update existing message
              const updatedMessages = [...currentMessages];
              updatedMessages[existingBotMsgIndex] = botMsg;
              useChatStore.getState().setMessages(updatedMessages, targetContext);
            }
          }
        };

        const onDone = () => {
          setIsTyping(false);
          setIsSending(false);
          setStreamingMessageId(null); // Clear streaming message ID
        };

        const onError = (err: unknown) => {
          const error = err instanceof Error ? err : new Error("Failed to send message");
          setError(error);
          setIsTyping(false);
          setIsSending(false);
          setStreamingMessageId(null); // Clear streaming message ID

          // Add error message
          const errorMsg: ChatMessage = {
            id: `error-${Date.now()}`,
            message: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.",
            isBot: true,
            timestamp: formatMessageTime(new Date().toISOString()),
          };
          addMessage(errorMsg, targetContext);
        };

        // Call appropriate API based on context
        switch (targetContext) {
          case "general": {
            // Get user location from localStorage or default to null
            const userLocation = localStorage.getItem("userLocation");
            let latitude = null;
            let longitude = null;

            if (userLocation) {
              try {
                const location = JSON.parse(userLocation);
                latitude = location.latitude;
                longitude = location.longitude;
              } catch {
                // Ignore parse errors
              }
            }

            const request: GeneralChatRequest = {
              message: userMessage,
              latitude,
              longitude,
            };
            await sendGeneralMessage(request, onMessage, onDone, onError);
            break;
          }

          case "insight": {
            if (!targetMetadata.propertyId) {
              throw new Error("propertyId is required for insight context");
            }
            const request: PropertyChatRequest = {
              property_id: targetMetadata.propertyId,
              message: userMessage,
            };
            await sendPropertyInsightMessage(request, onMessage, onDone, onError);
            break;
          }

          case "prediction": {
            if (!targetMetadata.predictionId) {
              throw new Error("predictionId is required for prediction context");
            }
            const request: PredictionChatRequest = {
              prediction_id: targetMetadata.predictionId,
              message: userMessage,
            };
            await sendPredictionMessage(request, onMessage, onDone, onError);
            break;
          }

          default:
            throw new Error(`Unknown context: ${targetContext}`);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Failed to send message");
        setError(error);
        setIsTyping(false);
        setIsSending(false);
        setStreamingMessageId(null); // Clear streaming message ID

        // Add error message
        const errorMsg: ChatMessage = {
          id: `error-${Date.now()}`,
          message: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.",
          isBot: true,
          timestamp: formatMessageTime(new Date().toISOString()),
        };
        addMessage(errorMsg, targetContext);

        throw error;
      }
    },
    [currentContext, contextMetadata, addMessage, setIsTyping, setStreamingMessageId, checkTokenExpired]
  );

  return {
    sendMessage,
    isSending,
    error,
  };
};

