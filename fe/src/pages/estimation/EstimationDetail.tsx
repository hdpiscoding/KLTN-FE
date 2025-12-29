import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button.tsx";
import { useNavigate, useParams } from "react-router-dom";
import { CircularProgress } from "@/components/ui/circular-progress.tsx";
import { Progress } from "@/components/ui/progress.tsx";
import { Loader2, TrendingUp, Shield, GraduationCap, ShoppingBag, Car, Leaf, Music, Heart, Home, Bed, Bath, Layers, ArrowLeftRight, FileText, Compass, Wind, Sofa, MessageCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { formatPrice } from "@/utils/generalFormat.ts";
import { PROPERTY_TYPES } from "@/constants/propertyTypes.ts";
import { LEGAL_DOCS } from "@/constants/legalDocs.ts";
import { PROPERTY_DIRECTIONS } from "@/constants/propertyDirections.ts";
import { PROPERTY_FURNITURE } from "@/constants/propertyFurniture.ts";
import { useChatContext, useLoadChatHistory } from "@/hooks/chat";
import { useChatStore } from "@/store/chatStore";
import { toast } from "react-toastify";
import { getPredictionById } from "@/services/propertyServices";

interface PropertyPredictionResponse {
    prediction_id: string;
    created_at: string;
    address_district: string;
    area: number;
    property_type: string;
    predicted_price_billions: number;
    livability_score: number;
    ai_insight: string;
    longitude: number;
    latitude: number;
    full_address: string | null;
    num_bedrooms: number | null;
    num_bathrooms: number | null;
    num_floors: number | null;
    facade_width_m: number | null;
    road_width_m: number | null;
    legal_status: string | null;
    house_direction: string | null;
    balcony_direction: string | null;
    furniture_status: string | null;
    component_scores: ComponentScores;
}

interface ComponentScores {
    score_healthcare: number;
    score_education: number;
    score_transportation: number;
    score_environment: number;
    score_public_safety: number;
    score_shopping: number;
    score_entertainment: number;
}

export default function EstimationDetail() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [isLoading, setIsLoading] = useState(true);
    const [predictionData, setPredictionData] = useState<PropertyPredictionResponse>();

    // Chat hooks
    const { switchToPrediction } = useChatContext();
    const { loadHistory } = useLoadChatHistory();
    const setIsOpen = useChatStore((state) => state.setIsOpen);

    useEffect(() => {
        const fetchPredictionDetail = async () => {
            if (!id) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const response = await getPredictionById(id);

                if (response.status === "200" && response.data) {
                    setPredictionData(response.data);
                } else {
                    toast.error("Không thể tải thông tin định giá");
                }
            } catch (error) {
                console.error("Failed to fetch prediction details:", error);
                toast.error("Đã xảy ra lỗi khi tải thông tin định giá");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPredictionDetail();
    }, [id]);

    const getPropertyTypeName = (type: string) => {
        return PROPERTY_TYPES.find((pt) => pt.id === type)?.name || type;
    };

    const getLegalDocName = (status: string) => {
        return LEGAL_DOCS.find((doc) => doc.id === status)?.name || status;
    };

    const getDirectionName = (direction: string) => {
        return PROPERTY_DIRECTIONS.find((d) => d.id === direction)?.name || direction;
    };

    const getFurnitureName = (furniture: string) => {
        return PROPERTY_FURNITURE.find((f) => f.id === furniture)?.name || furniture;
    };

    const handleContinueChat = async () => {
        if (!id) return;

        try {
            // Switch to prediction context with predictionId
            switchToPrediction(id);

            // Load chat history for this prediction
            await loadHistory("prediction", { predictionId: id });

            // Open chat window
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
                    <p className="text-gray-600">Đang tải thông tin định giá...</p>
                </div>
            </div>
        );
    }

    if (!predictionData) {
        return (
            <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-8">
                <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl text-center">
                    <p className="text-gray-600 mb-4">Không tìm thấy thông tin định giá</p>
                    <Button onClick={() => navigate('/dinh-gia-nha/lich-su')} className="bg-[#008DDA] hover:bg-[#0064A6]">
                        Quay lại lịch sử
                    </Button>
                </div>
            </div>
        );
    }

    // Property detail items with icons
    const propertyDetails = [
        {
            key: 'area',
            label: 'Diện tích',
            value: predictionData.area ? `${predictionData.area} m²` : null,
            icon: Home
        },
        {
            key: 'property_type',
            label: 'Loại bất động sản',
            value: predictionData.property_type ? getPropertyTypeName(predictionData.property_type) : null,
            icon: Home
        },
        {
            key: 'num_bedrooms',
            label: 'Số phòng ngủ',
            value: predictionData.num_bedrooms ? `${predictionData.num_bedrooms} phòng` : null,
            icon: Bed
        },
        {
            key: 'num_bathrooms',
            label: 'Số phòng tắm',
            value: predictionData.num_bathrooms ? `${predictionData.num_bathrooms} phòng` : null,
            icon: Bath
        },
        {
            key: 'num_floors',
            label: 'Số tầng',
            value: predictionData.num_floors ? `${predictionData.num_floors} tầng` : null,
            icon: Layers
        },
        {
            key: 'facade_width_m',
            label: 'Mặt tiền',
            value: predictionData.facade_width_m ? `${predictionData.facade_width_m} m` : null,
            icon: ArrowLeftRight
        },
        {
            key: 'road_width_m',
            label: 'Đường vào',
            value: predictionData.road_width_m ? `${predictionData.road_width_m} m` : null,
            icon: ArrowLeftRight
        },
        {
            key: 'legal_status',
            label: 'Giấy tờ pháp lý',
            value: predictionData.legal_status ? getLegalDocName(predictionData.legal_status) : null,
            icon: FileText
        },
        {
            key: 'house_direction',
            label: 'Hướng nhà',
            value: predictionData.house_direction && predictionData.house_direction !== "Không xác định" ? getDirectionName(predictionData.house_direction) : null,
            icon: Compass
        },
        {
            key: 'balcony_direction',
            label: 'Hướng ban công',
            value: predictionData.balcony_direction && predictionData.balcony_direction !== "Không xác định" ? getDirectionName(predictionData.balcony_direction) : null,
            icon: Wind
        },
        {
            key: 'furniture_status',
            label: 'Nội thất',
            value: predictionData.furniture_status ? getFurnitureName(predictionData.furniture_status) : null,
            icon: Sofa
        },
    ];

    // Filter out null values
    const validPropertyDetails = propertyDetails.filter(item => item.value !== null);

    return (
        <div className="min-h-[calc(100vh-200px)] px-4 py-8">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header Card */}
                <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
                    <div className="text-center mb-6">
                        <h2 className="text-3xl sm:text-4xl font-semibold mb-2">CHI TIẾT ĐỊNH GIÁ</h2>
                        <p className="text-sm text-gray-500">{predictionData.address_district}</p>
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
                            {predictionData.area && (
                                <p className="text-sm text-gray-500">
                                    ≈ {formatPrice((predictionData.predicted_price_billions * 1000000000) / predictionData.area)}/m²
                                </p>
                            )}
                        </div>

                        {/* Livability Score */}
                        <div className="flex flex-col items-center">
                            <p className="text-sm sm:text-base text-gray-600 font-medium mb-4">
                                Chỉ số sống
                            </p>
                            <CircularProgress
                                value={Math.round(predictionData.livability_score)}
                                size={140}
                                strokeWidth={10}
                            />
                        </div>
                    </div>
                </div>

                {/* Property Details Card */}
                {validPropertyDetails.length > 0 && (
                    <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
                        <h3 className="text-xl font-semibold mb-6">Thông tin chi tiết</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {validPropertyDetails.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <div
                                        key={item.key}
                                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex-shrink-0 w-10 h-10 bg-[#008DDA]/10 rounded-lg flex items-center justify-center">
                                            <Icon className="w-5 h-5 text-[#008DDA]" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-gray-500 mb-0.5">{item.label}</p>
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {item.value}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

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
                        <div className="relative">
                            {/* Gradient background effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-[#008DDA] to-[#00B4D8] rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>

                            <Button
                                onClick={handleContinueChat}
                                className="relative w-full h-14 text-base font-semibold bg-gradient-to-r from-[#008DDA] to-[#00B4D8] hover:from-[#0064A6] hover:to-[#008DDA] text-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                            >
                                <div className="flex items-center justify-center gap-3">
                                    <div className="relative">
                                        <MessageCircle className="w-5 h-5 transition-transform group-hover:scale-110 duration-300" />
                                    </div>
                                    <span className="bg-gradient-to-r from-white to-blue-50 bg-clip-text text-transparent font-bold">
                                        Tiếp tục trò chuyện với AI
                                    </span>
                                    <div className="ml-1 transition-transform group-hover:translate-x-1 duration-300">
                                        →
                                    </div>
                                </div>
                            </Button>
                        </div>
                        <p className="text-center text-xs text-gray-500 mt-3">
                            Đặt câu hỏi về bất động sản này và nhận tư vấn chi tiết từ AI
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-white rounded-lg shadow-lg p-6 space-y-3">
                    <Button
                        onClick={() => navigate('/dinh-gia-nha/lich-su')}
                        className="w-full h-11 cursor-pointer"
                        variant="outline"
                    >
                        Quay lại lịch sử
                    </Button>
                    <Button
                        onClick={() => navigate('/dinh-gia-nha/dia-chi')}
                        className="w-full h-11 transition-colors duration-200 bg-[#008DDA] cursor-pointer hover:bg-[#0064A6] text-base"
                    >
                        Định giá mới
                    </Button>
                </div>
            </div>
        </div>
    );
}


