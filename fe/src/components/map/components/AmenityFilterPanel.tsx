import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
// Removed missing RadioGroup imports
import type {
  AmenityCategory,
  AmenityFilterState,
  SpecialIndicatorType,
} from "@/types/amenity.d.ts";
import { AMENITY_CATEGORIES } from "@/components/map";
import { ChevronDown, ChevronUp, Layers } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface AmenityFilterPanelProps {
  filterState: AmenityFilterState;
  onFilterChange: (category: AmenityCategory, enabled: boolean) => void;
  amenityCounts?: Partial<Record<AmenityCategory, number>>;
  // New props for special indicators
  activeIndicator: SpecialIndicatorType;
  onIndicatorChange: (type: SpecialIndicatorType) => void;
}

export const AmenityFilterPanel: React.FC<AmenityFilterPanelProps> = ({
  filterState,
  onFilterChange,
  amenityCounts = {},
  activeIndicator,
  onIndicatorChange,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const categories = Object.values(AMENITY_CATEGORIES);

  // Calculate active filters count
  const activeFiltersCount = React.useMemo(() => {
    const amenityCount = Object.values(filterState).filter(Boolean).length;
    const indicatorCount = activeIndicator ? 1 : 0;
    return amenityCount + indicatorCount;
  }, [filterState, activeIndicator]);

  const renderRadioItem = (
    value: SpecialIndicatorType | "none",
    label: string,
    color?: string
  ) => {
    const isChecked =
      value === "none" ? activeIndicator === null : activeIndicator === value;
    const id = `ind-${value}`;

    return (
      <div
        className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer transition-colors"
        onClick={() => onIndicatorChange(value === "none" ? null : value)}
      >
        {/* Sử dụng Checkbox thay cho input radio để đồng bộ giao diện hình vuông */}
        <Checkbox
          id={id}
          checked={isChecked}
          onCheckedChange={() =>
            onIndicatorChange(value === "none" ? null : value)
          }
          // Ngăn chặn sự kiện nổi bọt để tránh kích hoạt 2 lần nếu click trực tiếp vào checkbox
          onClick={(e) => e.stopPropagation()}
        />
        <label
          htmlFor={id}
          className="flex-1 cursor-pointer flex items-center gap-2"
        >
          {/* Render color dot before text to match Amenity style */}
          {color && (
            <span
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: color }}
            />
          )}
          <span className="text-sm font-medium text-gray-700 flex-1">
            {label}
          </span>
        </label>
      </div>
    );
  };

  return (
    <div className="absolute top-2 md:top-16 right-4 bg-white rounded-lg shadow-lg border border-gray-200 z-[1000] overflow-hidden min-w-[280px]">
      {/* Header */}
      <div
        className="min-h-12 px-4 py-3 border-b border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#008DDA]" />
          <h3 className="font-semibold text-sm text-gray-800">Lớp bản đồ</h3>
          {activeFiltersCount > 0 && (
            <span className="bg-[#008DDA] text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="max-h-[80vh] overflow-y-auto">
          {/* Special Indicators Section */}
          <div className="p-3">
            <div className="flex items-center gap-2 mb-2 px-1">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Chỉ số đặc biệt (Biểu đồ nhiệt)
              </span>
            </div>

            <div className="space-y-1">
              {renderRadioItem("none", "Không hiển thị")}
              {renderRadioItem("flood", "Ngập lụt", "#3b82f6")}
              {renderRadioItem("accident", "An ninh / Tai nạn", "#ef4444")}
              {renderRadioItem("project", "Tiềm năng / Dự án", "#22c55e")}
            </div>
          </div>

          <Separator />

          {/* Amenities Section */}
          <div className="p-3">
            <div className="flex items-center gap-2 mb-2 px-1">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Tiện ích xung quanh
              </span>
            </div>
            <div className="space-y-1">
              {categories.map((category) => {
                const count = amenityCounts[category.id] || 0;
                const isChecked = filterState[category.id];

                return (
                  <div
                    key={category.id}
                    className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 transition-colors"
                  >
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
                        <span className="text-xs text-gray-500 font-normal bg-gray-100 px-1.5 py-0.5 rounded-full">
                          {count}
                        </span>
                      )}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
