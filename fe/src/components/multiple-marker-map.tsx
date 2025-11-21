import React, { useState } from 'react';
import ReactMapGL, { Marker, Popup, NavigationControl } from '@goongmaps/goong-map-react';
import { PropertyPopupCard } from '@/components/property-popup-card';
import type { Location } from '@/types/location.d.ts';

export interface PropertyMarker {
    id: string;
    location: Location;
    title: string;
    image: string;
    price: number;
    area: number;
}

export interface MultipleMarkerMapProps {
    properties: PropertyMarker[];
    goongApiKey: string;
    defaultZoom?: number;
    height?: string;
    width?: string;
    mapStyle?: string;
    showNavigation?: boolean;
    centerLat?: number;
    centerLng?: number;
}

const MultipleMarkerMap: React.FC<MultipleMarkerMapProps> = ({
    properties,
    goongApiKey,
    defaultZoom = 13,
    height = '100%',
    width = '100%',
    mapStyle = 'https://tiles.goong.io/assets/goong_map_web.json',
    showNavigation = true,
    centerLat,
    centerLng,
}) => {
    // Calculate center from properties if not provided
    const calculateCenter = () => {
        if (centerLat !== undefined && centerLng !== undefined) {
            return { latitude: centerLat, longitude: centerLng };
        }

        if (properties.length === 0) {
            return { latitude: 10.8231, longitude: 106.6297 }; // Default: Ho Chi Minh City
        }

        const sumLat = properties.reduce((sum, p) => sum + p.location.latitude, 0);
        const sumLng = properties.reduce((sum, p) => sum + p.location.longitude, 0);

        return {
            latitude: sumLat / properties.length,
            longitude: sumLng / properties.length,
        };
    };

    const center = calculateCenter();

    const [viewport, setViewport] = useState({
        latitude: center.latitude,
        longitude: center.longitude,
        zoom: defaultZoom,
        bearing: 0,
        pitch: 0,
    });

    const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

    const handleMarkerClick = (propertyId: string) => {
        setSelectedPropertyId(propertyId);
    };

    const handleClosePopup = () => {
        console.log('close popup');
        setSelectedPropertyId(null);
    };

    const selectedProperty = properties.find(p => p.id === selectedPropertyId);

    const [isDragging] = useState(false);
    const [isHovering] = useState(false);
    const cursor = isDragging ? 'grabbing' : isHovering ? 'pointer' : 'default';

    return (
        <div className="relative" style={{ width, height }}>
            <ReactMapGL
                {...viewport}
                width="100%"
                height="100%"
                mapStyle={mapStyle}
                onViewportChange={setViewport}
                goongApiAccessToken={goongApiKey}
                onResize={() => {}}
                touchAction="pan-y"
                getCursor={() => cursor}
            >
                {/* Navigation Controls */}
                {showNavigation && (
                    <div style={{ position: 'absolute', top: 10, right: 10 }}>
                        <NavigationControl />
                    </div>
                )}

                {/* Property Markers - Dot Style */}
                {properties.map((property) => {
                    const isSelected = selectedPropertyId === property.id;

                    return (
                        <Marker
                            key={property.id}
                            latitude={property.location.latitude}
                            longitude={property.location.longitude}
                            offsetLeft={-12}
                            offsetTop={-12}
                        >
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleMarkerClick(property.id);
                                }}
                                className="cursor-pointer"
                            >
                                {/* Outer ring - pulse effect when selected */}
                                <div
                                    className={`absolute inset-0 rounded-full transition-all duration-300 ${
                                        isSelected
                                            ? 'bg-[#008DDA] opacity-30 animate-ping'
                                            : 'bg-transparent'
                                    }`}
                                    style={{
                                        width: '24px',
                                        height: '24px',
                                        transform: 'translate(-50%, -50%)',
                                        top: '12px',
                                        left: '12px',
                                    }}
                                />

                                {/* Dot Marker */}
                                <div
                                    className={`relative rounded-full border-2 transition-all duration-200 shadow-lg hover:scale-125 ${
                                        isSelected
                                            ? 'bg-[#008DDA] border-white scale-125 shadow-xl'
                                            : 'bg-red-500 border-white hover:bg-red-600'
                                    }`}
                                    style={{
                                        width: '24px',
                                        height: '24px',
                                    }}
                                >
                                    {/* Inner white dot */}
                                    <div
                                        className="absolute bg-white rounded-full"
                                        style={{
                                            width: '8px',
                                            height: '8px',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                        }}
                                    />
                                </div>
                            </div>
                        </Marker>
                    );
                })}

                {selectedProperty && (
                    <Popup
                        latitude={selectedProperty.location.latitude}
                        longitude={selectedProperty.location.longitude}
                        onClose={handleClosePopup}
                        closeButton={false}
                        closeOnClick={false}
                        offsetTop={-15}
                        offsetLeft={0}
                        anchor="bottom"
                        dynamicPosition={true}
                    >
                        <div onClick={(e) => e.stopPropagation()}>
                            <PropertyPopupCard
                                id={selectedProperty.id}
                                title={selectedProperty.title}
                                image={selectedProperty.image}
                                address={selectedProperty.location.address}
                                price={selectedProperty.price}
                                area={selectedProperty.area}
                                onClose={handleClosePopup}
                            />
                        </div>
                    </Popup>
                )}
            </ReactMapGL>

            {/* Info Badge */}
            <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg px-4 py-2 border border-gray-200">
                <p className="text-sm font-semibold text-gray-800">
                    {properties.length} bất động sản
                </p>
                <p className="text-xs text-gray-500">
                    Click vào marker để xem chi tiết
                </p>
            </div>
        </div>
    );
};

export default MultipleMarkerMap;

