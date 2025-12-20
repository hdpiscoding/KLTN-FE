import { useUserStore } from "@/store/userStore";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH";

export interface StreamHelperOptions<T> {
    url: string;
    method?: HttpMethod;
    payload?: unknown;
    headers?: Record<string, string>;
    onMessage: (data: T) => void;
    onDone?: () => void;
    onError?: (error: unknown) => void;
}

export const streamHelper = async <T>({
                                          url,
                                          method = "POST",
                                          payload,
                                          headers,
                                          onMessage,
                                          onDone,
                                          onError,
                                      }: StreamHelperOptions<T>) => {
    const token = useUserStore.getState().token;

    try {
        const response = await fetch(url, {
            method,
            headers: {
                ...(payload && method !== "GET"
                    ? { "Content-Type": "application/json" }
                    : {}),
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...headers,
            },
            ...(method !== "GET" && payload
                ? { body: JSON.stringify(payload) }
                : {}),
        });

        if (!response.ok) {
            throw new Error(`Stream request failed: ${response.status}`);
        }

        if (!response.body) {
            throw new Error("Response body is not readable (no stream)");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");

        let buffer = "";

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            // Server trả newline-delimited JSON (NDJSON)
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
                if (!line.trim()) continue;

                try {
                    const parsed = JSON.parse(line);
                    onMessage(parsed);
                } catch (err) {
                    console.error("Failed to parse stream chunk:", line);
                    throw err;
                }
            }
        }

        onDone?.();
    } catch (error) {
        onError?.(error);
    }
};