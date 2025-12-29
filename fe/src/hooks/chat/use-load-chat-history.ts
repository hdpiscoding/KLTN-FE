import {useState, useCallback} from "react";
import {useChatStore} from "@/store/chatStore";
import type {ChatContext, ChatMessage} from "@/store/chatStore";
import {
    getGeneralChatHistory,
    getPredictionChatHistory,
    getPropertyInsightHistory,
} from "@/services/chatbotServices";
import {formatMessageTime} from "@/utils/generalFormat";

/**
 * Hook to load chat history from API
 */
export const useLoadChatHistory = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const setMessages = useChatStore((state) => state.setMessages);
    const currentContext = useChatStore((state) => state.currentContext);
    const contextMetadata = useChatStore((state) => state.contextMetadata);
    const checkTokenExpired = useChatStore((state) => state.checkTokenExpired);

    const loadHistory = useCallback(
        async (context?: ChatContext, metadata?: { propertyId?: number; predictionId?: string }) => {
            // Check if token is expired before loading history
            if (checkTokenExpired && checkTokenExpired()) {
                return []; // Stop execution if token is expired (dialog will be shown)
            }

            const targetContext = context || currentContext;
            const targetMetadata = metadata || contextMetadata;

            setIsLoading(true);
            setError(null);

            try {
                let response;

                switch (targetContext) {
                    case "general":
                        response = await getGeneralChatHistory();
                        break;
                    case "insight":
                        if (!targetMetadata.propertyId) {
                            throw new Error("propertyId is required for insight context");
                        }
                        response = await getPropertyInsightHistory(targetMetadata.propertyId);
                        break;
                    case "prediction":
                        if (!targetMetadata.predictionId) {
                            throw new Error("predictionId is required for prediction context");
                        }
                        response = await getPredictionChatHistory(targetMetadata.predictionId);
                        break;
                    default:
                        throw new Error(`Unknown context: ${targetContext}`);
                }

                // Parse response and set messages
                if (response.status === "200" && response.data?.items) {
                    console.log(`created_at [0]`, response.data.items[0]?.created_at);
                    const messages: ChatMessage[] = response.data.items.map((item: {
                        role?: string;
                        text?: string;
                        message?: string;
                        content?: string;
                        isBot?: boolean;
                        is_bot?: boolean;
                        timestamp?: string;
                        created_at?: string;
                    }, index: number) => ({
                        id: `${Date.now()}-${index}`,
                        // Support both role-based (user/model/assistant) and isBot field
                        message: item.text || item.message || item.content || "",
                        isBot: item.role === "model" || item.isBot || item.is_bot || false,
                        // Use created_at from API and format it with formatMessageTime
                        timestamp: formatMessageTime(item.created_at || item.timestamp || new Date().toISOString()),
                    }));
                    setMessages(messages, targetContext);
                    return messages;
                }

                return [];
            } catch (err) {
                const error = err instanceof Error ? err : new Error("Failed to load chat history");
                setError(error);
                console.error(`Error loading chat history for ${targetContext}:`, error);
                throw error;
            } finally {
                setIsLoading(false);
            }
        },
        [currentContext, contextMetadata, setMessages, checkTokenExpired]
    );

    return {
        loadHistory,
        isLoading,
        error,
    };
};

