import React from 'react';
import { X, MapPin, Star } from 'lucide-react';
import type { Amenity } from '@/types/amenity.d.ts';
import { AMENITY_CATEGORIES } from '@/components/map';
import {convertDistrictToVN} from "@/utils/districtHelper.ts";

interface AmenityInfoCardProps {
    amenity: Amenity;
    onClose: () => void;
}

export const AmenityInfoCard: React.FC<AmenityInfoCardProps> = ({ amenity, onClose }) => {
    const categoryConfig = AMENITY_CATEGORIES[amenity.category];
    const Icon = categoryConfig.icon;
    return (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden max-w-sm relative">
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-2 right-2 z-10 p-1 bg-white rounded-full shadow hover:bg-gray-100 transition-colors"
                aria-label="Close"
            >
                <X className="w-4 h-4 text-gray-600" />
            </button>

            {/* Header with category color */}
            <div
                className="px-4 py-3 text-white"
                style={{ backgroundColor: categoryConfig.color }}
            >
                <div className="flex items-center gap-2">
                    <span className="text-2xl">
                        <Icon className="w-5 h-5" />
                    </span>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium opacity-90">{categoryConfig.label}</p>
                        <h3 className="font-semibold text-sm line-clamp-2 break-words">
                            {amenity.name}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
                {/* Address */}
                {amenity.vicinity
                    &&
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-gray-600 line-clamp-2 break-words">
                            {amenity.vicinity}
                        </p>
                    </div>
                }


                {/* Rating */}
                {amenity.google_rating && amenity.google_user_ratings_total && (
                    <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-medium text-gray-700">
                            {amenity.google_rating.toFixed(1)}
                        </span>
                        <span className="text-xs text-gray-500">
                            ({amenity.google_user_ratings_total} đánh giá)
                        </span>
                    </div>
                )}

                {/* District */}
                <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                        <span className="font-medium">Quận/Huyện:</span> {convertDistrictToVN(amenity.district)}
                    </p>
                </div>
            </div>
        </div>
    );
};

