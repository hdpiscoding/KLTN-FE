import React, { useState, useMemo, useRef, useEffect } from 'react';
import ReactMapGL, { Marker, Popup, NavigationControl, type MapRef } from '@goongmaps/goong-map-react';
import Supercluster from 'supercluster';
import { PropertyPopupCard } from '@/components/card-item/property-popup-card.tsx';
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
    defaultZoom?: number;
    height?: string;
    width?: string;
    mapStyle?: string;
    showNavigation?: boolean;
    centerLat?: number;
    centerLng?: number;
    minZoomToShow?: number; // Zoom tối thiểu để hiển thị markers
    onMapInteraction?: (bounds: { minLat: number; minLng: number; maxLat: number; maxLng: number; zoom: number }, eventType: 'zoom' | 'dragEnd') => void;
}

const MultipleMarkerMap: React.FC<MultipleMarkerMapProps> = ({
    properties,
    defaultZoom = 11,
    height = '100%',
    width = '100%',
    mapStyle = 'https://tiles.goong.io/assets/goong_map_web.json',
    showNavigation = true,
    centerLat,
    centerLng,
    minZoomToShow = 12,
    onMapInteraction,
}) => {
    // Calculate center - Always default to Ho Chi Minh City unless explicitly provided
    const calculateCenter = () => {
        // If explicit coordinates are provided, use them
        if (centerLat !== undefined && centerLng !== undefined) {
            return { latitude: centerLat, longitude: centerLng };
        }

        // Always default to Ho Chi Minh City center for initial view
        return { latitude: 10.8231, longitude: 106.6297 }; // Ho Chi Minh City center
    };

    // Goong API Key
    const GOONG_API_KEY = import.meta.env.VITE_MAPTILES_KEY;

    const center = calculateCenter();
    const mapRef = useRef<MapRef>(null);

    const [viewport, setViewport] = useState({
        latitude: center.latitude,
        longitude: center.longitude,
        zoom: defaultZoom,
        bearing: 0,
        pitch: 0,
    });

    const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
    const [bounds, setBounds] = useState<[number, number, number, number] | null>(null);

    // Track interaction type to determine zoom vs drag
    const interactionTypeRef = useRef<'zoom' | 'drag' | null>(null);
    const previousZoomRef = useRef<number>(9);

    useEffect(() => {
        setViewport(prev => ({
            ...prev,
            latitude: center.latitude,
            longitude: center.longitude,
            zoom: defaultZoom,
        }));
        previousZoomRef.current = defaultZoom;
    }, [defaultZoom, center.latitude, center.longitude]);

    // Initialize Supercluster
    const supercluster = useMemo(() => {
        if (!properties || properties.length === 0) return null;

        const cluster = new Supercluster({
            radius: 30,
            maxZoom: 16,
            minZoom: 0,
            minPoints: 2,
        });

        // Convert properties to GeoJSON features
        const points = properties.map(property => ({
            type: 'Feature' as const,
            properties: {
                cluster: false,
                propertyId: property.id,
                property: property,
            },
            geometry: {
                type: 'Point' as const,
                coordinates: [property.location.longitude, property.location.latitude],
            },
        }));

        cluster.load(points);
        return cluster;
    }, [properties]);

    // Get clusters based on current viewport
    const clusters = useMemo(() => {
        if (!supercluster || !bounds || !properties) return [];

        // Ẩn tất cả markers khi zoom quá xa
        if (viewport.zoom < minZoomToShow) {
            console.log(`Zoom ${viewport.zoom} < ${minZoomToShow} - Hiding all markers`);
            return [];
        }

        const clustersData = supercluster.getClusters(bounds, Math.floor(viewport.zoom));

        // Debug log
        console.log('Zoom:', viewport.zoom.toFixed(2), 'Clusters:', clustersData.length, 'Total properties:', properties.length);

        return clustersData;
    }, [supercluster, bounds, viewport.zoom, properties, minZoomToShow]);

    const handleMarkerClick = (propertyId: string) => {
        setSelectedPropertyId(propertyId);
    };

    const handleClusterClick = (clusterId: number, longitude: number, latitude: number) => {
        if (!supercluster) return;

        const expansionZoom = Math.min(
            supercluster.getClusterExpansionZoom(clusterId),
            20
        );

        setViewport({
            ...viewport,
            longitude,
            latitude,
            zoom: expansionZoom,
        });
    };

    const handleClosePopup = () => {
        console.log('close popup');
        setSelectedPropertyId(null);
    };

    // Update viewport - NO API calls here
    const handleViewportChange = (newViewport: typeof viewport) => {
        setViewport(newViewport);

        if (mapRef.current) {
            const map = mapRef.current.getMap();
            const mapBounds = map.getBounds();

            setBounds([
                mapBounds.getWest(),
                mapBounds.getSouth(),
                mapBounds.getEast(),
                mapBounds.getNorth(),
            ]);
        }
    };

    // Track interaction type
    const handleInteractionStateChange = (state: { isZooming?: boolean; isDragging?: boolean; isPanning?: boolean }) => {
        if (state.isZooming) {
            interactionTypeRef.current = 'zoom';
        } else if (state.isDragging || state.isPanning) {
            interactionTypeRef.current = 'drag';
        }
    };

    // Called when animation completes - THIS is where we call API (only once per interaction)
    const handleTransitionEnd = () => {
        if (!mapRef.current || !onMapInteraction) return;

        const map = mapRef.current.getMap();
        const mapBounds = map.getBounds();
        const currentZoom = viewport.zoom;

        const boundsData = {
            minLat: mapBounds.getSouth(),
            minLng: mapBounds.getWest(),
            maxLat: mapBounds.getNorth(),
            maxLng: mapBounds.getEast(),
            zoom: currentZoom,
        };

        const interactionType = interactionTypeRef.current;

        if (interactionType === 'zoom') {
            if (Math.abs(currentZoom - previousZoomRef.current) > 0.01) {
                console.log('Zoom ended at:', currentZoom.toFixed(2));
                onMapInteraction(boundsData, 'zoom');
                previousZoomRef.current = currentZoom;
            }
        } else if (interactionType === 'drag') {
            console.log('Drag ended');
            onMapInteraction(boundsData, 'dragEnd');
        }

        interactionTypeRef.current = null;
    };

    const selectedProperty = properties.find(p => p.id === selectedPropertyId);

    const [isDragging] = useState(false);
    const [isHovering] = useState(false);
    const cursor = isDragging ? 'grabbing' : isHovering ? 'pointer' : 'default';

    return (
        <div className="relative" style={{ width, height }}>
            <ReactMapGL
                ref={mapRef}
                {...viewport}
                width="100%"
                height="100%"
                mapStyle={mapStyle}
                onViewportChange={handleViewportChange}
                onTransitionStart={() => {}}
                onTransitionEnd={handleTransitionEnd}
                onTransitionInterrupt={() => {}}
                onInteractionStateChange={handleInteractionStateChange}
                goongApiAccessToken={GOONG_API_KEY}
                onResize={() => {}}
                touchAction="pan-y"
                getCursor={() => cursor}
                onLoad={() => {
                    // Initialize bounds on load
                    if (mapRef.current) {
                        const map = mapRef.current.getMap();
                        const mapBounds = map.getBounds();
                        setBounds([
                            mapBounds.getWest(),
                            mapBounds.getSouth(),
                            mapBounds.getEast(),
                            mapBounds.getNorth(),
                        ]);
                    }
                }}
            >
                {/* Navigation Controls */}
                {showNavigation && (
                    <div style={{ position: 'absolute', top: 10, right: 10 }}>
                        <NavigationControl />
                    </div>
                )}

                {/* Render Clusters and Markers */}
                {clusters.map((cluster) => {
                    const [longitude, latitude] = cluster.geometry.coordinates;
                    const { cluster: isCluster, point_count: pointCount } = cluster.properties;

                    if (isCluster) {
                        // Render Cluster Marker - Smaller and more compact
                        const size = 24 + (pointCount / (properties?.length || 1)) * 32;

                        return (
                            <Marker
                                key={`cluster-${cluster.id}`}
                                latitude={latitude}
                                longitude={longitude}
                                offsetLeft={-size / 2}
                                offsetTop={-size / 2}
                            >
                                <div
                                    onClick={() => handleClusterClick(cluster.id as number, longitude, latitude)}
                                    className="cursor-pointer flex items-center justify-center relative"
                                    style={{
                                        width: `${size}px`,
                                        height: `${size}px`,
                                    }}
                                >
                                    {/* Outer ring */}
                                    <div
                                        className="absolute rounded-full bg-blue-400 opacity-20"
                                        style={{
                                            width: `${size + 20}px`,
                                            height: `${size + 20}px`,
                                        }}
                                    />

                                    {/* Cluster circle */}
                                    <div
                                        className="absolute rounded-full bg-blue-500 border-4 border-white shadow-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
                                        style={{
                                            width: `${size}px`,
                                            height: `${size}px`,
                                        }}
                                    >
                                        <span className="text-white font-bold text-sm">
                                            {pointCount}
                                        </span>
                                    </div>
                                </div>
                            </Marker>
                        );
                    }

                    // Render Individual Property Marker
                    const property = cluster.properties.property;
                    const isSelected = selectedPropertyId === property.id;

                    return (
                        <Marker
                            key={`property-${property.id}`}
                            latitude={latitude}
                            longitude={longitude}
                            offsetLeft={-8}
                            offsetTop={-8}
                        >
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleMarkerClick(property.id);
                                }}
                                className="cursor-pointer relative"
                            >
                                {/* Outer ring - pulse effect when selected */}
                                <div
                                    className={`absolute inset-0 rounded-full transition-all duration-300 ${
                                        isSelected
                                            ? 'bg-[#008DDA] opacity-35 animate-ping'
                                            : 'bg-transparent'
                                    }`}
                                    style={{
                                        width: '16px',
                                        height: '16px',
                                        transform: 'translate(-50%, -50%)',
                                        top: '8px',
                                        left: '8px',
                                    }}
                                />

                                {/* Dot Marker - Theme colors with thin border */}
                                <div
                                    className={`relative rounded-full border-0 transition-all duration-200 hover:scale-150 ${
                                        isSelected
                                            ? 'bg-[#E53935] border-white scale-150'
                                            : 'bg-[#E53935] border-white hover:bg-[#B71C1C]'
                                    }`}
                                    style={{
                                        width: '16px',
                                        height: '16px',
                                        boxShadow: isSelected
                                            ? '0 0 0 2px rgba(0,141,218,0.3), 0 4px 14px rgba(0,141,218,0.5)'
                                            : '0 0 0 2px rgba(255,255,255,0.9), 0 4px 12px rgba(0,141,218,0.3)',
                                    }}
                                >
                                    {/* Inner white dot - smaller */}
                                    <div
                                        className="absolute bg-white rounded-full"
                                        style={{
                                            width: '5px',
                                            height: '5px',
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
