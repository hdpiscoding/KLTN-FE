import React from 'react';
import { ChevronRight } from 'lucide-react';
import { PROPERTY_TYPES } from '@/constants/propertyTypes.ts';
import {useSearchFilters} from "@/hooks/use-search-filters.ts";

export const PropertyTypeFilter: React.FC = () => {
    const { filters, setFilter } = useSearchFilters();
    const currentType = filters.find(
        (f) => f.key === "propertyType" && f.operator === "eq"
    )
    const handleTypeClick = (type: typeof PROPERTY_TYPES[0]) => {
        setFilter('propertyType', 'eq', type.id);
    }
    return (
        <div className="flex flex-col p-5 bg-white rounded-lg shadow-md">
            <h2 className="font-semibold text-xl">Loại bất động sản</h2>
            <ul className="mt-4 space-y-2">
                {PROPERTY_TYPES.map((type) => {
                    const isActive = currentType?.value === type.id;
                    return (
                        <li
                            key={type.id}
                            onClick={() => handleTypeClick(type)}
                            className={`w-fit flex items-center gap-1 cursor-pointer transition-colors duration-100 ${
                                isActive ? 'text-[#008DDA] font-semibold' : 'hover:text-[#008DDA]'
                            }`}
                        >
                            <ChevronRight className="h-4 w-4"/>
                            {type.name}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}