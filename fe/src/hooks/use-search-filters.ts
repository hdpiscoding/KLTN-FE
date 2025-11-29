import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { getDistrictNameById, getDistrictIdByName } from "@/utils/districtHelper";
import { getPriceRangeValue, getPriceRangeId } from "@/utils/priceRangeHelper";

export type Operator = "eq" | "gt" | "lt" | "gte" | "lte" | "lk" | "rng";

export interface FilterItem {
    key: string;
    operator: Operator;
    value: string;
}

export const useSearchFilters = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Parse URL → FilterItem[]
    // Convert district.id (từ URL) sang district.name (cho API)
    const filters = useMemo<FilterItem[]>(() => {
        const result: FilterItem[] = [];

        searchParams.forEach((value, fullKey) => {
            const parts = fullKey.split("_");

            if (parts.length < 2) return; // skip invalid format

            const operator = parts.pop() as Operator;
            const key = parts.join("_");

            // Nếu là addressDistrict, convert id → name
            let finalValue = value;
            if (key === "addressDistrict") {
                const districtName = getDistrictNameById(value);
                if (districtName) {
                    finalValue = districtName;
                }
            }

            // Nếu là price với operator rng, convert id → min-max
            if (key === "price" && operator === "rng") {
                const priceRange = getPriceRangeValue(value);
                if (priceRange) {
                    finalValue = priceRange;
                }
            }

            result.push({
                key,
                operator,
                value: finalValue,
            });
        });

        return result;
    }, [searchParams]);

    // Add or update a filter: key_operator = value
    // Convert district.name (từ code) sang district.id (cho URL)
    const setFilter = useCallback(
        (key: string, operator: Operator, value: string | number) => {
            const params = new URLSearchParams(searchParams);

            const fullKey = `${key}_${operator}`;

            if (value === "" || value === null || value === undefined) {
                params.delete(fullKey);
            } else {
                // Nếu là addressDistrict, convert name → id trước khi set vào URL
                let finalValue = String(value);
                if (key === "addressDistrict") {
                    const districtId = getDistrictIdByName(String(value));
                    if (districtId) {
                        finalValue = districtId;
                    }
                }

                // Nếu là price với operator rng, convert min-max → id trước khi set vào URL
                if (key === "price" && operator === "rng") {
                    const priceRangeId = getPriceRangeId(String(value));
                    if (priceRangeId) {
                        finalValue = priceRangeId;
                    }
                }

                params.set(fullKey, finalValue);
            }

            setSearchParams(params);
        },
        [searchParams, setSearchParams]
    );

    // Remove a filter
    const removeFilter = useCallback(
        (key: string, operator: Operator) => {
            const params = new URLSearchParams(searchParams);
            params.delete(`${key}_${operator}`);
            setSearchParams(params);
        },
        [searchParams, setSearchParams]
    );

    // Clear every filter
    const clearFilters = useCallback(() => {
        const params = new URLSearchParams(searchParams);

        filters.forEach((f) => {
            params.delete(`${f.key}_${f.operator}`);
        });

        setSearchParams(params);
    }, [searchParams, filters, setSearchParams]);

    return {
        filters,
        setFilter,
        removeFilter,
        clearFilters,
    };
};
