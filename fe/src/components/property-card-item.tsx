import { useState } from "react";
import { MapPin, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import {formatPrice, formatRelativeTime, formatArea} from "@/utils/generalFormat.ts";

interface PropertyCardItemProps {
    id: string;
    title: string;
    price: number;
    area: number;
    address: string;
    imageUrl: string;
    createdAt: string;
    isFavorited?: boolean;
    onFavoriteClick?: (id: string) => void;
}

export const PropertyCardItem = ({
    id,
    title,
    price,
    area,
    address,
    imageUrl,
    createdAt,
    isFavorited = false,
    onFavoriteClick,
}: PropertyCardItemProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isFavorite, setIsFavorite] = useState(isFavorited);

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent card link click
        setIsFavorite(!isFavorite);
        onFavoriteClick?.(id);
    };

    return (
        <Link
            to={`/property/${id}`}
            className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container */}
            <div className="relative w-full pt-[75%] overflow-hidden rounded-t-lg">
                <img
                    src={imageUrl}
                    alt={title}
                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-300 ${
                        isHovered ? 'scale-110' : 'scale-100'
                    }`}
                />
            </div>

            {/* Content Container */}
            <div className="p-4 space-y-3">
                {/* Title */}
                <h3 className="text-gray-900 font-semibold text-lg line-clamp-2 break-words leading-snug">
                    {title}
                </h3>

                {/* Price and Area */}
                <div className="flex items-center justify-between">
                    <span className="text-[#008DDA] font-bold text-lg">
                        {formatPrice(price)}
                    </span>
                    <span className="text-gray-600">
                        {formatArea(area)}
                    </span>
                </div>

                {/* Address */}
                <div className="flex items-start gap-1 text-gray-500">
                    <div className="flex items-center justify-center gap-1">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <p className="line-clamp-1 text-sm">{address}</p>
                    </div>

                </div>

                {/* Time and Favorite */}
                <div className="flex items-center justify-between pt-2">
                    <span className="text-gray-500 text-sm">
                        {formatRelativeTime(createdAt)}
                    </span>
                    <button
                        onClick={handleFavoriteClick}
                        className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                        <Heart
                            className={`w-5 h-5 ${
                                isFavorite ? 'fill-red-500 text-red-500' : ''
                            }`}
                        />
                    </button>
                </div>
            </div>
        </Link>
    );
};
