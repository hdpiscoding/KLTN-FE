import React from 'react';
import { useMapEvents } from '../hooks/useMapEvents';

interface MapEventHandlerProps {
    onZoomChange: (zoom: number) => void;
    onMapInteraction?: (bounds: { minLat: number; minLng: number; maxLat: number; maxLng: number; zoom: number }) => void;
    onMapClick: () => void;
}

export const MapEventHandler: React.FC<MapEventHandlerProps> = (props) => {
    useMapEvents(props);
    return null; // This component doesn't render anything
};

