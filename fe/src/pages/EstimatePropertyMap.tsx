import React, { useState } from 'react';
import { Button } from "@/components/ui/button.tsx";
import { useNavigate } from "react-router-dom";
import DraggableMarkerMap from "@/components/draggable-marker-map";
import type { Location } from "@/types/location.d.ts";

export const EstimatePropertyMap: React.FC = () => {
    const navigate = useNavigate();

    // Sample location data - TODO: Get from previous step (EstimatePropertyAddress)
    const [currentLocation, setCurrentLocation] = useState<Location>({
        latitude: 10.8231,
        longitude: 106.6297,
        address: "208 Nguyễn Hữu Cảnh, Phường 22, Quận Bình Thạnh, TP.HCM"
    });

    // Goong API Key - TODO: Move to environment variables
    const GOONG_API_KEY = import.meta.env.VITE_MAPTILES_KEY;

    const handleLocationChange = (newLocation: Location) => {
        console.log('Location changed:', newLocation);
        setCurrentLocation(newLocation);
    };

    const handleConfirmLocation = () => {
        console.log('Location confirmed:', currentLocation);
        // TODO: Save location and navigate to result page
        navigate("/dinh-gia-nha/ket-qua");
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
                            goongApiKey={GOONG_API_KEY}
                            onLocationChange={handleLocationChange}
                            defaultZoom={16}
                            height="600px"
                            showNavigation={true}
                        />
                    </div>

                    {/* Confirm Button */}
                    <Button
                        onClick={handleConfirmLocation}
                        className="w-full h-12 transition-colors duration-200 bg-[#008DDA] cursor-pointer hover:bg-[#0064A6] text-base sm:text-lg font-semibold"
                    >
                        Đúng, đây là vị trí của tôi
                    </Button>
                </div>
            </div>
        </div>
    );
};

