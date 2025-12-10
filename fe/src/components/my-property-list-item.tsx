import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { formatPrice, formatArea, formatDateTime } from "@/utils/generalFormat.ts";
import { cn } from "@/lib/utils";

type PropertyStatus = "Đang hiển thị" | "Chờ duyệt" | "Đã gỡ" | "Không duyệt" | "Hết hạn";

interface MyPropertyListItemProps {
    id: string;
    title: string;
    price: number;
    area: number;
    address: string;
    imageUrl: string;
    createdAt: string;
    status: PropertyStatus;
    code?: string;
    onDelete?: (id: string) => void;
}

const getStatusStyles = (status: PropertyStatus) => {
    switch (status) {
        case "Đang hiển thị":
            return "bg-green-100 text-green-700 border-green-300";
        case "Chờ duyệt":
            return "bg-yellow-100 text-yellow-700 border-yellow-300";
        case "Đã gỡ":
            return "bg-gray-100 text-gray-700 border-gray-300";
        case "Không duyệt":
            return "bg-red-100 text-red-700 border-red-300";
        default:
            return "bg-gray-100 text-gray-700 border-gray-300";
    }
};

export const MyPropertyListItem = ({
    id,
    title,
    price,
    area,
    address,
    imageUrl,
    createdAt,
    status,
    code,
    onDelete,
}: MyPropertyListItemProps) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation to edit page
        e.stopPropagation();
        if (onDelete) {
            onDelete(id);
        }
    };

    return (
        <div
            className="group flex gap-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-3 relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Delete Button - Top Right */}
            <button
                onClick={handleDeleteClick}
                className="cursor-pointer absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 hover:bg-red-500 text-gray-600 hover:text-white transition-all duration-200 shadow-md hover:shadow-lg group/delete"
                title="Xóa tin đăng"
            >
                <Trash2 className="w-5 h-5" />
            </button>

            {/* Clickable Link Area */}
            <Link
                to={`/bat-dong-san/${id}/chinh-sua`}
                className="flex gap-4 flex-1"
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
                    {/* Status Tag on Image */}
                    <div className="absolute top-2 left-2">
                        <span className={cn(
                            "text-xs font-semibold px-2 py-1 rounded-md border",
                            getStatusStyles(status)
                        )}>
                            {status}
                        </span>
                    </div>
                </div>

                {/* Content Container - Right side */}
                <div className="flex flex-col flex-1 min-w-0">
                {/* Code */}
                {code && (
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-mono tracking-wide px-2 py-1 rounded bg-gray-100 text-gray-600 border border-gray-200">Mã: {code}</span>
                    </div>
                )}
                {/* Title */}
                <h3 className="text-gray-900 font-semibold text-lg line-clamp-2 break-words leading-tight mb-2">
                    {title}
                </h3>

                {/* Address */}
                <div className="flex items-start gap-1 text-gray-500 mb-2">
                    <p className="line-clamp-1 text-sm">{address}</p>
                </div>

                {/* Price & Area on same line */}
                <div className="flex items-center gap-5 text-sm mb-2">
                    <span className="text-[#008DDA] font-bold text-lg">{formatPrice(price)}</span>
                    <span className="text-gray-600">{formatArea(area)}</span>
                </div>

                {/* Date Time - Bottom row */}
                <div className="flex flex-wrap gap-3 mt-auto pt-2">
                    <span className="text-gray-500 text-xs">Ngày đăng: {formatDateTime(createdAt)}</span>
                </div>
            </div>
            </Link>
        </div>
    );
};
