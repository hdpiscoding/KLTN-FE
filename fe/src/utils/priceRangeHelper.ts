import { PRICE_RANGES } from '@/constants/priceRanges';

/**
 * Convert price range id to min-max format
 * @param id - Price range id (e.g., "500m-1b")
 * @returns Format "min-max" (e.g., "500000000-1000000000") or undefined if invalid
 */
export function getPriceRangeValue(id: string): string | undefined {
    const ranges: Record<string, string> = {
        'duoi-500-trieu': '0-500000000',
        '500-trieu-den-1-ty': '500000000-1000000000',
        '1-ty-den-5-ty': '1000000000-5000000000',
        '5-ty-den-10-ty': '5000000000-10000000000',
        '10-ty-den-20-ty': '10000000000-20000000000',
        'tren-20-ty': '20000000000-999999999999',
    };
    
    return ranges[id];
}

/**
 * Convert price range value (min-max) back to id
 * @param value - Format "min-max" (e.g., "500000000-1000000000")
 * @returns Price range id (e.g., "500m-1b") or undefined if invalid
 */
export function getPriceRangeId(value: string): string | undefined {
    const ranges: Record<string, string> = {
        '0-500000000': 'duoi-500-trieu',
        '500000000-1000000000': '500-trieu-den-1-ty',
        '1000000000-5000000000': '1-ty-den-5-ty',
        '5000000000-10000000000': '5-ty-den-10-ty',
        '10000000000-20000000000': '10-ty-den-20-ty',
        '20000000000-999999999999': 'tren-20-ty',
    };
    
    return ranges[value];
}

/**
 * Check if price range id is valid
 */
export function isValidPriceRangeId(id: string): boolean {
    return PRICE_RANGES.some(range => range.id === id);
}

