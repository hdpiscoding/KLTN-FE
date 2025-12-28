import React from 'react';
import { MapPin, Maximize } from 'lucide-react';
import { formatPrice, formatArea } from '@/utils/generalFormat.ts';

export interface PropertyPopupCardProps {
    id: string;
    title: string;
    image: string;
    address?: string;
    price: number;
    area: number;
    onClose?: () => void;
}

export const PropertyPopupCard: React.FC<PropertyPopupCardProps> = ({
    id,
    title,
    image,
    address,
    price,
    area,
    onClose,
}) => {
    const handleCardClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('navigate');
        window.location.href = `/bat-dong-san/${id}`;
    };

    return (
        <div
            className="bg-white overflow-hidden transition-all duration-200 relative w-[250px] sm:w-[300px] max-w-[90vw]"
        >
            {/* Close button - Top right corner of card */}
            {onClose && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                    className="cursor-pointer absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-10 bg-black/60 hover:bg-black/80 text-white rounded-full p-0.5 sm:p-1 transition-colors shadow-md"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-2.5 w-2.5 sm:h-3 sm:w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            )}

            <div className="flex gap-2 sm:gap-3 p-2 sm:p-3">
                {/* Image - Left side */}
                <div className="relative w-20 h-20 sm:w-28 sm:h-28 flex-shrink-0 overflow-hidden rounded-md">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Content - Right side */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                    {/* Title */}
                    <h3 onClick={handleCardClick} className="cursor-pointer hover:text-[#008DDA] font-semibold text-xs sm:text-sm text-gray-900 line-clamp-2 break-words leading-snug mb-1 transition-colors duration-150">
                        {title}
                    </h3>

                    {/* Address */}
                    {address && (
                        <div className="flex items-start gap-0.5 sm:gap-1 mb-1.5 sm:mb-2">
                            <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-400 flex-shrink-0 mt-0.5" />
                            <p className="text-[10px] sm:text-xs text-gray-600 line-clamp-1 break-words">
                                {address}
                            </p>
                        </div>
                    )}

                    {/* Price and Area */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-bold text-[#008DDA] truncate">
                                {formatPrice(price)}
                            </p>
                        </div>
                        <div className="flex items-center gap-0.5 sm:gap-1 text-gray-700 flex-shrink-0">
                            <Maximize className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            <p className="text-[10px] sm:text-xs font-semibold whitespace-nowrap">
                                {formatArea(area)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

