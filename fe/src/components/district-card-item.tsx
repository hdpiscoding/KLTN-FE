import React from 'react';

interface DistrictCardViewProps {
    name: string;
    postCount: number;
    imageUrl: string;
}

export const DistrictCardItem: React.FC<DistrictCardViewProps> = ({
    name,
    postCount,
    imageUrl,
}) => {
    return (
        <div className="relative w-full h-[200px] overflow-hidden rounded-lg group cursor-pointer">
            {/* Background Image with overlay */}
            <div className="absolute inset-0">
                <img
                    src={imageUrl}
                    alt={`${name} District`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            </div>

            {/* Content */}
            <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold mb-1">
                    {name}
                </h3>
                <p className="text-sm text-gray-200">
                    {postCount.toLocaleString()} bài đăng
                </p>
            </div>
        </div>
    );
};
