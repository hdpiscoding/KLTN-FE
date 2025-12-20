import React, { useMemo, useEffect, useRef } from "react";
import { useMap, InfoWindow } from "@vis.gl/react-google-maps";
import { parseWKTToPaths } from "@/utils/wktParser";
import type {
  DistrictNewsData,
  SpecialIndicatorType,
} from "@/types/amenity.d.ts";
import { ExternalLink, AlertTriangle, CloudRain, Hammer } from "lucide-react";

interface DistrictLayerProps {
  districts: DistrictNewsData[];
  activeIndicator: SpecialIndicatorType;
  selectedDistrict: {
    data: DistrictNewsData;
    position: google.maps.LatLngLiteral;
  } | null;
  onSelectDistrict: (
    district: {
      data: DistrictNewsData;
      position: google.maps.LatLngLiteral;
    } | null
  ) => void;
}

const INDICATOR_CONFIG = {
  flood: { color: "#3b82f6", label: "Ngập lụt", icon: CloudRain }, // Blue
  accident: { color: "#ef4444", label: "Tai nạn", icon: AlertTriangle }, // Red
  project: { color: "#22c55e", label: "Dự án", icon: Hammer }, // Green
};

// Custom Polygon Component since it is not exported by @vis.gl/react-google-maps
const Polygon = (
  props: google.maps.PolygonOptions & {
    onClick?: (e: google.maps.PolyMouseEvent) => void;
  }
) => {
  const map = useMap();
  const polygonRef = useRef<google.maps.Polygon | null>(null);

  useEffect(() => {
    if (!map) return;

    if (!polygonRef.current) {
      polygonRef.current = new google.maps.Polygon(props);
      polygonRef.current.setMap(map);
    }

    return () => {
      if (polygonRef.current) {
        polygonRef.current.setMap(null);
      }
    };
  }, [map]);

  useEffect(() => {
    if (polygonRef.current) {
      polygonRef.current.setOptions(props);
    }
  }, [props]);

  // Handle click event
  useEffect(() => {
    if (!polygonRef.current || !props.onClick) return;

    const listener = polygonRef.current.addListener("click", props.onClick);
    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [props.onClick]);

  return null;
};

export const DistrictLayer: React.FC<DistrictLayerProps> = ({
  districts,
  activeIndicator,
  selectedDistrict,
  onSelectDistrict,
}) => {
  // Removed internal state for selectedDistrict to use props from parent

  // Filter out districts without boundaries
  const validDistricts = useMemo(
    () => districts.filter((d) => d.boundary_wkt),
    [districts]
  );

  if (!activeIndicator) return null;

  const config = INDICATOR_CONFIG[activeIndicator];

  const getOpacity = (score: number) => {
    // Normalize score (0-20 approx) to opacity (0.1 - 0.6)
    return Math.min(Math.max(score / 20, 0.1), 0.6);
  };

  const getScore = (district: DistrictNewsData) => {
    switch (activeIndicator) {
      case "flood":
        return district.stats.flood_score;
      case "accident":
        return district.stats.accident_score;
      case "project":
        return district.stats.project_score;
      default:
        return 0;
    }
  };

  return (
    <>
      {validDistricts.map((district) => {
        const paths = parseWKTToPaths(district.boundary_wkt!);
        const score = getScore(district);

        if (score <= 0) return null; // Don't render if no score for this indicator

        return (
          <Polygon
            key={district.district_id}
            paths={paths}
            strokeColor={config.color}
            strokeOpacity={0.8}
            strokeWeight={2}
            fillColor={config.color}
            fillOpacity={getOpacity(score)}
            onClick={(e) => {
              if (e.latLng) {
                onSelectDistrict({
                  data: district,
                  position: e.latLng.toJSON(),
                });
              }
            }}
          />
        );
      })}

      {selectedDistrict && (
        <InfoWindow
          position={selectedDistrict.position}
          onCloseClick={() => onSelectDistrict(null)}
          headerContent={
            <div className="flex items-center gap-2 px-1">
              <config.icon
                className="w-4 h-4"
                style={{ color: config.color }}
              />
              <span className="font-bold text-gray-800">
                {selectedDistrict.data.district_name}
              </span>
              <span className="ml-2 bg-white border border-gray-200 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {config.label}: {getScore(selectedDistrict.data).toFixed(1)}
              </span>
            </div>
          }
        >
          <div
            className="w-[300px] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs text-gray-500 mb-2">
              Các tin tức liên quan đến {config.label.toLowerCase()}:
            </p>

            <div className="h-[200px] pr-3 overflow-y-auto">
              <div className="space-y-3">
                {selectedDistrict.data.articles
                  .filter((a) => {
                    if (activeIndicator === "flood") return a.topic === "FLOOD";
                    if (activeIndicator === "accident")
                      return a.topic === "ACCIDENT";
                    if (activeIndicator === "project")
                      return a.topic === "PROJECT";
                    return false;
                  })
                  .map((article) => (
                    <div
                      key={article.id}
                      className="border-b border-gray-100 last:border-0 pb-2"
                    >
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-sm text-blue-600 hover:underline flex items-start gap-1 mb-1"
                      >
                        {article.title}
                        <ExternalLink className="w-3 h-3 mt-1 flex-shrink-0" />
                      </a>
                      <p className="text-xs text-gray-600 line-clamp-3">
                        {article.summary || "Không có tóm tắt."}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-[10px] text-gray-400">
                          {new Date(article.published_date).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                        <span
                          className={`text-[10px] px-1 rounded ${
                            article.sentiment === "POSITIVE"
                              ? "bg-green-100 text-green-700"
                              : article.sentiment === "NEGATIVE"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          Impact: {article.impact_score}
                        </span>
                      </div>
                    </div>
                  ))}
                {selectedDistrict.data.articles.filter((a) => {
                  if (activeIndicator === "flood") return a.topic === "FLOOD";
                  if (activeIndicator === "accident")
                    return a.topic === "ACCIDENT";
                  if (activeIndicator === "project")
                    return a.topic === "PROJECT";
                  return false;
                }).length === 0 && (
                  <div className="text-center py-4 text-gray-500 text-sm italic">
                    Không tìm thấy bài báo cụ thể.
                  </div>
                )}
              </div>
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
};
