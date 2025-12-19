/**
 * Default map center (Ho Chi Minh City)
 */
export const DEFAULT_MAP_CENTER = {
    lat: 10.776204550769549,
    lng: 106.70103773964006,
};

/**
 * Minimum zoom level to show markers
 */
export const MIN_ZOOM_FOR_MARKERS = 12;

/**
 * Default zoom level for map
 */
export const DEFAULT_ZOOM = 11;

/**
 * Theme colors
 */
export const THEME_COLORS = {
    primary: '#008DDA',
    markerSelected: '#008DDA',
    markerNormal: '#E53935',
    cluster: '#008DDA',
};

/**
 * Map configuration
 */
export const MAP_CONFIG = {
    debounceDelay: 800, // ms
    minZoomForAPI: 12,
};

/**
 * Map styles to hide default POIs
 * This allows us to show only custom amenity markers
 */
export const MAP_STYLES_HIDE_POIS: google.maps.MapTypeStyle[] = [
    {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }],
    },
    {
        featureType: 'poi.business',
        stylers: [{ visibility: 'off' }],
    },
    {
        featureType: 'poi.medical',
        stylers: [{ visibility: 'off' }],
    },
    {
        featureType: 'poi.school',
        stylers: [{ visibility: 'off' }],
    },
    {
        featureType: 'poi.park',
        stylers: [{ visibility: 'off' }],
    },
    {
        featureType: 'poi.attraction',
        stylers: [{ visibility: 'off' }],
    },
    {
        featureType: 'poi.government',
        stylers: [{ visibility: 'off' }],
    },
    {
        featureType: 'poi.place_of_worship',
        stylers: [{ visibility: 'off' }],
    },
    {
        featureType: 'poi.sports_complex',
        stylers: [{ visibility: 'off' }],
    },
    {
        featureType: 'transit',
        elementType: 'labels.icon',
        stylers: [{ visibility: 'off' }],
    },
];

