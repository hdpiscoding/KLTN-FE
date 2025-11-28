import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export type Operator = "eq" | "gt" | "lt" | "gte" | "lte" | "lk";

export interface FilterItem {
    key: string;
    operator: Operator;
    value: string;
}

export const useSearchFilters = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Parse URL → FilterItem[]
    const filters = useMemo<FilterItem[]>(() => {
        const result: FilterItem[] = [];

        searchParams.forEach((value, fullKey) => {
            const parts = fullKey.split("_");

            if (parts.length < 2) return; // skip invalid format

            const operator = parts.pop() as Operator;
            const key = parts.join("_");

            result.push({
                key,
                operator,
                value,
            });
        });

        return result;
    }, [searchParams]);

    // Add or update a filter: key_operator = value
    const setFilter = useCallback(
        (key: string, operator: Operator, value: string | number) => {
            const params = new URLSearchParams(searchParams);

            const fullKey = `${key}_${operator}`;

            if (value === "" || value === null || value === undefined) {
                params.delete(fullKey);
            } else {
                params.set(fullKey, String(value));
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
