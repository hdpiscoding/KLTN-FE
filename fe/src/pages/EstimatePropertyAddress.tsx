import React, {useState, useEffect, useRef, useCallback} from 'react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useNavigate} from "react-router-dom";
import { MapPin, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDebounce } from 'use-debounce';
import {toast} from "react-toastify";
import type {PlacePrediction} from "@/types/place-prediction";
import {getPlaceDetails, placeAutocomplete} from "@/services/goongAPI.ts";

export const EstimatePropertyAddress: React.FC = () => {
    const navigate = useNavigate();
    const [lat, setLat] = useState<number | null>(null);
    const [lon, setLon] = useState<number | null>(null);
    const [suggestions, setSuggestions] = useState<PlacePrediction[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const suggestionRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const lastTrimmedAddressRef = useRef<string>('');

    const form = useForm({
        defaultValues: {
            address: ""
        },
        mode: "onSubmit",
    });

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node) &&
                inputRef.current && !inputRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Watch address value
    const addressValue = form.watch('address');

    // Debounce address value with 300ms delay
    const [debouncedAddress] = useDebounce(addressValue, 300);

    const fetchAutocompleteSuggestions = useCallback(async (input: string) => {
        setIsLoading(true);
        try {
            const data = await placeAutocomplete(input, 10);

            if (data.predictions && data.predictions.length > 0) {
                console.log('Autocomplete suggestions:', data.predictions[0]);
                setSuggestions(data.predictions);
                setShowSuggestions(true);
                setSelectedIndex(-1);
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        } catch (error) {
            console.error('Error fetching autocomplete:', error);
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Fetch autocomplete suggestions when debounced address changes
    useEffect(() => {
        // Trim whitespace to check actual content length
        const trimmedAddress = debouncedAddress.trim();

        // Don't call API if empty, only whitespace, or less than 3 characters
        if (!trimmedAddress || trimmedAddress.length < 3) {
            setSuggestions([]);
            setShowSuggestions(false);
            lastTrimmedAddressRef.current = ''; // Reset when clearing
            return;
        }

        // Don't call API if trimmed address hasn't changed (e.g., "abc" -> "abc ")
        if (trimmedAddress === lastTrimmedAddressRef.current) {
            return;
        }

        // Update last trimmed address and call API
        lastTrimmedAddressRef.current = trimmedAddress;
        fetchAutocompleteSuggestions(trimmedAddress);
    }, [debouncedAddress, fetchAutocompleteSuggestions]);

    const fetchPlaceDetail = async (placeId: string) => {
        setIsLoading(true);
        try {
            const data = await getPlaceDetails(placeId);

            if (data.result && data.result.geometry && data.result.geometry.location) {
                const { lat, lng } = data.result.geometry.location;
                setLat(lat);
                setLon(lng);
                return { lat, lng };
            }
        } catch (error) {
            console.error('Error fetching place details:', error);
            alert('Không thể lấy tọa độ của địa chỉ này');
        } finally {
            setIsLoading(false);
        }
        return null;
    };

    const handleSelectSuggestion = async (prediction: PlacePrediction) => {
        form.setValue('address', prediction.description);
        setShowSuggestions(false);
        setSuggestions([]);

        // Fetch place details to get coordinates
        await fetchPlaceDetail(prediction.place_id);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!showSuggestions || suggestions.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev < suggestions.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
                break;
            case 'Enter':
                if (selectedIndex >= 0) {
                    e.preventDefault();
                    handleSelectSuggestion(suggestions[selectedIndex]);
                }
                break;
            case 'Escape':
                setShowSuggestions(false);
                break;
        }
    };

    const onSubmit = async (data: { address: string }) => {
        if (!lat || !lon) {
            toast.error('Vui lòng chọn địa chỉ chính xác');
            return;
        }

        navigate(`/dinh-gia-nha/ban-do?lat=${lat}&lon=${lon}&address=${encodeURIComponent(data.address)}`);
    };

    return (
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg p-8 sm:p-10 w-full max-w-2xl">
                <div className="flex flex-col gap-8">
                    <div className="w-full text-center">
                        <h2 className="text-3xl sm:text-4xl font-semibold">ĐỊNH GIÁ NHÀ</h2>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="address"
                                rules={{
                                    required: "Địa chỉ không được để trống!",
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">Địa chỉ của bạn</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    className="focus-visible:ring-[#008DDA] h-11"
                                                    placeholder="Nhập địa chỉ của bạn (VD: 123 Nguyễn Huệ, Phường 1, Quận 1)"
                                                    {...field}
                                                    ref={(e) => {
                                                        field.ref(e);
                                                        inputRef.current = e;
                                                    }}
                                                    onKeyDown={handleKeyDown}
                                                    autoComplete="off"
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        // Reset coordinates when user manually changes address
                                                        if (lat || lon) {
                                                            setLat(null);
                                                            setLon(null);
                                                        }
                                                    }}
                                                />

                                                {/* Loading indicator */}
                                                {isLoading && (
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                        <Loader2 className="w-5 h-5 animate-spin text-[#008DDA]" />
                                                    </div>
                                                )}

                                                {/* Autocomplete suggestions dropdown */}
                                                {showSuggestions && suggestions.length > 0 && (
                                                    <div
                                                        ref={suggestionRef}
                                                        className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto"
                                                    >
                                                        {suggestions.map((prediction, index) => (
                                                            <div
                                                                key={prediction.place_id}
                                                                onClick={() => handleSelectSuggestion(prediction)}
                                                                className={cn(
                                                                    "flex items-start gap-3 p-3 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0",
                                                                    selectedIndex === index
                                                                        ? "bg-blue-50"
                                                                        : "hover:bg-gray-50"
                                                                )}
                                                            >
                                                                <MapPin className="w-5 h-5 text-[#008DDA] flex-shrink-0 mt-0.5" />
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-medium text-gray-900">
                                                                        {prediction.structured_formatting.main_text}
                                                                    </p>
                                                                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                                                                        {prediction.structured_formatting.secondary_text}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full h-11 transition-colors duration-200 bg-[#008DDA] cursor-pointer hover:bg-[#0064A6]"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Đang xử lý...
                                    </>
                                ) : (
                                    'Tiếp tục'
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
};