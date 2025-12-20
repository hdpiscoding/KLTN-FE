import { useEffect, useRef, useCallback } from 'react';
import { useMap } from '@vis.gl/react-google-maps';

export interface MapBounds {
    minLat: number;
    minLng: number;
    maxLat: number;
    maxLng: number;
    zoom: number;
}

interface UseMapEventsProps {
    onZoomChange: (zoom: number) => void;
    onMapInteraction?: (bounds: MapBounds) => void;
    onMapClick: () => void;
    minZoomForAPI?: number;
    debounceDelay?: number;
}

export const useMapEvents = ({
    onZoomChange,
    onMapInteraction,
    onMapClick,
    minZoomForAPI = 12,
    debounceDelay = 800,
}: UseMapEventsProps) => {
    const map = useMap();
    const debounceTimerRef = useRef<number | null>(null);
    const lastApiCallKeyRef = useRef<string>('');

    const triggerAPICall = useCallback(() => {
        if (!map || !onMapInteraction) return;

        const bounds = map.getBounds();
        const zoom = map.getZoom();

        if (!bounds || !zoom || zoom < minZoomForAPI) return;

        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();

        const boundsData: MapBounds = {
            minLat: sw.lat(),
            minLng: sw.lng(),
            maxLat: ne.lat(),
            maxLng: ne.lng(),
            zoom: zoom,
        };

        const callKey = `${boundsData.minLat.toFixed(3)}-${boundsData.minLng.toFixed(3)}-${boundsData.zoom.toFixed(1)}`;

        if (callKey === lastApiCallKeyRef.current) {
            return;
        }

        lastApiCallKeyRef.current = callKey;
        console.log('🔥 API Call triggered:', boundsData);

        Promise.resolve().then(() => {
            onMapInteraction(boundsData);
        });
    }, [map, onMapInteraction, minZoomForAPI]);

    const handleBoundsChanged = useCallback(() => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = window.setTimeout(() => {
            triggerAPICall();
        }, debounceDelay);
    }, [triggerAPICall, debounceDelay]);

    useEffect(() => {
        if (!map) return;

        const boundsListener = map.addListener('bounds_changed', handleBoundsChanged);
        const zoomListener = map.addListener('zoom_changed', () => {
            handleBoundsChanged();
            const zoom = map.getZoom();
            if (zoom !== undefined) {
                onZoomChange(zoom);
            }
        });
        const dragListener = map.addListener('dragend', handleBoundsChanged);
        const clickListener = map.addListener('click', onMapClick);

        // Initial API call
        triggerAPICall();

        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
            google.maps.event.removeListener(boundsListener);
            google.maps.event.removeListener(zoomListener);
            google.maps.event.removeListener(dragListener);
            google.maps.event.removeListener(clickListener);
        };
    }, [map, handleBoundsChanged, triggerAPICall, onZoomChange, onMapClick]);
};

