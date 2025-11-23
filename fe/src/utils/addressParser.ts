/**
 * Parse address string into components
 * Expected format: "Street Number/Detail, Ward/Commune, District, City"
 * Example: "123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh"
 */

export interface ParsedAddress {
    street: string;
    ward: string;
    district: string;
    city: string;
    fullAddress: string;
}

/**
 * Extract address components from a formatted address string
 * @param address - Full address string in format: "Street, Ward, District, City"
 * @returns ParsedAddress object with extracted components
 */
export const parseAddress = (address: string): ParsedAddress => {
    // Remove extra spaces and split by comma
    const parts = address
        .split(',')
        .map(part => part.trim())
        .filter(part => part.length > 0);

    // Default values
    const result: ParsedAddress = {
        street: '',
        ward: '',
        district: '',
        city: '',
        fullAddress: address
    };

    // Parse based on number of parts
    if (parts.length >= 4) {
        // Format: Street, Ward, District, City
        result.street = parts[0];
        result.ward = parts[1];
        result.district = parts[2];
        result.city = parts[3];
    } else if (parts.length === 3) {
        // Format: Street, District, City (no ward)
        result.street = parts[0];
        result.district = parts[1];
        result.city = parts[2];
    } else if (parts.length === 2) {
        // Format: Street, City (no ward, no district)
        result.street = parts[0];
        result.city = parts[1];
    } else if (parts.length === 1) {
        // Only one part, treat as street
        result.street = parts[0];
    }

    return result;
};

/**
 * Clean ward name by removing common prefixes
 * Example: "Phường Bến Nghé" -> "Bến Nghé"
 */
export const cleanWardName = (ward: string): string => {
    return ward
        .replace(/^Phường\s+/i, '')
        .replace(/^Xã\s+/i, '')
        .replace(/^Thị trấn\s+/i, '')
        .trim();
};

/**
 * Clean district name by removing common prefixes
 * Example: "Quận 1" -> "1"
 */
export const cleanDistrictName = (district: string): string => {
    return district
        .replace(/^Quận\s+/i, '')
        .replace(/^Huyện\s+/i, '')
        .replace(/^Thành phố\s+/i, '')
        .replace(/^Thị xã\s+/i, '')
        .trim();
};

/**
 * Clean city name by removing common prefixes
 * Example: "TP. Hồ Chí Minh" -> "Hồ Chí Minh"
 */
export const cleanCityName = (city: string): string => {
    return city
        .replace(/^TP\.\s*/i, '')
        .replace(/^Thành phố\s+/i, '')
        .replace(/^Tỉnh\s+/i, '')
        .trim();
};

/**
 * Parse address and return cleaned components
 */
export const parseAndCleanAddress = (address: string): ParsedAddress => {
    const parsed = parseAddress(address);
    
    return {
        ...parsed,
        ward: cleanWardName(parsed.ward),
        district: cleanDistrictName(parsed.district),
        city: cleanCityName(parsed.city)
    };
};

/**
 * Extract street number from street string
 * Example: "123 Nguyễn Huệ" -> { number: "123", name: "Nguyễn Huệ" }
 */
export const extractStreetInfo = (street: string): { number: string; name: string } => {
    // Match patterns like "123", "12/34", "123A", etc. at the beginning
    const match = street.match(/^([\d/]+[A-Za-z]?)\s+(.+)$/);

    if (match) {
        return {
            number: match[1],
            name: match[2]
        };
    }
    
    // No number found, return entire string as name
    return {
        number: '',
        name: street
    };
};

