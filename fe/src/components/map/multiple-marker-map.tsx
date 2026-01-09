import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { APIProvider, Map, InfoWindow } from "@vis.gl/react-google-maps";
import { PropertyPopupCard } from "@/components/card-item/property-popup-card.tsx";
import type { PropertyMarker } from "@/types/property-marker.d.ts";
import type {
  Amenity,
  AmenityFilterState,
  AmenityCategory,
  DistrictNewsData,
  SpecialIndicatorType,
} from "@/types/amenity.d.ts";
import { MarkersWithClustering } from "./components/MarkersWithClustering";
import { AmenitiesWithClustering } from "./components/AmenitiesWithClustering";
import { AmenityFilterPanel } from "./components/AmenityFilterPanel";
import { AmenityInfoCard } from "./components/AmenityInfoCard";
import { MapEventHandler } from "./components/MapEventHandler";
import { DistrictLayer } from "./components/DistrictLayer";
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_ZOOM,
  MIN_ZOOM_FOR_MARKERS,
} from "./constants/mapConstants";
import {
  getAmenitiesWithinViewPort,
  getDistrictNewsInBounds,
} from "@/services/propertyServices";

// ============================================
// TYPES
// ============================================
export interface MultipleMarkerMapProps {
  properties: PropertyMarker[];
  defaultZoom?: number;
  height?: string;
  width?: string;
  centerLat?: number;
  centerLng?: number;
  onMapInteraction?: (bounds: {
    minLat: number;
    minLng: number;
    maxLat: number;
    maxLng: number;
    zoom: number;
  }) => void;
}

// Định nghĩa kiểu Bounds để dễ xử lý cache
type MapBounds = {
  minLat: number;
  minLng: number;
  maxLat: number;
  maxLng: number;
  zoom: number;
};

// ============================================
// MAIN COMPONENT
// ============================================
const MultipleMarkerMap: React.FC<MultipleMarkerMapProps> = ({
  properties,
  defaultZoom = DEFAULT_ZOOM,
  height = "100%",
  width = "100%",
  centerLat,
  centerLng,
  onMapInteraction,
}) => {
  const [selectedProperty, setSelectedProperty] =
    useState<PropertyMarker | null>(null);
  const [currentZoom, setCurrentZoom] = useState<number>(defaultZoom);
  const [currentBounds, setCurrentBounds] = useState<MapBounds | null>(null);

  // Amenity states
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [selectedAmenity, setSelectedAmenity] = useState<Amenity | null>(null);
  const [amenityFilterState, setAmenityFilterState] =
    useState<AmenityFilterState>({
      healthcare: false,
      education: false,
      transportation: false,
      environment: false,
      public_safety: false,
      shopping: false,
      entertainment: false,
    });

  // Special Indicator States
  const [activeIndicator, setActiveIndicator] =
    useState<SpecialIndicatorType>(null);
  const [districtsData, setDistrictsData] = useState<DistrictNewsData[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<{
    data: DistrictNewsData;
    position: google.maps.LatLngLiteral;
  } | null>(null);

  // --- OPTIMIZATION REFS (CACHE) ---
  // 1. Lưu trữ ID của các amenities đã tải để chống trùng lặp
  const loadedAmenityIds = useRef<Set<number>>(new Set());

  // 2. Lưu trữ các vùng bản đồ (Bounds) đã tải dữ liệu thành công
  // Giúp tránh gọi API lại khi user pan qua lại vùng cũ
  const fetchedRegions = useRef<MapBounds[]>([]);

  const center = useMemo(() => {
    if (centerLat !== undefined && centerLng !== undefined) {
      return { lat: centerLat, lng: centerLng };
    }
    return DEFAULT_MAP_CENTER;
  }, [centerLat, centerLng]);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

  const mapStyles = useMemo(
    () => [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
      { featureType: "poi.business", stylers: [{ visibility: "off" }] },
      {
        featureType: "poi.park",
        elementType: "labels.text",
        stylers: [{ visibility: "off" }],
      },
    ],
    []
  );

  const amenityCounts = useMemo(() => {
    const counts: Partial<Record<AmenityCategory, number>> = {};
    amenities.forEach((a) => {
      counts[a.category] = (counts[a.category] || 0) + 1;
    });
    return counts;
  }, [amenities]);

  // --- HELPER: CHECK IF BOUNDS ARE CACHED ---
  const isRegionCached = (bounds: MapBounds): boolean => {
    // Kiểm tra xem bounds hiện tại có nằm TRỌN VẸN trong một bounds đã fetch không
    return fetchedRegions.current.some(
      (cached) =>
        bounds.minLat >= cached.minLat &&
        bounds.maxLat <= cached.maxLat &&
        bounds.minLng >= cached.minLng &&
        bounds.maxLng <= cached.maxLng
      // Lưu ý: Không check zoom chặt chẽ vì data amenities dựa trên lat/lng là chính
      // Tuy nhiên nếu zoom in quá sâu có thể cần logic khác, nhưng ở đây tạm bỏ qua
    );
  };

  // --- DATA FETCHING ---

  const fetchAmenities = useCallback(
    async (bounds: MapBounds, filterState: AmenityFilterState) => {
      if (bounds.zoom < MIN_ZOOM_FOR_MARKERS) {
        // Không clear amenities để tránh nhấp nháy khi zoom out/in nhanh
        // Chỉ clear khi thực sự cần thiết hoặc memory quá lớn
        return;
      }

      // [OPTIMIZATION 1] Kiểm tra xem vùng này đã fetch chưa
      if (isRegionCached(bounds)) {
        console.log("Skipping fetch: Region already cached");
        return;
      }

      try {
        const enabledCategories = (
          Object.keys(filterState) as AmenityCategory[]
        ).filter((category) => filterState[category]);

        if (enabledCategories.length === 0) {
          // Nếu không chọn category nào -> Clear cache hiển thị nhưng giữ cache vùng
          if (amenities.length > 0) setAmenities([]);
          return;
        }

        // Gọi API (Lấy rộng hơn bounds thực tế một chút để pre-fetch vùng lân cận)
        // Hệ số buffer: 0.005 độ (~500m)
        const buffer = 0.005;
        const fetchBounds = {
          minLat: bounds.minLat - buffer,
          minLng: bounds.minLng - buffer,
          maxLat: bounds.maxLat + buffer,
          maxLng: bounds.maxLng + buffer,
        };

        const amenityPromises = enabledCategories.map((category) =>
          getAmenitiesWithinViewPort(
            fetchBounds.minLat,
            fetchBounds.minLng,
            fetchBounds.maxLat,
            fetchBounds.maxLng,
            category,
            200
          )
        );

        const results = await Promise.all(amenityPromises);
        const incomingAmenities = results.flatMap(
          (result) => result.data.items || []
        );

        // [OPTIMIZATION 2] Deduplication & Smart State Update
        const newUniqueAmenities: Amenity[] = [];
        let hasChanges = false;

        incomingAmenities.forEach((item) => {
          if (!loadedAmenityIds.current.has(item.id)) {
            loadedAmenityIds.current.add(item.id);
            newUniqueAmenities.push(item);
            hasChanges = true;
          }
        });

        if (hasChanges) {
          // Chỉ set state khi có dữ liệu mới -> Tránh Re-render thừa
          setAmenities((prev) => [...prev, ...newUniqueAmenities]);

          // Lưu vùng vừa fetch vào cache
          // Lưu ý: Lưu fetchBounds (vùng rộng hơn) chứ không phải bounds hiện tại
          fetchedRegions.current.push({ ...bounds, ...fetchBounds });

          console.log(`Loaded ${newUniqueAmenities.length} new amenities.`);
        } else {
          // Nếu API trả về toàn dữ liệu cũ -> Vẫn đánh dấu vùng này đã fetch để lần sau không gọi nữa
          fetchedRegions.current.push({ ...bounds, ...fetchBounds });
          console.log("No new amenities found in this region.");
        }
      } catch (error) {
        console.error("Error fetching amenities:", error);
      }
    },
    [amenities]
  ); // amenities dependency here is fine as we use functional update

  const fetchDistrictNews = useCallback(async (bounds: MapBounds) => {
    // News thì ít khi thay đổi tọa độ và số lượng ít, nên có thể cache đơn giản hoặc gọi lại cũng nhẹ
    // Tuy nhiên nên debounce kỹ
    try {
      const response = await getDistrictNewsInBounds(
        bounds.minLat,
        bounds.minLng,
        bounds.maxLat,
        bounds.maxLng
      );
      if (response.data?.items) {
        // So sánh sơ bộ length để tránh render nếu không đổi (Optional)
        setDistrictsData(response.data.items);
      }
    } catch (error) {
      console.error("Error fetching district news:", error);
    }
  }, []);

  // --- EFFECT: DEBOUNCE & LOGIC ---
  useEffect(() => {
    if (!currentBounds) return;

    const timer = setTimeout(() => {
      // 1. Amenities logic
      fetchAmenities(currentBounds, amenityFilterState);

      // 2. District News logic
      if (activeIndicator) {
        fetchDistrictNews(currentBounds);
      } else {
        setDistrictsData([]);
        setSelectedDistrict(null);
      }
    }, 400); // Debounce 400ms

    return () => clearTimeout(timer);
  }, [
    currentBounds,
    amenityFilterState,
    activeIndicator,
    fetchAmenities,
    fetchDistrictNews,
  ]);

  // Handle filter change: Clear cache liên quan đến filter để fetch lại nếu cần
  // Hoặc thông minh hơn: Chỉ fetch category mới bật
  const handleFilterChange = (category: AmenityCategory, enabled: boolean) => {
    const newFilterState = { ...amenityFilterState, [category]: enabled };
    setAmenityFilterState(newFilterState);

    // Nếu bật một filter mới, ta cần reset region cache hoặc logic phức tạp hơn
    // Cách đơn giản nhất để đảm bảo data đúng:
    // Khi filter thay đổi, ta cho phép fetch lại vùng hiện tại (bỏ qua check region cache tạm thời)
    // Nhưng vẫn giữ check ID cache để không duplicate
    if (enabled) {
      // Xóa region cache hiện tại để ép buộc gọi API cho category mới bật
      // (ID Cache vẫn giữ để không render lại cái cũ)
      fetchedRegions.current = [];
    } else {
      // Nếu tắt filter -> Lọc state amenities
      // Cần cập nhật lại state để ẩn các amenities thuộc category đã tắt
      // Lưu ý: loadedAmenityIds vẫn giữ, vì nếu bật lại thì không cần fetch
      setAmenities((prev) => prev.filter((a) => a.category !== category));
    }
  };

  const handleMapInteraction = (bounds: MapBounds) => {
    setCurrentBounds(bounds);
    onMapInteraction?.(bounds);
  };

  return (
    <div className="relative" style={{ width, height }}>
      <APIProvider apiKey={apiKey}>
        <Map
          mapId="b4e09e31598ea5482295a4f9"
          defaultCenter={center}
          defaultZoom={defaultZoom}
          gestureHandling="greedy"
          disableDefaultUI={false}
          zoomControl={true}
          mapTypeControl={false}
          streetViewControl={false}
          fullscreenControl={true}
          clickableIcons={false}
          styles={mapStyles}
          style={{ width: "100%", height: "100%" }}
        >
          <MapEventHandler
            onZoomChange={setCurrentZoom}
            onMapInteraction={handleMapInteraction}
            onMapClick={() => {
              setSelectedProperty(null);
              setSelectedAmenity(null);
              setSelectedDistrict(null);
            }}
          />

          <DistrictLayer
            districts={districtsData}
            activeIndicator={activeIndicator}
            selectedDistrict={selectedDistrict}
            onSelectDistrict={setSelectedDistrict}
          />

          {/* Dùng React.memo cho component này nếu có thể */}
          <MarkersWithClustering
            properties={properties}
            selectedProperty={selectedProperty}
            onPropertySelect={setSelectedProperty}
            currentZoom={currentZoom}
            minZoomForMarkers={MIN_ZOOM_FOR_MARKERS}
          />

          {/* Dùng React.memo cho component này nếu có thể */}
          <AmenitiesWithClustering
            amenities={amenities}
            selectedAmenity={selectedAmenity}
            onAmenitySelect={setSelectedAmenity}
            currentZoom={currentZoom}
            filterState={amenityFilterState}
            minZoomForMarkers={MIN_ZOOM_FOR_MARKERS}
          />

          {/* Popups... (Giữ nguyên) */}
          {selectedProperty && (
            <InfoWindow
              pixelOffset={[0, -30]}
              position={{
                lat: selectedProperty.location.latitude,
                lng: selectedProperty.location.longitude,
              }}
              onCloseClick={() => setSelectedProperty(null)}
              headerDisabled
            >
              <div onClick={(e) => e.stopPropagation()}>
                <PropertyPopupCard
                  id={selectedProperty.id}
                  title={selectedProperty.title}
                  listingType={selectedProperty.listingType}
                  image={selectedProperty.image}
                  address={selectedProperty.location.address}
                  price={selectedProperty.price}
                  area={selectedProperty.area}
                  onClose={() => setSelectedProperty(null)}
                />
              </div>
            </InfoWindow>
          )}

          {selectedAmenity && (
            <InfoWindow
              pixelOffset={[0, -50]}
              position={{
                lat: selectedAmenity.latitude,
                lng: selectedAmenity.longitude,
              }}
              onCloseClick={() => setSelectedAmenity(null)}
              headerDisabled
            >
              <div onClick={(e) => e.stopPropagation()}>
                <AmenityInfoCard
                  amenity={selectedAmenity}
                  onClose={() => setSelectedAmenity(null)}
                />
              </div>
            </InfoWindow>
          )}
        </Map>

        <AmenityFilterPanel
          filterState={amenityFilterState}
          onFilterChange={handleFilterChange}
          amenityCounts={amenityCounts}
          activeIndicator={activeIndicator}
          onIndicatorChange={setActiveIndicator}
        />

        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg px-4 py-2 border border-gray-200 z-10">
          <p className="text-sm font-semibold text-gray-800">
            {properties.length} bất động sản
            {amenities.length > 0 && ` • ${amenities.length} tiện ích`}
          </p>
          {activeIndicator && districtsData.length > 0 && (
            <p className="text-xs text-blue-600 font-medium mt-1">
              🔥 Đang hiển thị heatmap: {districtsData.length} khu vực
            </p>
          )}
          {currentZoom < MIN_ZOOM_FOR_MARKERS ? (
            <p className="text-xs text-amber-600 font-medium">
              📍 Phóng to bản đồ để xem marker
            </p>
          ) : (
            <p className="text-xs text-gray-500">
              Click vào marker để xem chi tiết
            </p>
          )}
        </div>
      </APIProvider>
    </div>
  );
};

export default MultipleMarkerMap;
