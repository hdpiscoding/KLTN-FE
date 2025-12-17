import { useCallback } from "react";
import { useChatStore } from "@/store/chatStore";
import type { ChatContext } from "@/store/chatStore";

/**
 * Hook to manage chat context (general, insight, prediction)
 */
export const useChatContext = () => {
  const currentContext = useChatStore((state) => state.currentContext);
  const contextMetadata = useChatStore((state) => state.contextMetadata);
  const setContext = useChatStore((state) => state.setContext);
  const clearMessages = useChatStore((state) => state.clearMessages);
  const checkTokenExpired = useChatStore((state) => state.checkTokenExpired);

  const switchToGeneral = useCallback(() => {
    // Check if token is expired before switching context
    if (checkTokenExpired && checkTokenExpired()) {
      return; // Stop execution if token is expired (dialog will be shown)
    }

    setContext("general", {});
    clearMessages("general");
  }, [setContext, clearMessages, checkTokenExpired]);

  const switchToInsight = useCallback(
    (propertyId: number) => {
      // Check if token is expired before switching context
      if (checkTokenExpired && checkTokenExpired()) {
        return; // Stop execution if token is expired (dialog will be shown)
      }

      setContext("insight", { propertyId });
      clearMessages("insight");
    },
    [setContext, clearMessages, checkTokenExpired]
  );

  const switchToPrediction = useCallback(
    (predictionId: string) => {
      // Check if token is expired before switching context
      if (checkTokenExpired && checkTokenExpired()) {
        return; // Stop execution if token is expired (dialog will be shown)
      }

      setContext("prediction", { predictionId });
      clearMessages("prediction");
    },
    [setContext, clearMessages, checkTokenExpired]
  );

  const switchContext = useCallback(
    (context: ChatContext, metadata?: { propertyId?: number; predictionId?: string }) => {
      // Check if token is expired before switching context
      if (checkTokenExpired && checkTokenExpired()) {
        return; // Stop execution if token is expired (dialog will be shown)
      }

      setContext(context, metadata);
      clearMessages(context);
    },
    [setContext, clearMessages, checkTokenExpired]
  );

  return {
    currentContext,
    contextMetadata,
    switchToGeneral,
    switchToInsight,
    switchToPrediction,
    switchContext,
  };
};

