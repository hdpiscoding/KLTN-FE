import React from 'react';
import {ChevronRight} from "lucide-react";

export const PropertyDistrictFilter: React.FC = () => {
    return (
        <div className="flex flex-col p-5 bg-white rounded-lg shadow-md">
            <h2 className="font-semibold text-xl">Bất động sản theo khu vực</h2>
            <ul className="mt-4 space-y-2">
                <li className="w-fit hover:text-[#008DDA] flex items-center gap-1 cursor-pointer transition-colors duration-100">
                    <ChevronRight className="h-4 w-4" />
                    Quận 1
                </li>
                <li className="w-fit hover:text-[#008DDA] flex items-center gap-1 cursor-pointer transition-colors duration-100">
                    <ChevronRight className="h-4 w-4" />
                    Quận 2 (TP. Thủ Đức)
                </li>
                <li className="w-fit hover:text-[#008DDA] flex items-center gap-1 cursor-pointer transition-colors duration-100">
                    <ChevronRight className="h-4 w-4" />
                    Quận 3
                </li>
                <li className="w-fit hover:text-[#008DDA] flex items-center gap-1 cursor-pointer transition-colors duration-100">
                    <ChevronRight className="h-4 w-4" />
                    Quận 4
                </li>
                <li className="w-fit hover:text-[#008DDA] flex items-center gap-1 cursor-pointer transition-colors duration-100">
                    <ChevronRight className="h-4 w-4" />
                    Quận 5
                </li>
                <li className="w-fit hover:text-[#008DDA] flex items-center gap-1 cursor-pointer transition-colors duration-100">
                    <ChevronRight className="h-4 w-4" />
                    Quận 6
                </li>
                <li className="w-fit hover:text-[#008DDA] flex items-center gap-1 cursor-pointer transition-colors duration-100">
                    <ChevronRight className="h-4 w-4" />
                    Quận 7
                </li>
                <li className="w-fit hover:text-[#008DDA] flex items-center gap-1 cursor-pointer transition-colors duration-100">
                    <ChevronRight className="h-4 w-4" />
                    Quận 8
                </li>
                <li className="w-fit hover:text-[#008DDA] flex items-center gap-1 cursor-pointer transition-colors duration-100">
                    <ChevronRight className="h-4 w-4" />
                    Quận 9 (TP. Thủ Đức)
                </li>
                <li className="w-fit hover:text-[#008DDA] flex items-center gap-1 cursor-pointer transition-colors duration-100">
                    <ChevronRight className="h-4 w-4" />
                    Quận 10
                </li>
                <li className="w-fit hover:text-[#008DDA] flex items-center gap-1 cursor-pointer transition-colors duration-100">
                    <ChevronRight className="h-4 w-4" />
                    Quận 11
                </li>
                <li className="w-fit hover:text-[#008DDA] flex items-center gap-1 cursor-pointer transition-colors duration-100">
                    <ChevronRight className="h-4 w-4" />
                    Quận 12
                </li>
                <li className="w-fit hover:text-[#008DDA] flex items-center gap-1 cursor-pointer transition-colors duration-100">
                    <ChevronRight className="h-4 w-4" />
                    Quận Thủ Đức (TP. Thủ Đức)
                </li>
                <li className="w-fit hover:text-[#008DDA] flex items-center gap-1 cursor-pointer transition-colors duration-100">
                    <ChevronRight className="h-4 w-4" />
                    Quận Bình Tân
                </li>
                <li className="w-fit hover:text-[#008DDA] flex items-center gap-1 cursor-pointer transition-colors duration-100">
                    <ChevronRight className="h-4 w-4" />
                    Quận Tân Bình
                </li>
                <li className="w-fit hover:text-[#008DDA] flex items-center gap-1 cursor-pointer transition-colors duration-100">
                    <ChevronRight className="h-4 w-4" />
                    Quận Tân Phú
                </li>
                <li className="w-fit hover:text-[#008DDA] flex items-center gap-1 cursor-pointer transition-colors duration-100">
                    <ChevronRight className="h-4 w-4" />
                    Quận Bình Thạnh
                </li>
                <li className="w-fit hover:text-[#008DDA] flex items-center gap-1 cursor-pointer transition-colors duration-100">
                    <ChevronRight className="h-4 w-4" />
                    Quận Phú Nhuận
                </li>
                <li className="w-fit hover:text-[#008DDA] flex items-center gap-1 cursor-pointer transition-colors duration-100">
                    <ChevronRight className="h-4 w-4" />
                    Quận Gò Vấp
                </li>
                <li className="w-fit hover:text-[#008DDA] flex items-center gap-1 cursor-pointer transition-colors duration-100">
                    <ChevronRight className="h-4 w-4" />
                    Huyện Hóc Môn
                </li>
                <li className="w-fit hover:text-[#008DDA] flex items-center gap-1 cursor-pointer transition-colors duration-100">
                    <ChevronRight className="h-4 w-4" />
                    Huyện Củ Chi
                </li>
                <li className="w-fit hover:text-[#008DDA] flex items-center gap-1 cursor-pointer transition-colors duration-100">
                    <ChevronRight className="h-4 w-4" />
                    Huyện Nhà Bè
                </li>
                <li className="w-fit hover:text-[#008DDA] flex items-center gap-1 cursor-pointer transition-colors duration-100">
                    <ChevronRight className="h-4 w-4" />
                    Huyện Cần Giờ
                </li>
                <li className="w-fit hover:text-[#008DDA] flex items-center gap-1 cursor-pointer transition-colors duration-100">
                    <ChevronRight className="h-4 w-4" />
                    Huyện Bình Chánh
                </li>
            </ul>
        </div>
    )
}