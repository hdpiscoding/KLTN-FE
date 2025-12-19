import React, { useState, useMemo } from 'react';
import { APIProvider, Map, InfoWindow } from '@vis.gl/react-google-maps';
import { PropertyPopupCard } from '@/components/card-item/property-popup-card.tsx';
import type { PropertyMarker } from '@/types/property-marker.d.ts';
import type { Amenity, AmenityFilterState, AmenityCategory } from '@/types/amenity.d.ts';
import { MarkersWithClustering } from './components/MarkersWithClustering';
import { AmenitiesWithClustering } from './components/AmenitiesWithClustering';
import { AmenityFilterPanel } from './components/AmenityFilterPanel';
import { AmenityInfoCard } from './components/AmenityInfoCard';
import { MapEventHandler } from './components/MapEventHandler';
import { DEFAULT_MAP_CENTER, DEFAULT_ZOOM, MIN_ZOOM_FOR_MARKERS } from './constants/mapConstants';
import { getAmenitiesWithinViewPort } from '@/services/propertyServices';

// ============================================
// TYPES
// ============================================
export interface MultipleMarkerMapProps {
    properties: PropertyMarker[];
    defaultZoom?: number;
    height?: string;
    width?: string;
    centerLat?: number;
    centerLng?: number;
    onMapInteraction?: (
        bounds: { minLat: number; minLng: number; maxLat: number; maxLng: number; zoom: number }
    ) => void;
}

// ============================================
// MAIN COMPONENT
// ============================================
const MultipleMarkerMap: React.FC<MultipleMarkerMapProps> = ({
                                                                 properties,
                                                                 defaultZoom = DEFAULT_ZOOM,
                                                                 height = '100%',
                                                                 width = '100%',
                                                                 centerLat,
                                                                 centerLng,
                                                                 onMapInteraction,
                                                             }) => {
    const [selectedProperty, setSelectedProperty] = useState<PropertyMarker | null>(null);
    const [currentZoom, setCurrentZoom] = useState<number>(defaultZoom);
    const [currentBounds, setCurrentBounds] = useState<{ minLat: number; minLng: number; maxLat: number; maxLng: number; zoom: number } | null>(null);

    // Amenity states
    const [amenities, setAmenities] = useState<Amenity[]>([]);
    const [selectedAmenity, setSelectedAmenity] = useState<Amenity | null>(null);
    const [amenityFilterState, setAmenityFilterState] = useState<AmenityFilterState>({
        healthcare: true,
        education: true,
        transportation: true,
        environment: true,
        public_safety: true,
        shopping: true,
        entertainment: true,
    });

    const center = useMemo(() => {
        if (centerLat !== undefined && centerLng !== undefined) {
            return { lat: centerLat, lng: centerLng };
        }
        return DEFAULT_MAP_CENTER;
    }, [centerLat, centerLng]);

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

    // Map styles to hide default POIs
    const mapStyles = useMemo(() => [
        {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
        },
        {
            featureType: "poi.business",
            stylers: [{ visibility: "off" }]
        },
        {
            featureType: "poi.park",
            elementType: "labels.text",
            stylers: [{ visibility: "off" }]
        }
    ], []);

    // Fetch amenities within viewport
    const fetchAmenities = async (bounds: { minLat: number; minLng: number; maxLat: number; maxLng: number; zoom: number }) => {
        if (bounds.zoom < MIN_ZOOM_FOR_MARKERS) {
            setAmenities([]);
            return;
        }

        try {
            // Get all enabled categories
            const enabledCategories = (Object.keys(amenityFilterState) as AmenityCategory[])
                .filter(category => amenityFilterState[category]);

            // Fetch amenities for each enabled category
            const amenityPromises = enabledCategories.map(category =>
                getAmenitiesWithinViewPort(
                    bounds.minLat,
                    bounds.minLng,
                    bounds.maxLat,
                    bounds.maxLng,
                    category,
                    200 // limit per category
                )
            );

            const results = await Promise.all(amenityPromises);

            // Flatten and combine all amenities
            const allAmenities = results.flatMap(result => result.data.items || []);

            setAmenities(allAmenities);
            console.log(`📍 Loaded ${allAmenities.length} amenities`);
        } catch (error) {
            console.error('Error fetching amenities:', error);
            setAmenities([]);
        }
    };

    // Handle map interaction (zoom/drag)
    const handleMapInteraction = (bounds: { minLat: number; minLng: number; maxLat: number; maxLng: number; zoom: number }) => {
        // Save current bounds
        setCurrentBounds(bounds);

        // Call parent handler if provided
        onMapInteraction?.(bounds);

        // Fetch amenities for new bounds
        fetchAmenities(bounds);
    };

    // Handle amenity filter change
    const handleFilterChange = (category: AmenityCategory, enabled: boolean) => {
        const newFilterState = {
            ...amenityFilterState,
            [category]: enabled,
        };
        setAmenityFilterState(newFilterState);

        // Re-fetch amenities immediately with current bounds if available
        if (currentBounds) {
            // Create a temporary fetchAmenities call with the new filter state
            const fetchWithNewFilter = async () => {
                if (currentBounds.zoom < MIN_ZOOM_FOR_MARKERS) {
                    setAmenities([]);
                    return;
                }

                try {
                    const enabledCategories = (Object.keys(newFilterState) as AmenityCategory[])
                        .filter(cat => newFilterState[cat]);

                    const amenityPromises = enabledCategories.map(cat =>
                        getAmenitiesWithinViewPort(
                            currentBounds.minLat,
                            currentBounds.minLng,
                            currentBounds.maxLat,
                            currentBounds.maxLng,
                            cat,
                            200
                        )
                    );

                    const results = await Promise.all(amenityPromises);
                    const allAmenities = results.flatMap(result => result.data.items || []);

                    setAmenities(allAmenities);
                    console.log(`📍 Reloaded ${allAmenities.length} amenities after filter change`);
                } catch (error) {
                    console.error('Error fetching amenities:', error);
                    setAmenities([]);
                }
            };

            fetchWithNewFilter();
        }
    };

    return (
        <div className="relative" style={{ width, height }}>
            <APIProvider apiKey={apiKey}>
                <Map
                    mapId="multiple-markers-map"
                    defaultCenter={center}
                    defaultZoom={defaultZoom}
                    gestureHandling="greedy"
                    disableDefaultUI={false}
                    zoomControl={true}
                    mapTypeControl={false}
                    streetViewControl={false}
                    fullscreenControl={true}
                    clickableIcons={false}
                    styles={mapStyles}
                    style={{ width: '100%', height: '100%' }}
                >
                    {/* Event Handlers */}
                    <MapEventHandler
                        onZoomChange={setCurrentZoom}
                        onMapInteraction={handleMapInteraction}
                        onMapClick={() => {
                            setSelectedProperty(null);
                            setSelectedAmenity(null);
                        }}
                    />

                    {/* Markers with Clustering */}
                    <MarkersWithClustering
                        properties={properties}
                        selectedProperty={selectedProperty}
                        onPropertySelect={setSelectedProperty}
                        currentZoom={currentZoom}
                        minZoomForMarkers={MIN_ZOOM_FOR_MARKERS}
                    />

                    {/* Amenity Markers with Clustering */}
                    <AmenitiesWithClustering
                        amenities={amenities}
                        selectedAmenity={selectedAmenity}
                        onAmenitySelect={setSelectedAmenity}
                        currentZoom={currentZoom}
                        filterState={amenityFilterState}
                        minZoomForMarkers={MIN_ZOOM_FOR_MARKERS}
                    />

                    {/* Property Info Window */}
                    {selectedProperty && (
                        <InfoWindow
                            pixelOffset={[0, -30]}
                            position={{
                                lat: selectedProperty.location.latitude,
                                lng: selectedProperty.location.longitude,
                            }}
                            onCloseClick={() => setSelectedProperty(null)}
                            headerDisabled
                        >
                            <div onClick={(e) => e.stopPropagation()}>
                                <PropertyPopupCard
                                    id={selectedProperty.id}
                                    title={selectedProperty.title}
                                    image={selectedProperty.image}
                                    address={selectedProperty.location.address}
                                    price={selectedProperty.price}
                                    area={selectedProperty.area}
                                    onClose={() => setSelectedProperty(null)}
                                />
                            </div>
                        </InfoWindow>
                    )}

                    {/* Amenity Info Window */}
                    {selectedAmenity && (
                        <InfoWindow
                            pixelOffset={[0, -50]}
                            position={{
                                lat: selectedAmenity.latitude,
                                lng: selectedAmenity.longitude,
                            }}
                            onCloseClick={() => setSelectedAmenity(null)}
                            headerDisabled
                        >
                            <div onClick={(e) => e.stopPropagation()}>
                                <AmenityInfoCard
                                    amenity={selectedAmenity}
                                    onClose={() => setSelectedAmenity(null)}
                                />
                            </div>
                        </InfoWindow>
                    )}
                </Map>

                {/* Amenity Filter Panel */}
                <div className="absolute top-4 right-4 z-10">
                    <AmenityFilterPanel
                        filterState={amenityFilterState}
                        onFilterChange={handleFilterChange}
                    />
                </div>

                {/* Info Badge */}
                <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg px-4 py-2 border border-gray-200 z-10">
                    <p className="text-sm font-semibold text-gray-800">
                        {properties.length} bất động sản
                        {amenities.length > 0 && ` • ${amenities.length} tiện ích`}
                    </p>
                    {currentZoom < MIN_ZOOM_FOR_MARKERS ? (
                        <p className="text-xs text-amber-600 font-medium">
                            📍 Phóng to bản đồ để xem marker
                        </p>
                    ) : (
                        <p className="text-xs text-gray-500">
                            Click vào marker để xem chi tiết
                        </p>
                    )}
                </div>
            </APIProvider>
        </div>
    );
};

export default MultipleMarkerMap;

