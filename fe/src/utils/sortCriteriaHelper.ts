/**
 * Convert sort criteria id to API format
 * @param id - Sort criteria id (e.g., "price_asc", "area_desc")
 * @returns Object with key and type for API or undefined if invalid
 */
export function getSortCriteriaValue(id: string): { key: string; type: string } | undefined {
    const mapping: Record<string, { key: string; type: string }> = {
        'price_asc': { key: 'price', type: 'ASC' },
        'price_desc': { key: 'price', type: 'DESC' },
        'area_asc': { key: 'area', type: 'ASC' },
        'area_desc': { key: 'area', type: 'DESC' },
    };
    
    return mapping[id];
}

/**
 * Convert API sort format back to criteria id
 * @param key - Sort key (e.g., "price", "area")
 * @param type - Sort type (e.g., "ASC", "DESC")
 * @returns Sort criteria id or undefined if invalid
 */
export function getSortCriteriaId(key: string, type: string): string | undefined {
    const mapping: Record<string, string> = {
        'price_ASC': 'price_asc',
        'price_DESC': 'price_desc',
        'area_ASC': 'area_asc',
        'area_DESC': 'area_desc',
    };
    
    return mapping[`${key}_${type}`];
}

