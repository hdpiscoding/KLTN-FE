import React, { useCallback } from 'react';
import { AdvancedMarker } from '@vis.gl/react-google-maps';
import type { PropertyMarker as PropertyMarkerType } from '@/types/property-marker.d.ts';

interface PropertyMarkerProps {
    property: PropertyMarkerType;
    isSelected: boolean;
    onClick: () => void;
    setMarkerRef: (marker: google.maps.marker.AdvancedMarkerElement | null, key: string) => void;
}

export const PropertyMarker: React.FC<PropertyMarkerProps> = ({
                                                                  property,
                                                                  isSelected,
                                                                  onClick,
                                                                  setMarkerRef
                                                              }) => {
    // Create stable ref callback for this specific marker
    const handleRef = useCallback((marker: google.maps.marker.AdvancedMarkerElement | null) => {
        setMarkerRef(marker, property.id);
    }, [setMarkerRef, property.id]);

    return (
        <AdvancedMarker
            position={{
                lat: property.location.latitude,
                lng: property.location.longitude,
            }}
            onClick={onClick}
            zIndex={isSelected ? 10000 : 1000}
            ref={handleRef}
        >
            <div
                className="custom-marker"
                style={{
                    position: 'relative',
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer',
                    transform: isSelected ? 'scale(1.4)' : 'scale(1)',
                    transition: 'transform 0.2s ease-out',
                }}
            >
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <filter id={`shadow-${property.id}`} x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur in="SourceAlpha" stdDeviation={isSelected ? 3 : 2} />
                            <feOffset dx="0" dy="1" result="offsetblur" />
                            <feComponentTransfer>
                                <feFuncA type="linear" slope={isSelected ? 0.5 : 0.35} />
                            </feComponentTransfer>
                            <feMerge>
                                <feMergeNode />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    <circle
                        cx="12"
                        cy="12"
                        r="9"
                        fill={isSelected ? '#008DDA' : '#000'}
                        stroke="white"
                        strokeWidth={isSelected ? 2 : 1.5}
                        filter={`url(#shadow-${property.id})`}
                    />
                </svg>
            </div>
        </AdvancedMarker>
    );
};