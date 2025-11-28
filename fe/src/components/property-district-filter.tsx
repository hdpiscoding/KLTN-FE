import React from 'react';
import {ChevronRight} from "lucide-react";
import {DISTRICTS} from "@/constants/districts.ts";

export const PropertyDistrictFilter: React.FC = () => {
    return (
        <div className="flex flex-col p-5 bg-white rounded-lg shadow-md">
            <h2 className="font-semibold text-xl">Bất động sản theo khu vực</h2>
            <ul className="mt-4 space-y-2">
                {DISTRICTS.map((district) => (
                    <li
                        key={district.id}
                        className="w-fit hover:text-[#008DDA] flex items-center gap-1 cursor-pointer transition-colors duration-100"
                    >
                        <ChevronRight className="h-4 w-4" />
                        {district.name}
                    </li>
                ))}
            </ul>
        </div>
    )
}