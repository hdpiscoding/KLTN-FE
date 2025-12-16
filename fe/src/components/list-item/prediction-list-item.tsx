import { MapPin, Calendar, Home, Maximize } from "lucide-react";
import { Link } from "react-router-dom";
import { formatArea, formatDateTime } from "@/utils/generalFormat.ts";
import { PROPERTY_TYPES } from "@/constants/propertyTypes.ts";

interface PredictionListItemProps {
    predictionId: string;
    fullAddress: string;
    predictedPriceBillions: number;
    livabilityScore: number;
    area: number;
    propertyType: string;
    createdAt: string;
}

export const PredictionListItem = ({
    predictionId,
    fullAddress,
    predictedPriceBillions,
    livabilityScore,
    area,
    propertyType,
    createdAt,
}: PredictionListItemProps) => {
    const getPropertyTypeName = (type: string) => {
        return PROPERTY_TYPES.find((pt) => pt.id === type)?.name || type;
    };

    // Color based on livability score
    const getScoreColor = (score: number) => {
        if (score >= 80) return '#22c55e'; // green
        if (score >= 60) return '#008DDA'; // blue
        if (score >= 40) return '#f59e0b'; // orange
        return '#ef4444'; // red
    };

    return (
        <Link
            to={`/dinh-gia-nha/ket-qua/${predictionId}`}
            className="block bg-white rounded-lg border border-gray-200 hover:border-[#008DDA] hover:shadow-md transition-all duration-200 overflow-hidden"
        >
            <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Left section - Price and Score */}
                    <div className="flex sm:flex-col justify-between sm:justify-start gap-4 sm:gap-3 sm:min-w-[180px] sm:border-r sm:pr-4">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Giá định giá</p>
                            <p className="text-xl sm:text-2xl font-semibold text-[#008DDA]">
                                {predictedPriceBillions.toFixed(2)} tỷ
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Chỉ số sống</p>
                            <p
                                className="text-xl sm:text-2xl font-semibold"
                                style={{ color: getScoreColor(livabilityScore) }}
                            >
                                {livabilityScore}/100
                            </p>
                        </div>
                    </div>

                    {/* Right section - Details */}
                    <div className="flex-1 space-y-3">
                        {/* Address */}
                        <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm sm:text-base text-gray-700 line-clamp-2 break-words">
                                {fullAddress}
                            </p>
                        </div>

                        {/* Property Info */}
                        <div className="flex flex-wrap gap-x-6 gap-y-2">
                            <div className="flex items-center gap-2">
                                <Home className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                    {getPropertyTypeName(propertyType)}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Maximize className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                    {formatArea(area)}
                                </span>
                            </div>
                        </div>

                        {/* Date */}
                        <div className="flex items-center gap-2 pt-2 border-t">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-500">
                                {formatDateTime(createdAt)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

