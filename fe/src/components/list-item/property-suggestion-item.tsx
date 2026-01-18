import React from 'react';
import { formatPrice } from "@/utils/generalFormat";
import { formatArea } from "@/utils/generalFormat";
import { MapPin } from "lucide-react";

interface PropertySuggestionItemProps {
    id: number;
    title: string;
    price: number;
    priceUnit: string;
    area: number;
    addressDistrict: string;
    addressStreet: string;
    imageUrls: string[];
    onClick: () => void;
}

export const PropertySuggestionItem: React.FC<PropertySuggestionItemProps> = ({
    title,
    price,
    area,
    addressDistrict,
    addressStreet,
    imageUrls,
    onClick,
}) => {
    return (
        <div
            onClick={onClick}
            className="flex gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors border-b last:border-b-0"
        >
            {/* Image */}
            <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-gray-200">
                {imageUrls && imageUrls.length > 0 ? (
                    <img
                        src={imageUrls[0]}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <MapPin className="w-6 h-6" />
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 line-clamp-1 mb-1">
                    {title}
                </h4>
                <div className="flex items-center gap-2 text-sm mb-1">
                    <span className="font-semibold text-[#008DDA]">
                        {formatPrice(price)}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">
                        {formatArea(area)}
                    </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="w-3 h-3" />
                    <span className="line-clamp-1">
                        {addressStreet}, {addressDistrict}
                    </span>
                </div>
            </div>
        </div>
    );
};

