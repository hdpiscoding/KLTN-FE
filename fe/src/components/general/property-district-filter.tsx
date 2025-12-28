import React from 'react';
import {ChevronRight} from "lucide-react";
import {DISTRICTS} from "@/constants/districts.ts";
import {useSearchFilters} from "@/hooks/use-search-filters.ts";

export const PropertyDistrictFilter: React.FC = () => {
    const { filters, setFilter } = useSearchFilters();
    const currentDistrict = filters.find(
        (f) => f.key === "addressDistrict" && f.operator === "eq"
    );

    const handleDistrictClick = (district: typeof DISTRICTS[0]) => {
        setFilter('addressDistrict', 'eq', district.name);
    };

    return (
        <div className="flex flex-col p-5 bg-white rounded-lg shadow-md">
            <h2 className="font-semibold text-xl">Bất động sản theo khu vực</h2>
            <ul className="mt-4 space-y-2">
                {DISTRICTS.map((district) => {
                    const isActive = currentDistrict?.value === district.name;
                    return (
                        <li
                            key={district.id}
                            onClick={() => handleDistrictClick(district)}
                            className={`w-fit flex items-center gap-1 cursor-pointer transition-colors duration-100 ${
                                isActive ? 'text-[#008DDA] font-semibold' : 'hover:text-[#008DDA]'
                            }`}
                        >
                            <ChevronRight className="h-4 w-4" />
                            {district.name}
                        </li>
                    );
                })}
            </ul>
        </div>
    )
}