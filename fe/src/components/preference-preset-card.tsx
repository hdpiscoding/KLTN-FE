import React from 'react';
import { Shield, Heart, GraduationCap, ShoppingBag, Car, Leaf, Music } from 'lucide-react';
import { cn } from '@/lib/utils';
import type {PreferencePreset} from "@/types/preference-preset";

export interface PreferencePresetCardProps {
    preset: PreferencePreset;
    isSelected?: boolean;
    onSelect?: () => void;
}

const preferenceConfig = [
    {
        key: 'preferenceSafety' as keyof PreferencePreset,
        label: 'An ninh',
        icon: Shield,
        color: 'bg-blue-100 text-blue-600',
        barColor: 'bg-blue-500'
    },
    {
        key: 'preferenceHealthcare' as keyof PreferencePreset,
        label: 'Y tế',
        icon: Heart,
        color: 'bg-red-100 text-red-600',
        barColor: 'bg-red-500'
    },
    {
        key: 'preferenceEducation' as keyof PreferencePreset,
        label: 'Giáo dục',
        icon: GraduationCap,
        color: 'bg-purple-100 text-purple-600',
        barColor: 'bg-purple-500'
    },
    {
        key: 'preferenceShopping' as keyof PreferencePreset,
        label: 'Tiện ích',
        icon: ShoppingBag,
        color: 'bg-green-100 text-green-600',
        barColor: 'bg-green-500'
    },
    {
        key: 'preferenceTransportation' as keyof PreferencePreset,
        label: 'Giao thông',
        icon: Car,
        color: 'bg-yellow-100 text-yellow-600',
        barColor: 'bg-yellow-500'
    },
    {
        key: 'preferenceEnvironment' as keyof PreferencePreset,
        label: 'Môi trường',
        icon: Leaf,
        color: 'bg-teal-100 text-teal-600',
        barColor: 'bg-teal-500'
    },
    {
        key: 'preferenceEntertainment' as keyof PreferencePreset,
        label: 'Giải trí',
        icon: Music,
        color: 'bg-pink-100 text-pink-600',
        barColor: 'bg-pink-500'
    },
];

export const PreferencePresetCard: React.FC<PreferencePresetCardProps> = ({
    preset,
    isSelected = false,
    onSelect,
}) => {
    return (
        <div
            onClick={onSelect}
            className={cn(
                "bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 cursor-pointer group",
                "hover:shadow-xl hover:-translate-y-1",
                isSelected && "ring-4 ring-[#008DDA] shadow-xl"
            )}
        >
            {/* Header with Image */}
            <div className="relative h-40 overflow-hidden">
                <img
                    src={preset.image}
                    alt={preset.name}
                    className="w-full h-full object-cover"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                {/* Preset Name */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-xl font-bold text-white drop-shadow-lg">
                        {preset.name}
                    </h3>
                </div>

                {/* Selected Badge */}
                {isSelected && (
                    <div className="absolute top-3 right-3 bg-[#008DDA] text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                        ✓ Đã chọn
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed min-h-[60px]">
                    {preset.description}
                </p>

                {/* Preferences Overview */}
                <div className="space-y-3 pt-2 border-t">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        Ưu tiên của mẫu này:
                    </h4>

                    {preferenceConfig.map((config) => {
                        const value = preset[config.key] as number;
                        const Icon = config.icon;

                        return (
                            <div key={config.key} className="space-y-1.5">
                                {/* Label and Value */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0", config.color)}>
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">
                                            {config.label}
                                        </span>
                                    </div>
                                    <span className="text-xs font-semibold text-gray-500">
                                        {value}%
                                    </span>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={cn("h-full rounded-full transition-all duration-500", config.barColor)}
                                        style={{ width: `${value}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Action Indicator */}
                <div className="pt-2">
                    <div className={cn(
                        "text-center py-2 rounded-lg font-medium text-sm transition-colors duration-200",
                        isSelected
                            ? "bg-[#008DDA] text-white"
                            : "bg-gray-100 text-gray-600 group-hover:bg-[#008DDA] group-hover:text-white"
                    )}>
                        {isSelected ? "Đang sử dụng mẫu này" : "Chọn mẫu này"}
                    </div>
                </div>
            </div>
        </div>
    );
};

