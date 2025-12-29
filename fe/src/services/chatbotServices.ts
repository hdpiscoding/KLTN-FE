import { streamHelper } from "@/utils/streamHelper.ts";
import type { StreamHelperOptions } from "@/utils/streamHelper.ts";
import type { GeneralChatRequest } from "@/types/chat/general-chat-request";
import type { ChatResponse } from "@/types/chat/chat-response";
import type {PredictionChatRequest} from "@/types/chat/prediction-chat-request";
import type {PropertyChatRequest} from "@/types/chat/propery-chat-request";
import {instance} from "@/config/axiosConfig.ts";

export const sendGeneralMessage = async (
    request: GeneralChatRequest,
    onMessage: (data: ChatResponse) => void,
    onDone?: () => void,
    onError?: (error: unknown) => void
) => {
    const options: StreamHelperOptions<ChatResponse> = {
        url: "https://kltn-api-staging.sonata.io.vn/api/v1/recommendation/chat/general/stream",
        method: "POST",
        payload: request,
        onMessage,
        onDone,
        onError,
    };

    await streamHelper<ChatResponse>(options);
};

export const sendPredictionMessage = async (
    request: PredictionChatRequest,
    onMessage: (data: ChatResponse) => void,
    onDone?: () => void,
    onError?: (error: unknown) => void
) => {
    const options: StreamHelperOptions<ChatResponse> = {
        url: "https://kltn-api-staging.sonata.io.vn/api/v1/recommendation/prediction/property/chat/stream",
        method: "POST",
        payload: request,
        onMessage,
        onDone,
        onError,
    };

    await streamHelper<ChatResponse>(options);
}

export const sendPropertyInsightMessage = async (
    request: PropertyChatRequest,
    onMessage: (data: ChatResponse) => void,
    onDone?: () => void,
    onError?: (error: unknown) => void
) => {
    const options: StreamHelperOptions<ChatResponse> = {
        url: "https://kltn-api-staging.sonata.io.vn/api/v1/recommendation/insight/chat/stream",
        method: "POST",
        payload: request,
        onMessage,
        onDone,
        onError,
    };

    await streamHelper<ChatResponse>(options);
}

export const getPropertyInsight = async (
    propertyId: number,
    onMessage: (data: ChatResponse) => void,
    onDone?: () => void,
    onError?: (error: unknown) => void
) => {
    const options: StreamHelperOptions<ChatResponse> = {
        url: `https://kltn-api-staging.sonata.io.vn/api/v1/recommendation/insight/analyze/stream/${propertyId}`,
        method: "GET",
        onMessage,
        onDone,
        onError,
    };

    await streamHelper<ChatResponse>(options);
}

export const getGeneralChatHistory = async () => {
    const response = await instance.get(`recommendation/chat/general/history`);
    return response.data;
}

export const getPredictionChatHistory = async (predictionId: string) => {
    const response = await instance.get(`recommendation/prediction/property/chat/history/${predictionId}`);
    return response.data;
}

export const getPropertyInsightHistory = async (propertyId: number) => {
    const response = await instance.get(`recommendation/insight/chat/history/${propertyId}`);
    return response.data;
}
