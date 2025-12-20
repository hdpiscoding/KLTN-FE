import type { AmenityCategory } from '@/types/amenity.d.ts';
import {
    Hospital,
    GraduationCap,
    Bus,
    TreePine,
    ShieldCheck,
    ShoppingCart,
    Popcorn,
    type LucideIcon
} from 'lucide-react';

/**
 * Amenity category configurations
 */
export interface AmenityCategoryConfig {
    id: AmenityCategory;
    label: string;
    color: string;
    icon: LucideIcon;
    description: string;
}

export const AMENITY_CATEGORIES: Record<AmenityCategory, AmenityCategoryConfig> = {
    healthcare: {
        id: 'healthcare',
        label: 'Y tế',
        color: '#ef4444', // Red
        icon: Hospital,
        description: 'Bệnh viện, phòng khám, nhà thuốc',
    },
    education: {
        id: 'education',
        label: 'Giáo dục',
        color: '#8b5cf6', // Purple
        icon: GraduationCap,
        description: 'Trường học, trung tâm đào tạo',
    },
    transportation: {
        id: 'transportation',
        label: 'Giao thông',
        color: '#eab308', // Orange
        icon: Bus,
        description: 'Ga xe, bến xe, trạm xe buýt',
    },
    environment: {
        id: 'environment',
        label: 'Môi trường',
        color: '#14b8a6', // Teal
        icon: TreePine,
        description: 'Công viên, khu vui chơi',
    },
    public_safety: {
        id: 'public_safety',
        label: 'An ninh',
        color: '#f97316', // Orange
        icon: ShieldCheck,
        description: 'Công an, cảnh sát, cứu hỏa',
    },
    shopping: {
        id: 'shopping',
        label: 'Tiện ích',
        color: '#22c55e', // Green
        icon: ShoppingCart,
        description: 'Siêu thị, cửa hàng, chợ',
    },
    entertainment: {
        id: 'entertainment',
        label: 'Giải trí',
        color: '#ec4899', // Pink
        icon: Popcorn,
        description: 'Rạp phim, khu vui chơi giải trí',
    },
};

/**
 * Default filter state (all enabled)
 */
export const DEFAULT_AMENITY_FILTER_STATE = {
    healthcare: true,
    education: true,
    transportation: true,
    environment: true,
    public_safety: true,
    shopping: true,
    entertainment: true,
};

/**
 * Limit for amenities per category
 */
export const AMENITIES_LIMIT_PER_CATEGORY = 200;

