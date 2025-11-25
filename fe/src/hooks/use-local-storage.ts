import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
    const [value, setValue] = useState<T>(() => {
        try {
            const json = localStorage.getItem(key);
            return json ? (JSON.parse(json) as T) : initialValue;
        } catch (error) {
            console.error("Error reading localStorage", error);
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error("Error setting localStorage", error);
        }
    }, [key, value]);

    useEffect(() => {
        const handler = (e: StorageEvent) => {
            if (e.key === key) {
                if (e.newValue === null) {
                    setValue(initialValue);
                } else {
                    setValue(JSON.parse(e.newValue));
                }
            }
        };
        window.addEventListener("storage", handler);
        return () => window.removeEventListener("storage", handler);
    }, [key, initialValue]);

    const remove = () => {
        try {
            localStorage.removeItem(key);
            setValue(initialValue);
        } catch (error) {
            console.error("Error removing from localStorage", error);
        }
    };

    return { value, setValue, remove } as const;
}