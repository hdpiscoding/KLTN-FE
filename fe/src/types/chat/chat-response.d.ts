export interface ChatResponse {
    type: "content" | "done";
    text?: string;
}