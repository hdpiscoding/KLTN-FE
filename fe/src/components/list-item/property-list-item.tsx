import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { formatPrice, formatRelativeTime, formatArea } from "@/utils/generalFormat.ts";
import {useUserStore} from "@/store/userStore.ts";

interface PropertyListItemProps {
    id: string;
    title: string;
    price: number;
    area: number;
    address: string;
    imageUrl: string;
    createdAt: string;
    isLiked?: boolean;
    onFavoriteClick?: (id: string, currentLikedState: boolean) => Promise<void>;
}

export const PropertyListItem = ({
    id,
    title,
    price,
    area,
    address,
    imageUrl,
    createdAt,
    isLiked = false,
    onFavoriteClick,
}: PropertyListItemProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isFavorite, setIsFavorite] = useState(isLiked);
    const [isLoading, setIsLoading] = useState(false);
    const isLoggedIn = useUserStore((state) => state.isLoggedIn);

    useEffect(() => {
        setIsFavorite(isLiked);
    }, [isLiked]);

    const handleFavoriteClick = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent card link click
        if (isLoading || !onFavoriteClick) return;

        setIsLoading(true);
        try {
            await onFavoriteClick(id, isFavorite);
            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error("Error toggling favorite:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Link
            to={`/bat-dong-san/${id}`}
            className="group flex gap-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-3"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container - Left side */}
            <div className="relative w-48 h-36 flex-shrink-0 overflow-hidden rounded-lg">
                <img
                    src={imageUrl}
                    alt={title}
                    className={`w-full h-full object-cover transition-transform duration-300 ${
                        isHovered ? 'scale-110' : 'scale-100'
                    }`}
                />
            </div>

            {/* Content Container - Right side */}
            <div className="flex flex-col flex-1 min-w-0">
                {/* Title */}
                <h3 className="text-gray-900 font-semibold text-lg line-clamp-2 break-words leading-tight mb-2">
                    {title}
                </h3>

                {/* Address */}
                <div className="flex items-start gap-1 text-gray-500 mb-2">
                    <p className="line-clamp-1 text-sm">{address}</p>
                </div>

                {/* Area */}
                <div className="text-gray-600 text-sm mb-2">
                    Diện tích: {formatArea(area)}
                </div>

                {/* Price */}
                <div className="text-[#008DDA] font-bold text-xl mb-auto">
                    {formatPrice(price)}
                </div>

                {/* Time and Favorite - Bottom row */}
                <div className="flex items-center justify-between mt-2 pt-2">
                    <span className="text-gray-500 text-xs">
                        {formatRelativeTime(createdAt)}
                    </span>
                    {isLoggedIn && (
                        <button
                            onClick={handleFavoriteClick}
                            disabled={isLoading}
                            className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Heart
                                className={`w-5 h-5 ${
                                    isFavorite ? 'fill-red-500 text-red-500' : ''
                                }`}
                            />
                        </button>
                    )}
                </div>
            </div>
        </Link>
    );
};

