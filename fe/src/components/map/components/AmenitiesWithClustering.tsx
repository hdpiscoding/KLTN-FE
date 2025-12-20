import React, { useState, useCallback, useRef, useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import type {
  Amenity,
  AmenityFilterState,
  AmenityCategory,
} from "@/types/amenity.d.ts";
import { AmenityMarker } from "./AmenityMarker";
import { AMENITY_CATEGORIES } from "@/components/map";

interface AmenitiesWithClusteringProps {
  amenities: Amenity[];
  selectedAmenity: Amenity | null;
  onAmenitySelect: (amenity: Amenity) => void;
  currentZoom: number;
  filterState: AmenityFilterState;
  minZoomForMarkers?: number;
}

export const AmenitiesWithClustering: React.FC<
  AmenitiesWithClusteringProps
> = ({
  amenities,
  selectedAmenity,
  onAmenitySelect,
  currentZoom,
  filterState,
  minZoomForMarkers = 12,
}) => {
  const map = useMap();
  // Separate markers by category
  const [markersByCategory, setMarkersByCategory] = useState<{
    [K in AmenityCategory]?: {
      [key: string]: google.maps.marker.AdvancedMarkerElement;
    };
  }>({});
  // Separate clusterer for each category
  const clusterersByCategory = useRef<{
    [K in AmenityCategory]?: MarkerClusterer;
  }>({});

  // Don't render if zoom too low
  const shouldShowMarkers = currentZoom >= minZoomForMarkers;

  // Filter amenities based on filter state
  const filteredAmenities = amenities.filter(
    (amenity) => filterState[amenity.category]
  );

  // Initialize clusterers for each category with category-specific colors
  useEffect(() => {
    if (!map) return;

    // Create a clusterer for each amenity category
    const categories = Object.keys(AMENITY_CATEGORIES) as AmenityCategory[];

    categories.forEach((category) => {
      const categoryConfig = AMENITY_CATEGORIES[category];
      const color = categoryConfig.color;

      clusterersByCategory.current[category] = new MarkerClusterer({
        map,
        renderer: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          render: ({ count, position }: any) => {
            // Use category-specific color for cluster
            const svg = `
                            <svg fill="${color}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="40" height="40">
                                <circle cx="120" cy="120" opacity=".5" r="70" />
                                <circle cx="120" cy="120" opacity=".3" r="90" />
                                <circle cx="120" cy="120" opacity=".2" r="110" />
                                <text x="50%" y="50%" style="fill:#fff" text-anchor="middle" font-size="50" dominant-baseline="middle" font-family="roboto,arial,sans-serif" font-weight="500">${count}</text>
                            </svg>
                        `;

            const parser = new DOMParser();
            const svgEl = parser.parseFromString(
              svg,
              "image/svg+xml"
            ).documentElement;
            svgEl.setAttribute("transform", "translate(0 20)");

            // Handle position - it can be LatLng with lat()/lng() methods or LatLngLiteral
            const pos =
              typeof position.lat === "function"
                ? { lat: position.lat(), lng: position.lng() }
                : position;

            return new google.maps.marker.AdvancedMarkerElement({
              position: pos,
              content: svgEl,
              zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
            });
          },
        },
      });
    });

    return () => {
      // Cleanup all clusterers
      Object.values(clusterersByCategory.current).forEach((clusterer) => {
        clusterer?.clearMarkers();
      });
      clusterersByCategory.current = {};
    };
  }, [map]);

  // Update clusterers when markers change
  useEffect(() => {
    // Clear all clusterers
    Object.values(clusterersByCategory.current).forEach((clusterer) => {
      clusterer?.clearMarkers();
    });

    // Add markers to their respective category clusterers
    Object.entries(markersByCategory).forEach(([category, markers]) => {
      const clusterer =
        clusterersByCategory.current[category as AmenityCategory];
      if (clusterer && markers) {
        const markersList = Object.values(markers);
        if (markersList.length > 0) {
          clusterer.addMarkers(markersList);
          console.log(
            `📍 Clustered ${markersList.length} ${category} amenity markers`
          );
        }
      }
    });
  }, [markersByCategory]);

  // Ref callback to collect marker instances organized by category
  const setMarkerRef = useCallback(
    (
      marker: google.maps.marker.AdvancedMarkerElement | null,
      key: string,
      category: AmenityCategory
    ) => {
      setMarkersByCategory((prevMarkers) => {
        const categoryMarkers = prevMarkers[category] || {};

        if (marker) {
          // Only update if marker is new or different
          if (categoryMarkers[key] === marker) {
            return prevMarkers; // No change, return same reference
          }
          return {
            ...prevMarkers,
            [category]: {
              ...categoryMarkers,
              [key]: marker,
            },
          };
        } else {
          // Remove marker
          if (!categoryMarkers[key]) {
            return prevMarkers; // No change, return same reference
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [key]: _, ...restMarkers } = categoryMarkers;
          return {
            ...prevMarkers,
            [category]: restMarkers,
          };
        }
      });
    },
    []
  );

  if (!shouldShowMarkers) {
    return null;
  }

  return (
    <>
      {filteredAmenities.map((amenity) => {
        const markerKey = `amenity-${amenity.id}`;

        return (
          <AmenityMarker
            key={markerKey}
            amenity={amenity}
            isSelected={selectedAmenity?.id === amenity.id}
            currentZoom={currentZoom}
            onClick={() => onAmenitySelect(amenity)}
            setMarkerRef={setMarkerRef}
          />
        );
      })}
    </>
  );
};
