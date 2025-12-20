import React, { useCallback, useMemo } from 'react';
import { AdvancedMarker } from '@vis.gl/react-google-maps';
import type { Amenity, AmenityCategory } from '@/types/amenity.d.ts';
import { AMENITY_CATEGORIES } from '@/components/map';

interface AmenityMarkerProps {
    amenity: Amenity;
    isSelected: boolean;
    currentZoom: number;
    onClick: () => void;
    setMarkerRef: (
        marker: google.maps.marker.AdvancedMarkerElement | null,
        key: string,
        category: AmenityCategory
    ) => void;
}

export const AmenityMarker: React.FC<AmenityMarkerProps> = ({
                                                                amenity,
                                                                isSelected,
                                                                currentZoom,
                                                                onClick,
                                                                setMarkerRef,
                                                            }) => {
    // Stable ref for marker
    const handleRef = useCallback(
        (marker: google.maps.marker.AdvancedMarkerElement | null) => {
            setMarkerRef(marker, `amenity-${amenity.id}`, amenity.category);
        },
        [setMarkerRef, amenity.id, amenity.category]
    );

    const categoryConfig = AMENITY_CATEGORIES[amenity.category];
    const color = categoryConfig.color;
    const Icon = categoryConfig.icon;

    /* ---------------- Icon sizing (zoom-based only) ---------------- */

    // Base size ~ Google Maps POI
    const BASE_ICON_SIZE = 24;
    const zoomScale = Math.max(
        0.6,
        Math.min(1.4, 0.6 + (currentZoom - 12) * 0.1)
    );
    const iconSize = BASE_ICON_SIZE * zoomScale;

    // Inner icon size
    const innerIconSize = iconSize * 0.5;

    /* ---------------- Label logic ---------------- */

    const MIN_ZOOM_FOR_LABEL = 14;
    const shouldShowLabel = currentZoom >= MIN_ZOOM_FOR_LABEL;

    const baseFontSize = 11;
    const labelFontSize = Math.max(
        9,
        Math.min(13, baseFontSize + (currentZoom - 14) * 0.5)
    );
    const labelOpacity = Math.max(
        0.85,
        Math.min(1, 0.7 + (currentZoom - 12) * 0.075)
    );

    const displayName = amenity.name || categoryConfig.label;

    /* ---------------- Memoized icon ---------------- */

    const iconElement = useMemo(
        () => <Icon size={innerIconSize} color="white" strokeWidth={2.5} />,
        [Icon, innerIconSize]
    );

    return (
        <AdvancedMarker
            position={{
                lat: amenity.latitude,
                lng: amenity.longitude,
            }}
            onClick={onClick}
            zIndex={isSelected ? 9000 : 500}
            ref={handleRef}
        >
            <div
                className="amenity-marker-container"
                style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer',
                }}
            >
                {/* Icon */}
                <div
                    className="amenity-icon"
                    style={{
                        position: 'relative',
                        width: `${iconSize}px`,
                        height: `${iconSize}px`,
                        transform: isSelected ? 'scale(1.2)' : 'scale(1)',
                        transition: 'transform 0.2s ease-out',
                    }}
                >
                    {/* Background circle */}
                    <svg
                        width={iconSize}
                        height={iconSize}
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                        }}
                    >
                        <defs>
                            <filter
                                id={`amenity-shadow-${amenity.id}`}
                                x="-50%"
                                y="-50%"
                                width="200%"
                                height="200%"
                            >
                                <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" />
                                <feOffset dx="0" dy="1" result="offsetblur" />
                                <feComponentTransfer>
                                    <feFuncA type="linear" slope="0.4" />
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
                            fill={color}
                            stroke="white"
                            strokeWidth="2.5"
                            filter={`url(#amenity-shadow-${amenity.id})`}
                        />
                    </svg>

                    {/* Icon */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            pointerEvents: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {iconElement}
                    </div>
                </div>

                {/* Label */}
                {shouldShowLabel && (
                    <div
                        className="amenity-label"
                        style={{
                            color: color,
                            fontSize: `${labelFontSize}px`,
                            fontWeight: 500,
                            fontFamily: 'Roboto, Arial, sans-serif',
                            whiteSpace: 'nowrap',
                            maxWidth: '120px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            opacity: labelOpacity,
                            transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                            transformOrigin: 'center top',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        {displayName}
                    </div>
                )}
            </div>
        </AdvancedMarker>
    );
};
