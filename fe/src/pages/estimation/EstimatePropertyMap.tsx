import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button.tsx";
import {useNavigate, useSearchParams} from "react-router-dom";
import DraggableMarkerMap from "@/components/map/draggable-marker-map.tsx";
import type { Location } from "@/types/location.d.ts";
import { AlertCircle } from 'lucide-react';
import {MAX_DISTANCE_METERS} from "@/constants/mapConstants.ts";
import {calculateDistance} from "@/utils/calculateDistance.ts";
import {useEstimationStore} from "@/store/estimationStore.ts";

export const EstimatePropertyMap: React.FC = () => {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const { setEstimationData } = useEstimationStore();

    const originalLocation = useMemo(() => ({
        latitude: parseFloat(params.get("lat") ?? ""),
        longitude: parseFloat(params.get("lon") ?? ""),
        address: params.get("address") ?? ""
    }), [params]);

    const [currentLocation, setCurrentLocation] = useState<Location>({
        latitude: parseFloat(params.get("lat") ?? ""),
        longitude: parseFloat(params.get("lon") ?? ""),
        address: params.get("address") ?? ""
    });

    // Calculate distance from original location
    const distanceFromOriginal = useMemo(() => {
        return calculateDistance(
            originalLocation.latitude,
            originalLocation.longitude,
            currentLocation.latitude,
            currentLocation.longitude
        );
    }, [originalLocation, currentLocation]);

    // Check if location is valid
    const isLocationValid = distanceFromOriginal <= MAX_DISTANCE_METERS;

    const handleLocationChange = (newLocation: Location) => {
        setCurrentLocation(newLocation);
    };

    const handleConfirmLocation = () => {
        setEstimationData({latitude: currentLocation.latitude, longitude: currentLocation.longitude});
        navigate(`/dinh-gia-nha/ket-qua?lat=${currentLocation.latitude}&lon=${currentLocation.longitude}&address=${currentLocation.address}`);
    };

    return (
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg p-8 sm:p-10 w-full max-w-6xl">
                <div className="flex flex-col gap-6">
                    {/* Title */}
                    <div className="w-full text-center">
                        <h2 className="text-3xl sm:text-4xl font-semibold">ĐỊNH GIÁ NHÀ</h2>
                    </div>

                    {/* Confirmation Question */}
                    <div className="text-center">
                        <p className="text-lg sm:text-xl text-gray-700">
                            Đây có phải vị trí của bạn?
                        </p>
                    </div>

                    {/* Draggable Map */}
                    <div className="w-full rounded-lg overflow-hidden border-2 border-gray-300" style={{ height: '600px' }}>
                        <DraggableMarkerMap
                            location={currentLocation}
                            onLocationChange={handleLocationChange}
                            defaultZoom={16}
                            height="600px"
                            showNavigation={true}
                        />
                    </div>

                    {/* Validation Message */}
                    {!isLocationValid && (
                        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <h3 className="text-sm font-semibold text-red-800 mb-1">
                                        Vị trí không trùng khớp với địa chỉ ban đầu
                                    </h3>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Confirm Button */}
                    <Button
                        onClick={handleConfirmLocation}
                        disabled={!isLocationValid}
                        className="w-full h-12 transition-colors duration-200 bg-[#008DDA] cursor-pointer hover:bg-[#0064A6] text-base sm:text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#008DDA]"
                    >
                        Đúng, đây là vị trí của tôi
                    </Button>
                </div>
            </div>
        </div>
    );
};

