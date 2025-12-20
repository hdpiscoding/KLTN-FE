// Main map component
export { default as MultipleMarkerMap } from './multiple-marker-map';
export { default } from './multiple-marker-map';

// Property components
export { PropertyMarker } from './components/PropertyMarker';
export { MarkersWithClustering } from './components/MarkersWithClustering';

// Amenity components
export { AmenityMarker } from './components/AmenityMarker';
export { AmenitiesWithClustering } from './components/AmenitiesWithClustering';
export { AmenityInfoCard } from './components/AmenityInfoCard';
export { AmenityFilterPanel } from './components/AmenityFilterPanel';

// Shared components
export { MapEventHandler } from './components/MapEventHandler';

// Hooks
export { useMapEvents } from './hooks/useMapEvents';
export type { MapBounds } from './hooks/useMapEvents';

// Utils
export { createClusterRenderer } from './utils/clusterRenderer';

// Constants
export * from './constants/mapConstants';
export * from './constants/amenityConstants';

// Types (re-export for convenience)
export type { PropertyMarker as PropertyMarkerType } from '@/types/property-marker.d.ts';
export type { Amenity, AmenityCategory, AmenityFilterState } from '@/types/amenity.d.ts';
export type { MultipleMarkerMapProps } from './multiple-marker-map';

