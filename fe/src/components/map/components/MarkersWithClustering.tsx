import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import type { PropertyMarker as PropertyMarkerType } from '@/types/property-marker.d.ts';
import { PropertyMarker } from './PropertyMarker';
import { createClusterRenderer } from '@/components/map';

interface MarkersWithClusteringProps {
    properties: PropertyMarkerType[];
    selectedProperty: PropertyMarkerType | null;
    onPropertySelect: (property: PropertyMarkerType) => void;
    currentZoom: number;
    minZoomForMarkers?: number;
    clusterColor?: string;
}

export const MarkersWithClustering: React.FC<MarkersWithClusteringProps> = ({
                                                                                properties,
                                                                                selectedProperty,
                                                                                onPropertySelect,
                                                                                currentZoom,
                                                                                minZoomForMarkers = 12,
                                                                                clusterColor = '#008DDA',
                                                                            }) => {
    const map = useMap();
    const [markers, setMarkers] = useState<{[key: string]: google.maps.marker.AdvancedMarkerElement}>({});
    const clusterer = useRef<MarkerClusterer | null>(null);

    // Don't render if zoom too low
    const shouldShowMarkers = currentZoom >= minZoomForMarkers;

    // Initialize clusterer once
    useEffect(() => {
        if (!map) return;

        clusterer.current = new MarkerClusterer({
            map,
            renderer: createClusterRenderer(clusterColor),
        });

        return () => {
            clusterer.current?.clearMarkers();
            clusterer.current = null;
        };
    }, [map, clusterColor]);

    // Update clusterer when markers object changes
    useEffect(() => {
        if (!clusterer.current) return;

        // Clear all markers from clusterer
        clusterer.current.clearMarkers();

        // Add all current markers
        const markersList = Object.values(markers);
        if (markersList.length > 0) {
            clusterer.current.addMarkers(markersList);
            console.log(`📍 Clustered ${markersList.length} markers`);
        }
    }, [markers]);

    // Ref callback to collect marker instances
    const setMarkerRef = useCallback((marker: google.maps.marker.AdvancedMarkerElement | null, key: string) => {
        setMarkers((prevMarkers) => {
            if (marker) {
                // Only update if marker is new or different
                if (prevMarkers[key] === marker) {
                    return prevMarkers; // No change, return same reference
                }
                return { ...prevMarkers, [key]: marker };
            } else {
                // Only remove if marker exists
                if (!prevMarkers[key]) {
                    return prevMarkers; // No change, return same reference
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { [key]: _, ...rest } = prevMarkers;
                return rest;
            }
        });
    }, []);

    if (!shouldShowMarkers) {
        return null;
    }

    return (
        <>
            {properties.map((property) => (
                <PropertyMarker
                    key={property.id}
                    property={property}
                    isSelected={selectedProperty?.id === property.id}
                    onClick={() => onPropertySelect(property)}
                    setMarkerRef={setMarkerRef}
                />
            ))}
        </>
    );
};