import React from 'react';
import { ChevronRight } from 'lucide-react';

export const PropertyTypeFilter: React.FC = () => {
    return (
        <div className="flex flex-col p-5 bg-white rounded-lg shadow-md">
            <h2 className="font-semibold text-xl">Loại bất động sản</h2>
            <ul className="mt-4 space-y-2">
                <li className="w-fit hover:text-[#008DDA] flex items-center gap-1 cursor-pointer transition-colors duration-100">
                    <ChevronRight className="h-4 w-4" />
                    Nhà
                </li>
                <li className="w-fit hover:text-[#008DDA] flex items-center gap-1 cursor-pointer transition-colors duration-100">
                    <ChevronRight className="h-4 w-4" />
                    Căn hộ
                </li>
                <li className="w-fit hover:text-[#008DDA] flex items-center gap-1 cursor-pointer transition-colors duration-100">
                    <ChevronRight className="h-4 w-4" />
                    Biệt thự
                </li>
                <li className="w-fit hover:text-[#008DDA] flex items-center gap-1 cursor-pointer transition-colors duration-100">
                    <ChevronRight className="h-4 w-4" />
                    Mặt bằng
                </li>
            </ul>
        </div>
    )
}