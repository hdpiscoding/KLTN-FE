import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button.tsx";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEstimationStore } from "@/store/estimationStore.ts";
import { predictPropertyPrice } from "@/services/propertyServices.ts";
import { CircularProgress } from "@/components/ui/circular-progress.tsx";
import { Progress } from "@/components/ui/progress.tsx";
import { Loader2, TrendingUp, Shield, GraduationCap, ShoppingBag, Car, Leaf, Music, Heart, MessageCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import ReactMarkdown from 'react-markdown';
import type {PredictionData} from "@/types/prediction-data";
import {formatPrice} from "@/utils/generalFormat.ts";
import { useChatContext, useLoadChatHistory } from "@/hooks/chat";
import { useChatStore } from "@/store/chatStore";

export const EstimatePropertyPrice: React.FC = () => {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const { clearEstimationData, latitude, longitude, area, propertyType, address_district, fullAddress, legal_status, house_direction, balcony_direction, furniture_status, num_bedrooms, num_bathrooms, num_floors, facade_width_m, road_width_m } = useEstimationStore();

    const [isLoading, setIsLoading] = useState(true);
    const [predictionData, setPredictionData] = useState<PredictionData | null>(null);

    // Chat hooks
    const { switchToPrediction } = useChatContext();
    const { loadHistory } = useLoadChatHistory();
    const setIsOpen = useChatStore((state) => state.setIsOpen);


    useEffect(() => {
        const fetchPrediction = async () => {
            try {
                setIsLoading(true);

                const requestData: {
                    latitude: number;
                    longitude: number;
                    address_district: string;
                    full_address?: string;
                    area: number;
                    property_type: string;
                    num_bedrooms?: number;
                    num_bathrooms?: number;
                    num_floors?: number;
                    facade_width_m?: number;
                    road_width_m?: number;
                    legal_status?: string;
                    house_direction?: string;
                    balcony_direction?: string;
                    furniture_status?: string;
                } = {
                    latitude,
                    longitude,
                    address_district,
                    full_address: fullAddress,
                    area,
                    property_type: propertyType,
                };

                // Add optional fields if they exist
                if (num_bedrooms) requestData.num_bedrooms = num_bedrooms;
                if (num_bathrooms) requestData.num_bathrooms = num_bathrooms;
                if (num_floors) requestData.num_floors = num_floors;
                if (facade_width_m) requestData.facade_width_m = facade_width_m;
                if (road_width_m) requestData.road_width_m = road_width_m;
                if (legal_status) requestData.legal_status = legal_status;
                if (house_direction) requestData.house_direction = house_direction;
                if (balcony_direction) requestData.balcony_direction = balcony_direction;
                if (furniture_status) requestData.furniture_status = furniture_status;

                const response = await predictPropertyPrice(requestData);

                if (response.status === "200" && response.data) {
                    setPredictionData(response.data);
                } else {
                    toast.error("Không thể định giá bất động sản");
                }
            } catch (error) {
                console.error("Error predicting price:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPrediction();
    }, [latitude, longitude, area, propertyType, address_district, fullAddress, legal_status, house_direction, balcony_direction, furniture_status, num_bedrooms, num_bathrooms, num_floors, facade_width_m, road_width_m]);

    const handleContinue = () => {
        clearEstimationData();
        navigate("/dinh-gia-nha/dia-chi");
    };

    const handleContinueChat = async () => {
        if (!predictionData?.prediction_id) {
            toast.error("Không tìm thấy thông tin định giá");
            return;
        }

        try {
            switchToPrediction(predictionData.prediction_id);
            await loadHistory("prediction", { predictionId: predictionData.prediction_id });
            setIsOpen(true);
        } catch (error) {
            console.error("Failed to open chat:", error);
            toast.error("Không thể mở chat. Vui lòng thử lại.");
        }
    };

    const componentScoreLabels = [
        { key: 'score_public_safety', label: 'An ninh', icon: Shield, color: '#f97316', bgColor: 'bg-blue-500' },
        { key: 'score_healthcare', label: 'Y tế', icon: Heart, color: '#ef4444', bgColor: 'bg-red-500' },
        { key: 'score_education', label: 'Giáo dục', icon: GraduationCap, color: '#8b5cf6', bgColor: 'bg-purple-500' },
        { key: 'score_shopping', label: 'Tiện ích', icon: ShoppingBag, color: '#22c55e', bgColor: 'bg-green-500' },
        { key: 'score_transportation', label: 'Giao thông', icon: Car, color: '#eab308', bgColor: 'bg-yellow-500' },
        { key: 'score_environment', label: 'Môi trường', icon: Leaf, color: '#14b8a6', bgColor: 'bg-teal-500' },
        { key: 'score_entertainment', label: 'Giải trí', icon: Music, color: '#ec4899', bgColor: 'bg-pink-500' },
    ];

    if (isLoading) {
        return (
            <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-8">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 animate-spin text-[#008DDA]" />
                    <p className="text-gray-600">Đang phân tích và định giá bất động sản...</p>
                </div>
            </div>
        );
    }

    if (!predictionData) {
        return (
            <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-8">
                <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl text-center">
                    <p className="text-gray-600 mb-4">Không thể tải dữ liệu định giá</p>
                    <Button onClick={handleContinue} className="bg-[#008DDA] hover:bg-[#0064A6]">
                        Thử lại
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-200px)] px-4 py-8">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header Card */}
                <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
                    <div className="text-center mb-6">
                        <h2 className="text-3xl sm:text-4xl font-semibold mb-2">ĐỊNH GIÁ NHÀ</h2>
                        <p className="text-sm text-gray-500">{params.get("address") ?? ""}</p>
                    </div>

                    {/* Price and Livability Score */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        {/* Estimated Price */}
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-3">
                                <TrendingUp className="w-5 h-5 text-[#008DDA]" />
                                <p className="text-sm sm:text-base text-gray-600 font-medium">
                                    Giá ước tính
                                </p>
                            </div>
                            <p className="text-4xl sm:text-5xl font-bold text-[#008DDA] mb-2">
                                {predictionData.predicted_price_billions.toFixed(2)} tỷ VNĐ
                            </p>
                            {
                                area
                                &&
                                <p className="text-sm text-gray-500">
                                    ≈ {formatPrice(predictionData.predicted_price/area)}/m²
                                </p>
                            }
                        </div>

                        {/* Livability Score */}
                        <div className="flex flex-col items-center">
                            <p className="text-sm sm:text-base text-gray-600 font-medium mb-4">
                                Chỉ số sống
                            </p>
                            <CircularProgress value={predictionData.livability_score} size={140} strokeWidth={10} />
                        </div>
                    </div>
                </div>

                {/* Component Scores Card */}
                <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
                    <h3 className="text-xl font-semibold mb-6 text-center">Các chỉ số chi tiết</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {componentScoreLabels.map(({ key, label, icon: Icon, color }) => {
                            const score = predictionData.component_scores[key as keyof typeof predictionData.component_scores];
                            return (
                                <div key={key} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Icon className="w-5 h-5" style={{ color }} />
                                            <span className="text-sm font-medium text-gray-700">{label}</span>
                                        </div>
                                        <span className="text-sm font-semibold" style={{ color }}>
                                            {score.toFixed(1)}
                                        </span>
                                    </div>
                                    <Progress
                                        value={score}
                                        className="h-2"
                                        indicatorColor={color}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* AI Insight Card */}
                <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
                    <h3 className="text-xl font-semibold mb-4">Phân tích chi tiết từ AI</h3>
                    <div className="prose prose-sm sm:prose max-w-none text-gray-700">
                        <ReactMarkdown
                            components={{
                                h2: ({ children }) => <h2 className="text-lg font-semibold mt-4 mb-2">{children}</h2>,
                                h3: ({ children }) => <h3 className="text-base font-semibold mt-3 mb-2">{children}</h3>,
                                p: ({ children }) => <p className="mb-3 leading-relaxed">{children}</p>,
                                strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                                ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                                li: ({ children }) => <li className="ml-2">{children}</li>,
                            }}
                        >
                            {predictionData.ai_insight}
                        </ReactMarkdown>
                    </div>

                    {/* Continue Chat Button */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <Button
                            onClick={handleContinueChat}
                            className="cursor-pointer w-full h-12 bg-gradient-to-r from-[#008DDA] to-[#0064A6] hover:from-[#0064A6] hover:to-[#004d7a] text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                        >
                            <MessageCircle className="w-5 h-5 mr-2" />
                            Tiếp tục trò chuyện với AI
                        </Button>
                    </div>
                </div>

                {/* Continue Button */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <Button className="w-full h-11" variant="outline">
                        Xem lịch sử định giá
                    </Button>
                    <Button
                        onClick={handleContinue}
                        className="w-full h-11 transition-colors duration-200 bg-[#008DDA] cursor-pointer hover:bg-[#0064A6] text-base"
                    >
                        Tiếp tục định giá
                    </Button>
                </div>
            </div>
        </div>
    );
};

