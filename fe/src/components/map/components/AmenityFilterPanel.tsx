import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { AmenityCategory, AmenityFilterState } from '@/types/amenity.d.ts';
import { AMENITY_CATEGORIES } from '../constants/amenityConstants';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AmenityFilterPanelProps {
    filterState: AmenityFilterState;
    onFilterChange: (category: AmenityCategory, enabled: boolean) => void;
    amenityCounts?: Partial<Record<AmenityCategory, number>>;
}

export const AmenityFilterPanel: React.FC<AmenityFilterPanelProps> = ({
    filterState,
    onFilterChange,
    amenityCounts = {},
}) => {
    const [isExpanded, setIsExpanded] = React.useState(true);

    const categories = Object.values(AMENITY_CATEGORIES);

    return (
        <div className="absolute top-12 right-4 bg-white rounded-lg shadow-lg border border-gray-200 z-20 overflow-hidden w-[100px] md:w-[200px] lg:w-[300px]">
            {/* Header */}
            <div
                className="px-4 py-3 border-b border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <h3 className="font-semibold text-sm text-gray-800">Tiện ích xung quanh</h3>
                {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
            </div>

            {/* Filter options */}
            {isExpanded && (
                <div className="p-3 space-y-2 max-h-[400px] overflow-y-auto">
                    {categories.map((category) => {
                        const count = amenityCounts[category.id] || 0;
                        const isChecked = filterState[category.id];

                        return (
                            <div key={category.id} className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 transition-colors">
                                <Checkbox
                                    id={`amenity-${category.id}`}
                                    checked={isChecked}
                                    onCheckedChange={(checked: boolean) => {
                                        onFilterChange(category.id, checked);
                                    }}
                                />
                                <Label
                                    htmlFor={`amenity-${category.id}`}
                                    className="flex-1 cursor-pointer flex items-center gap-2"
                                >
                                    <span
                                        className="w-3 h-3 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: category.color }}
                                    />
                                    <span className="text-sm font-medium text-gray-700 flex-1">
                                        {category.label}
                                    </span>
                                    {count > 0 && (
                                        <span className="text-xs text-gray-500 font-normal">
                                            ({count})
                                        </span>
                                    )}
                                </Label>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Help text */}
            {isExpanded && (
                <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                        Chọn loại tiện ích để hiển thị trên bản đồ
                    </p>
                </div>
            )}
        </div>
    );
};

