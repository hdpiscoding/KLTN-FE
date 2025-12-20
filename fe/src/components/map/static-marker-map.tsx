import React, { useState } from 'react';
import ReactMapGL, { Marker, NavigationControl } from '@goongmaps/goong-map-react';
import { MapPin } from 'lucide-react';
import {Button} from "@/components/ui/button.tsx";
import type {Location} from "@/types/location.d.ts";

export interface GoongMapProps {
    location: Location;
    defaultZoom?: number;
    height?: string;
    width?: string;
    mapStyle?: string;
    showPopup?: boolean;
    showNavigation?: boolean;
}

const StaticMarkerMap: React.FC<GoongMapProps> = ({
                                               location,
                                               defaultZoom = 15,
                                               height = '100%',
                                               width = '100%',
                                               mapStyle = 'https://tiles.goong.io/assets/goong_map_web.json',
                                               showNavigation = true,
                                           }) => {
    const [viewport, setViewport] = useState({
        latitude: location.latitude,
        longitude: location.longitude,
        zoom: defaultZoom,
        bearing: 0,
        pitch: 0
    });

    const [isDragging] = useState(false);
    const [isHovering] = useState(false);
    const cursor = isDragging ? 'grabbing' : isHovering ? 'pointer' : 'default';

    // Goong API Key
    const GOONG_API_KEY = import.meta.env.VITE_MAPTILES_KEY;

    return (
        <div className="relative" style={{ width, height }}>
            <ReactMapGL
                {...viewport}
                width="100%"
                height="100%"
                mapStyle={mapStyle}
                onViewportChange={setViewport}
                goongApiAccessToken={GOONG_API_KEY}
                getCursor={() => cursor}
                onResize={() => {}}
                touchAction="pan-y"
                onClick={() => {}}
            >
                {/* Navigation Controls */}
                {showNavigation && (
                    <div style={{ position: 'absolute', top: 10, right: 10 }}>
                        <NavigationControl />
                    </div>
                )}

                {/* Property Location Marker */}
                <Marker
                    latitude={location.latitude}
                    longitude={location.longitude}
                    offsetLeft={-25}
                    offsetTop={-50}
                >
                    <MapPin size={36} className="text-red-600 fill-red-500 drop-shadow-2xl" />
                </Marker>
            </ReactMapGL>

            {/* Info Card */}
            <div className="absolute top-4 left-4 bg-white rounded-lg shadow-xl p-4 max-w-sm border border-gray-200 hidden md:block">
                <div className="flex items-center gap-2 mb-2">
                    <div className="bg-red-500 rounded-full p-1.5">
                        <MapPin size={16} className="text-white" />
                    </div>
                    <h4 className="font-bold text-sm text-gray-800">
                        {location.address}
                    </h4>
                </div>
                <p className="text-xs text-gray-600">
                    {location.latitude}, {location.longitude}
                </p>

                <Button className="mt-4 w-full cursor-pointer" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`, '_blank')}>
                    Xem bản đồ lớn
                </Button>
            </div>
        </div>
    );
};

export default StaticMarkerMap;