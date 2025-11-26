import { useState } from "react";
import { MapPin, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import {formatPrice, formatRelativeTime, formatArea} from "@/utils/generalFormat.ts";
import {useUserStore} from "@/store/userStore.ts";

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
    const isLoggedIn = useUserStore((state) => state.isLoggedIn);
    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent card link click
        setIsFavorite(!isFavorite);
        onFavoriteClick?.(id);
    };

    return (
        <Link
            to={`/bat-dong-san/${id}`}
            className="group flex flex-col bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 h-[400px]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container - 55% */}
            <div className="relative w-full h-[55%] overflow-hidden rounded-t-lg flex-shrink-0">
                <img
                    src={imageUrl}
                    alt={title}
                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-300 ${
                        isHovered ? 'scale-110' : 'scale-100'
                    }`}
                />
            </div>

            {/* Content Container - 45% */}
            <div className="flex flex-col h-[45%] p-4 flex-shrink-0">
                {/* Title - Fixed height for 2 lines */}
                <h3 className="text-gray-900 font-semibold text-base line-clamp-2 break-words leading-tight h-[2.5rem] mb-2">
                    {title}
                </h3>

                {/* Price and Area */}
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[#008DDA] font-bold text-lg">
                        {formatPrice(price)}
                    </span>
                    <span className="text-gray-600 text-sm">
                        {formatArea(area)}
                    </span>
                </div>

                {/* Address */}
                <div className="flex items-start gap-1 text-gray-500 mb-2">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    <p className="line-clamp-1 text-sm">{address}</p>
                </div>

                {/* Time and Favorite - Push to bottom */}
                <div className="flex items-center justify-between mt-auto pt-2">
                    <span className="text-gray-500 text-xs">
                        {formatRelativeTime(createdAt)}
                    </span>
                    {isLoggedIn
                        &&
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
                    }

                </div>
            </div>
        </Link>
    );
};
