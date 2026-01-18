import { useState, useEffect } from "react";
import { PredictionListItem } from "@/components/list-item/prediction-list-item";
import { FileText } from "lucide-react";
import { getPredictionHistory } from "@/services/propertyServices";
import { Skeleton } from "@/components/ui/skeleton";

interface PredictionHistoryItem {
    predictionId: string;
    fullAddress: string;
    predictedPriceBillions: number;
    livabilityScore: number;
    area: number;
    propertyType: string;
    createdAt: string;
}

interface ApiPredictionItem {
    prediction_id: string;
    address_district: string;
    predicted_price_billions: number;
    livability_score: number;
    area: number;
    property_type: string;
    created_at: string;
}

export default function EstimationHistory() {
    const [predictions, setPredictions] = useState<PredictionHistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPredictionHistory = async () => {
            try {
                setIsLoading(true);
                const response = await getPredictionHistory();

                if (response.status === "200" && response.data?.items) {
                    // Map API response to component props
                    const mappedPredictions = response.data.items.map((item: ApiPredictionItem) => ({
                        predictionId: item.prediction_id,
                        fullAddress: item.address_district || "Địa chỉ không xác định", // Tạm thời dùng address_district
                        predictedPriceBillions: item.predicted_price_billions,
                        livabilityScore: Math.round(item.livability_score), // Round to integer
                        area: item.area,
                        propertyType: item.property_type,
                        createdAt: item.created_at,
                    }));
                    setPredictions(mappedPredictions);
                }
            } catch (error) {
                console.error("Error fetching prediction history:", error);
                setPredictions([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPredictionHistory();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-white border-b">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Lịch sử định giá
                        </h1>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600 max-w-3xl">
                        Xem lại các lần định giá bất động sản của bạn. Theo dõi xu hướng giá và chỉ số sống để đưa ra quyết định tốt nhất.
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {isLoading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-48" />
                        {[...Array(3)].map((_, index) => (
                            <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex sm:flex-col justify-between sm:justify-start gap-4 sm:gap-3 sm:min-w-[180px] sm:border-r sm:pr-4">
                                        <div>
                                            <Skeleton className="h-4 w-20 mb-2" />
                                            <Skeleton className="h-8 w-24" />
                                        </div>
                                        <div>
                                            <Skeleton className="h-4 w-20 mb-2" />
                                            <Skeleton className="h-8 w-24" />
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <Skeleton className="h-5 w-full" />
                                        <div className="flex gap-6">
                                            <Skeleton className="h-4 w-24" />
                                            <Skeleton className="h-4 w-24" />
                                        </div>
                                        <Skeleton className="h-4 w-32" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : predictions.length === 0 ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-8 sm:p-12 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                            <FileText className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Chưa có lịch sử định giá
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Bạn chưa thực hiện định giá nào. Hãy bắt đầu định giá bất động sản của bạn ngay!
                        </p>
                        <a
                            href="/dinh-gia-nha/dia-chi"
                            className="inline-flex items-center justify-center px-6 py-3 bg-[#008DDA] text-white rounded-lg hover:bg-[#0064A6] transition-colors"
                        >
                            Định giá ngay
                        </a>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-gray-600">
                                Tổng số: <span className="font-medium">{predictions.length}</span> lần định giá
                            </p>
                        </div>
                        {predictions.map((prediction) => (
                            <PredictionListItem
                                key={prediction.predictionId}
                                predictionId={prediction.predictionId}
                                fullAddress={prediction.fullAddress}
                                predictedPriceBillions={prediction.predictedPriceBillions}
                                livabilityScore={prediction.livabilityScore}
                                area={prediction.area}
                                propertyType={prediction.propertyType}
                                createdAt={prediction.createdAt}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

