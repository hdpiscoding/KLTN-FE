import React, {useState, useCallback, useRef} from 'react';
import ReactMapGL, {Marker, NavigationControl} from '@goongmaps/goong-map-react';
import {MapPin} from 'lucide-react';
import {Button} from "@/components/ui/button.tsx";
import type {Location} from "@/types/location.d.ts";

export interface DraggableMarkerMapProps {
    location: Location;
    onLocationChange: (newLocation: Location) => void;
    defaultZoom?: number;
    height?: string;
    width?: string;
    mapStyle?: string;
    showNavigation?: boolean;
    disabled?: boolean;
}

const DraggableMarkerMap: React.FC<DraggableMarkerMapProps> = ({
                                                                   location,
                                                                   onLocationChange,
                                                                   defaultZoom = 15,
                                                                   height = '100%',
                                                                   width = '100%',
                                                                   mapStyle = 'https://tiles.goong.io/assets/goong_map_web.json',
                                                                   showNavigation = true,
                                                                   disabled = false,
                                                               }) => {
    const [viewport, setViewport] = useState({
        latitude: location.latitude,
        longitude: location.longitude,
        zoom: defaultZoom,
        bearing: 0,
        pitch: 0
    });

    const [marker, setMarker] = useState({
        latitude: location.latitude,
        longitude: location.longitude
    });

    const [isDragging, setIsDragging] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const cursor = disabled ? 'default' : isDragging ? 'grabbing' : isHovering ? 'grab' : 'default';

    // Goong API Key
    const GOONG_API_KEY = import.meta.env.VITE_MAPTILES_KEY;
    const originalLocationRef = useRef<Location>({
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address
    });

    const onMarkerDragStart = useCallback(() => {
        if (!disabled) {
            setIsDragging(true);
        }
    }, [disabled]);

    const onMarkerDrag = useCallback((event: { lngLat: [number, number] }) => {
        if (!disabled) {
            const {lngLat} = event;
            setMarker({
                latitude: lngLat[1],
                longitude: lngLat[0]
            });
        }
    }, [disabled]);

    const onMarkerDragEnd = useCallback((event: { lngLat: [number, number] }) => {
        if (!disabled) {
            setIsDragging(false);
            const {lngLat} = event;
            const newLocation: Location = {
                latitude: lngLat[1],
                longitude: lngLat[0],
                address: location.address // Keep the original address or update via reverse geocoding
            };
            setMarker({
                latitude: lngLat[1],
                longitude: lngLat[0]
            });
            onLocationChange(newLocation);
        }
    }, [disabled, location.address, onLocationChange]);

    const handleReset = () => {
        setMarker({
            latitude: originalLocationRef.current.latitude,
            longitude: originalLocationRef.current.longitude
        });
        setViewport(prev => ({
            ...prev,
            latitude: originalLocationRef.current.latitude,
            longitude: originalLocationRef.current.longitude
        }));
        const newLocation = {...originalLocationRef.current};
        onLocationChange(newLocation);
    };

    const handleCenterToMarker = () => {
        setViewport(prev => ({
            ...prev,
            latitude: marker.latitude,
            longitude: marker.longitude
        }));
    };

    const isMarkerMoved = marker.latitude !== location.latitude || marker.longitude !== location.longitude;

    return (
        <div className="relative" style={{width, height}}>
            <ReactMapGL
                {...viewport}
                width="100%"
                height="100%"
                mapStyle={mapStyle}
                onViewportChange={setViewport}
                goongApiAccessToken={GOONG_API_KEY}
                getCursor={() => cursor}
                onResize={() => {
                }}
                touchAction="pan-y"
            >
                {/* Navigation Controls */}
                {showNavigation && (
                    <div style={{position: 'absolute', top: 10, right: 10}}>
                        <NavigationControl/>
                    </div>
                )}

                {/* Draggable Marker */}
                <Marker
                    latitude={marker.latitude}
                    longitude={marker.longitude}
                    offsetLeft={-18}
                    offsetTop={-36}
                    draggable={!disabled}
                    onDragStart={onMarkerDragStart}
                    onDrag={onMarkerDrag}
                    onDragEnd={onMarkerDragEnd}
                >
                    <div
                        onMouseEnter={() => !disabled && setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                        className="cursor-grab active:cursor-grabbing"
                    >
                        <MapPin
                            size={36}
                            className={`drop-shadow-2xl transition-all duration-200 ${
                                disabled
                                    ? 'text-gray-400 fill-gray-300'
                                    : isDragging
                                        ? 'text-red-600 fill-red-500 scale-110'
                                        : isHovering
                                            ? 'text-red-600 fill-red-500 scale-105'
                                            : 'text-red-600 fill-red-500'
                            }`}
                        />
                    </div>
                </Marker>
            </ReactMapGL>

            {/* Info Card */}
            <div className="absolute top-4 left-4 bg-white rounded-lg shadow-xl p-4 max-w-sm border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                    <div className={`rounded-full p-1.5 ${disabled ? 'bg-gray-400' : 'bg-red-500'}`}>
                        <MapPin size={16} className="text-white"/>
                    </div>
                    <h4 className="font-bold text-sm text-gray-800">
                        {disabled ? 'Vị trí cố định' : 'Kéo marker để chọn vị trí'}
                    </h4>
                </div>

                <div className="space-y-2 text-xs text-gray-600">
                    <p className="font-medium">{location.address}</p>
                    <div className="bg-gray-50 rounded p-2 font-mono">
                        <p>Vĩ độ: {marker.latitude.toFixed(6)}</p>
                        <p>Kinh độ: {marker.longitude.toFixed(6)}</p>
                    </div>

                    {isMarkerMoved && (
                        <div className="bg-blue-50 border border-blue-200 rounded p-2">
                            <p className="text-blue-700 font-medium">Vị trí đã thay đổi</p>
                        </div>
                    )}
                </div>

                {!isDragging && (
                    <div className="mt-4 space-y-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-full cursor-pointer"
                            onClick={handleReset}
                        >
                            Đặt lại vị trí ban đầu
                        </Button>

                        <Button
                            type="button"
                            size="sm"
                            className="w-full cursor-pointer bg-[#008DDA] hover:bg-[#0064A6]"
                            onClick={handleCenterToMarker}
                        >
                            Căn giữa marker
                        </Button>
                    </div>
                )}



                {!disabled && (
                    <p className="text-xs text-gray-500 mt-3 italic">
                        💡 Kéo thả marker màu đỏ để chọn vị trí chính xác
                    </p>
                )}
            </div>

            {/* Dragging Overlay Hint */}
            {isDragging && (
                <div
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/75 text-white px-4 py-2 rounded-lg shadow-lg">
                    <p className="text-sm font-medium">Đang di chuyển marker...</p>
                </div>
            )}
        </div>
    );
};

export default DraggableMarkerMap;