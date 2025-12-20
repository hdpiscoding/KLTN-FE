/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Search, MapIcon, X, List } from "lucide-react"; // Thêm icon X và List
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { DISTRICTS } from "@/constants/districts.ts";
import { PROPERTY_TYPES } from "@/constants/propertyTypes.ts";
import { PRICE_RANGES } from "@/constants/priceRanges.ts";
import { PROPERTY_SORT_CRITERIAS } from "@/constants/propertySortCriterias.ts";
import { PropertyListItem } from "@/components/list-item/property-list-item.tsx";
import { PropertyTypeFilter } from "@/components/general/property-type-filter.tsx";
import { PropertyDistrictFilter } from "@/components/general/property-district-filter.tsx";
import { ControlledPagination } from "@/components/ui/controlled-pagination.tsx";

import MultipleMarkerMap from "@/components/map/multiple-marker-map";
import type { PropertyListing } from "@/types/property-listing";
import { useSearchFilters } from "@/hooks/use-search-filters.ts";
import {
  searchProperties,
  getRecommendedProperties,
  getPropertiesWithinViewPort,
} from "@/services/propertyServices.ts";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import {
  getPriceRangeValue,
  getPriceRangeId,
} from "@/utils/priceRangeHelper.ts";
import { getSortCriteriaValue } from "@/utils/sortCriteriaHelper.ts";
import { useSearchParams } from "react-router-dom";
import {
  likeProperty,
  unlikeProperty,
  checkLikeProperty,
} from "@/services/userServices.ts";
import { useUserStore } from "@/store/userStore.ts";
import { useDebounce } from "use-debounce";
import type { PropertyMarker } from "@/types/property-marker";
import { Capacitor } from "@capacitor/core"; // Import Capacitor

// ... (Giữ nguyên các interface RecommendedPropertyItem và MapBounds)
interface RecommendedPropertyItem {
  id: number;
  title: string;
  price: number;
  price_unit: string;
  area: number;
  address: string;
  num_bedrooms: number;
  num_bathrooms: number;
  thumbnail_url: string | null;
  distance_km: number;
  recommendation_type: string;
}

type MapBounds = {
  minLat: number;
  minLng: number;
  maxLat: number;
  maxLng: number;
  zoom: number;
};

export const BuyProperty: React.FC = () => {
  // ... (Giữ nguyên toàn bộ State và Logic Hook)
  const [searchValue, setSearchValue] = useState("");
  const [district, setDistrict] = useState("all");
  const [propertyType, setPropertyType] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortCriteria, setSortCriteria] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [propertyList, setPropertyList] = useState<PropertyListing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { filters, setFilter } = useSearchFilters();
  const [searchParams, setSearchParams] = useSearchParams();
  const [likedProperties, setLikedProperties] = useState<Set<string>>(
    new Set()
  );

  const { userId, isLoggedIn } = useUserStore();
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [locationPermission, setLocationPermission] = useState<
    "granted" | "denied" | "prompt" | null
  >(null);
  const [, setRecommendedProperties] = useState<PropertyListing[]>([]);
  const [, setIsLoadingRecommended] = useState(false);

  const allFetchedProperties = useRef<Map<number, PropertyListing>>(new Map());
  const fetchedRegions = useRef<MapBounds[]>([]);
  const checkedLikedIds = useRef<Set<number>>(new Set());

  // ... (Giữ nguyên các hàm requestUserLocation, propertyMarkers, handleSearchKeyDown, executeSearch, checkLikedStatus)
  const requestUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser");
      setLocationPermission("denied");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(location);
        setLocationPermission("granted");
        console.log(
          "User location obtained:",
          position.coords.latitude,
          position.coords.longitude
        );
      },
      (error) => {
        console.error("Error getting location:", error);
        setLocationPermission("denied");
      }
    );
  }, []);

  const propertyMarkers: PropertyMarker[] = propertyList
    .filter((property) => property.location?.coordinates)
    .map((property) => ({
      id: String(property.id),
      location: {
        latitude: property.location.coordinates[1],
        longitude: property.location.coordinates[0],
        address: `${property.addressStreet}, ${property.addressWard}, ${property.addressDistrict}, ${property.addressCity}`,
      },
      title: property.title,
      image: property.imageUrls?.[0] || "",
      price: property.price,
      area: property.area,
    }));

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      executeSearch();
    }
  };

  const executeSearch = () => {
    const trimmedValue = searchValue.trim();
    if (trimmedValue) {
      setFilter("title", "lk", trimmedValue);
    } else {
      setFilter("title", "lk", "");
    }
  };

  const checkLikedStatus = useCallback(
    async (properties: PropertyListing[]) => {
      if (!userId || !isLoggedIn) return;
      const uncheckedProperties = properties.filter(
        (p) => !checkedLikedIds.current.has(p.id!)
      );
      if (uncheckedProperties.length === 0) return;

      try {
        uncheckedProperties.forEach((p) => checkedLikedIds.current.add(p.id!));
        const newLikedIds = new Set<string>();
        await Promise.all(
          uncheckedProperties.map(async (property) => {
            try {
              const response = await checkLikeProperty(Number(property.id));
              if (response.data) {
                newLikedIds.add(String(property.id));
              }
            } catch (error) {
              checkedLikedIds.current.delete(property.id!);
            }
          })
        );
        setLikedProperties((prev) => {
          const next = new Set(prev);
          newLikedIds.forEach((id) => next.add(id));
          return next;
        });
      } catch (error) {
        console.error("Error checking liked properties:", error);
      }
    },
    [userId, isLoggedIn]
  );

  const handleToggleMap = () => {
    setIsMapOpen(!isMapOpen);
  };

  // ... (Giữ nguyên các hàm helper Cache, Map Interaction)
  const isRegionCached = (bounds: MapBounds): boolean => {
    return fetchedRegions.current.some(
      (cached) =>
        bounds.minLat >= cached.minLat &&
        bounds.maxLat <= cached.maxLat &&
        bounds.minLng >= cached.minLng &&
        bounds.maxLng <= cached.maxLng
    );
  };

  const filterPropertiesFromCache = (bounds: MapBounds) => {
    const visibleProperties: PropertyListing[] = [];
    allFetchedProperties.current.forEach((property) => {
      const [lng, lat] = property.location.coordinates;
      if (
        lat >= bounds.minLat &&
        lat <= bounds.maxLat &&
        lng >= bounds.minLng &&
        lng <= bounds.maxLng
      ) {
        visibleProperties.push(property);
      }
    });
    return visibleProperties;
  };

  const handleMapInteractionCore = useCallback(
    async (bounds: {
      minLat: number;
      minLng: number;
      maxLat: number;
      maxLng: number;
      zoom: number;
    }) => {
      if (bounds.zoom < 10) return;
      if (isRegionCached(bounds)) {
        const cachedProps = filterPropertiesFromCache(bounds);
        setPropertyList(cachedProps);
        setTotalPages(1);
        await checkLikedStatus(cachedProps);
        return;
      }

      try {
        const buffer = 0.01;
        const fetchBounds = {
          minLat: bounds.minLat - buffer,
          minLng: bounds.minLng - buffer,
          maxLat: bounds.maxLat + buffer,
          maxLng: bounds.maxLng + buffer,
        };

        const response = await getPropertiesWithinViewPort(
          fetchBounds.minLat,
          fetchBounds.minLng,
          fetchBounds.maxLat,
          fetchBounds.maxLng
        );

        if (response.status === "200" && response.data) {
          const mappedProperties: PropertyListing[] = response.data
            .filter((item: any) => {
              const listingType = item.listingType || item.listing_type;
              return listingType === "for_sale";
            })
            .map((item: any) => ({
              id: item.id,
              userId: item.user_id || 0,
              approvalStatus: "APPROVED",
              title: item.title,
              description: item.description || "",
              listingType: item.listingType || item.listing_type || "for_sale",
              price: item.price,
              priceUnit: item.priceUnit || item.price_unit || "VND",
              area: item.area,
              propertyType: item.propertyType || item.property_type || "house",
              legalStatus: item.legalStatus || item.legal_status || null,
              numBedrooms: item.numBedrooms || item.num_bedrooms || null,
              numBathrooms: item.numBathrooms || item.num_bathrooms || null,
              numFloors: item.numFloors || item.num_floors || null,
              facadeWidthM: item.facadeWidthM || item.facade_width_m || null,
              roadWidthM: item.roadWidthM || item.road_width_m || null,
              houseDirection:
                item.houseDirection || item.house_direction || null,
              balconyDirection:
                item.balconyDirection || item.balcony_direction || null,
              furnitureStatus:
                item.furnitureStatus || item.furniture_status || null,
              addressStreet: item.addressStreet || item.address_street || "",
              addressWard: item.addressWard || item.address_ward || "",
              addressDistrict:
                item.addressDistrict || item.address_district || "",
              addressCity: item.addressCity || item.address_city || "TPHCM",
              location: item.location,
              imageUrls: item.thumbnailUrl
                ? [item.thumbnailUrl]
                : item.imageUrls || item.image_urls || [],
              createdAt:
                item.createdAt || item.created_at || new Date().toISOString(),
              updatedAt:
                item.updatedAt || item.updated_at || new Date().toISOString(),
            }));

          mappedProperties.forEach((p) => {
            allFetchedProperties.current.set(p.id!, p);
          });
          fetchedRegions.current.push({ ...bounds, ...fetchBounds });

          const visibleProps = filterPropertiesFromCache(bounds);
          setPropertyList(visibleProps);
          setTotalPages(1);

          if (userId) {
            await checkLikedStatus(mappedProperties);
          }
        }
      } catch (error) {
        console.error("Error fetching viewport properties:", error);
      }
    },
    [userId, checkLikedStatus]
  );

  const [debouncedHandleMapInteraction] = useDebounce(
    handleMapInteractionCore,
    500
  );

  const handleMapInteraction = useCallback(
    (bounds: any) => {
      debouncedHandleMapInteraction(bounds);
    },
    [debouncedHandleMapInteraction]
  );

  // ... (Giữ nguyên handleFavoriteClick, handleDistrictChange, getRecommendedPropertiesData, handlePropertyTypeChange, handleSortChange, handlePriceRangeChange, handlePageChange, các useEffect)
  const handleFavoriteClick = async (
    id: string,
    currentLikedState: boolean
  ) => {
    try {
      const propertyId = Number(id);
      if (currentLikedState) {
        await unlikeProperty(propertyId);
        setLikedProperties((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      } else {
        await likeProperty(propertyId);
        setLikedProperties((prev) => new Set(prev).add(id));
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleDistrictChange = (value: string) => {
    setDistrict(value);
    if (value === "all") {
      setFilter("addressDistrict", "eq", "");
    } else {
      const districtName = DISTRICTS.find((d) => d.id === value)?.name;
      if (districtName) {
        setFilter("addressDistrict", "eq", districtName);
      }
    }
  };

  const getRecommendedPropertiesData = useCallback(async () => {
    try {
      setIsLoadingRecommended(true);

      if (locationPermission === "granted" && userLocation) {
        let response;
        if (userId) {
          response = await getRecommendedProperties(
            userLocation.lat,
            userLocation.lng,
            8,
            20,
            userId
          );
        } else {
          response = await getRecommendedProperties(
            userLocation.lat,
            userLocation.lng,
            8,
            20
          );
        }

        if (response.status === "200" && response.data?.items) {
          const mappedProperties: PropertyListing[] = response.data.items.map(
            (item: RecommendedPropertyItem) => ({
              id: item.id,
              title: item.title,
              price: item.price,
              priceUnit: item.price_unit,
              area: item.area,
              addressDistrict:
                item.address
                  .split(",")
                  .map((s: string) => s.trim())
                  .find(
                    (s: string) => s.includes("Quận") || s.includes("Huyện")
                  ) || "",
              addressStreet: item.address.split(",")[0]?.trim() || "",
              addressWard:
                item.address
                  .split(",")
                  .map((s: string) => s.trim())
                  .find(
                    (s: string) => s.includes("Phường") || s.includes("Xã")
                  ) || "",
              addressCity: "TPHCM",
              numBedrooms: item.num_bedrooms,
              numBathrooms: item.num_bathrooms,
              imageUrls: item.thumbnail_url ? [item.thumbnail_url] : [],
              listingType: "for_sale",
              propertyType: "house",
              approvalStatus: "APPROVED",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              userId: 0,
              location: { type: "Point", coordinates: [0, 0] },
            })
          );

          setRecommendedProperties(mappedProperties);
        } else {
          setRecommendedProperties([]);
        }
      } else {
        setRecommendedProperties([]);
      }
    } catch (error) {
      console.error("Error fetching recommended properties:", error);
      setRecommendedProperties([]);
    } finally {
      setIsLoadingRecommended(false);
    }
  }, [locationPermission, userLocation, userId]);

  const handlePropertyTypeChange = (value: string) => {
    setPropertyType(value);
    if (value === "all") {
      setFilter("propertyType", "eq", "");
    } else {
      setFilter("propertyType", "eq", value);
    }
  };

  const handleSortChange = (value: string) => {
    setSortCriteria(value);
    const params = new URLSearchParams(searchParams);
    if (value === "default") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    setSearchParams(params);
  };

  const handlePriceRangeChange = (value: string) => {
    setPriceRange(value);
    if (value === "all") {
      setFilter("price", "rng", "");
    } else {
      const rangeValue = getPriceRangeValue(value);
      if (rangeValue) {
        setFilter("price", "rng", rangeValue);
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const districtFilter = filters.find(
      (f) => f.key === "addressDistrict" && f.operator === "eq"
    );
    if (districtFilter) {
      const districtId = DISTRICTS.find(
        (d) => d.name === districtFilter.value
      )?.id;
      if (districtId) {
        setDistrict(districtId);
      }
    } else {
      setDistrict("all");
    }
  }, [filters]);

  useEffect(() => {
    const propertyTypeFilter = filters.find(
      (f) => f.key === "propertyType" && f.operator === "eq"
    );
    if (propertyTypeFilter) {
      setPropertyType(propertyTypeFilter.value);
    } else {
      setPropertyType("all");
    }
  }, [filters]);

  useEffect(() => {
    const sortParam = searchParams.get("sort");
    if (sortParam) {
      setSortCriteria(sortParam);
    } else {
      setSortCriteria("default");
    }
  }, [searchParams]);

  useEffect(() => {
    const priceFilter = filters.find(
      (f) => f.key === "price" && f.operator === "rng"
    );
    if (priceFilter) {
      const rangeId = getPriceRangeId(priceFilter.value);
      if (rangeId) {
        setPriceRange(rangeId);
      }
    } else {
      setPriceRange("all");
    }
  }, [filters]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        const apiFilters = filters.map((filter) => ({
          key: filter.key,
          operator:
            filter.operator === "eq"
              ? "equal"
              : filter.operator === "gt"
              ? "greater"
              : filter.operator === "lt"
              ? "less"
              : filter.operator === "gte"
              ? "greater_equal"
              : filter.operator === "lte"
              ? "less_equal"
              : filter.operator === "lk"
              ? "like"
              : filter.operator === "rng"
              ? "range"
              : "equal",
          value: filter.value,
        }));

        const filtersWithType = [
          ...apiFilters,
          {
            key: "listingType",
            operator: "equal",
            value: "for_sale",
          },
          {
            key: "approvalStatus",
            operator: "equal",
            value: "APPROVED",
          },
        ];

        let sorts = [{ key: "createdAt", type: "DESC" }];
        const sortParam = searchParams.get("sort");
        if (sortParam && sortParam !== "default") {
          const sortValue = getSortCriteriaValue(sortParam);
          if (sortValue) {
            sorts = [sortValue];
          }
        }

        const response = await searchProperties({
          filters: filtersWithType,
          sorts: sorts,
          rpp: 10,
          page: currentPage,
        });

        setPropertyList(response.data.items);
        setTotalPages(response.data.pages || 1);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [filters, currentPage, searchParams]);

  useEffect(() => {
    getRecommendedPropertiesData();
  }, [getRecommendedPropertiesData]);

  useEffect(() => {
    if (locationPermission === null) {
      requestUserLocation();
    }
  }, [locationPermission, requestUserLocation]);

  useEffect(() => {
    if (propertyList.length > 0) {
      checkLikedStatus(propertyList);
    }
  }, [propertyList]);

  useEffect(() => {
    if (isMapOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMapOpen]);

  // --- RENDER ---
  return (
    <div
      className={`min-h-screen bg-gray-50 flex flex-col ${
        Capacitor.isNativePlatform() ? "pt-[var(--sat)]" : ""
      }`}
    >
      {/* LAYOUT CHÍNH:
         Trên Mobile: 1 cột (Map đè lên tất cả khi mở)
         Trên Desktop: 2 cột (List 40% - 60% Map hoặc 75% List - 25% Sidebar)
      */}
      <div className="flex-1 flex flex-col lg:flex-row lg:gap-6 max-w-7xl mx-auto w-full relative">
        {/* === CỘT TRÁI: LIST & SEARCH === */}
        {/* Ẩn cột này trên Mobile nếu Map đang mở để Map chiếm full màn hình */}
        <div
          className={`
            flex-1 flex flex-col h-full
            ${
              isMapOpen
                ? "hidden lg:flex lg:w-[40%] h-screen overflow-y-auto"
                : "w-full lg:w-3/4"
            }
            px-4 py-4 lg:py-6
          `}
        >
          {/* Search Bar */}
          <div className="bg-white p-3 lg:p-4 rounded-lg shadow-sm mb-4 sticky top-0 z-10">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch">
              <div className="flex flex-1 relative">
                <Input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Tìm kiếm địa điểm, dự án..."
                  className="h-10 lg:h-12 bg-white flex-1 rounded-r-none border-r-0 focus-visible:ring-[#008DDA]"
                />
                <Button
                  type="button"
                  onClick={executeSearch}
                  className="h-10 lg:h-12 rounded-l-none px-4 bg-[#008DDA] hover:bg-[#0072b0]"
                >
                  <Search className="w-4 h-4 text-white" />
                </Button>
              </div>

              {/* Nút mở Map */}
              <Button
                onClick={handleToggleMap}
                variant="outline"
                className="h-10 lg:h-12 flex items-center justify-center gap-2 border-[#008DDA] text-[#008DDA] hover:bg-[#008DDA] hover:text-white"
              >
                {isMapOpen ? (
                  <List className="w-4 h-4" />
                ) : (
                  <MapIcon className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">
                  {isMapOpen ? "Danh sách" : "Bản đồ"}
                </span>
                <span className="sm:hidden">{isMapOpen ? "List" : "Map"}</span>
              </Button>
            </div>
          </div>

          {/* Filters - Responsive Grid */}
          <div className="bg-white p-3 lg:p-4 rounded-lg shadow-sm mb-4">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3">
              <Select value={district} onValueChange={handleDistrictChange}>
                <SelectTrigger className="w-full h-9 lg:h-10 text-sm">
                  <SelectValue placeholder="Khu vực" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả khu vực</SelectItem>
                  {DISTRICTS.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={propertyType}
                onValueChange={handlePropertyTypeChange}
              >
                <SelectTrigger className="w-full h-9 lg:h-10 text-sm">
                  <SelectValue placeholder="Loại BĐS" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả loại</SelectItem>
                  {PROPERTY_TYPES.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Price Range - Chiếm 2 cột trên mobile nếu lẻ */}
              <div className="col-span-2 lg:col-span-1">
                <Select
                  value={priceRange}
                  onValueChange={handlePriceRangeChange}
                >
                  <SelectTrigger className="w-full h-9 lg:h-10 text-sm">
                    <SelectValue placeholder="Mức giá" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả mức giá</SelectItem>
                    {PRICE_RANGES.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* List Content */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg lg:text-2xl font-semibold text-gray-900 truncate pr-2">
                Mua bán nhà đất HCM
              </h2>
              <div className="w-[120px] lg:w-[150px] flex-shrink-0">
                <Select value={sortCriteria} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-full h-8 lg:h-10 text-xs lg:text-sm">
                    <SelectValue placeholder="Sắp xếp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Mặc định</SelectItem>
                    {PROPERTY_SORT_CRITERIAS.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-4 mb-6">
              {isLoading ? (
                // Skeleton...
                [...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full rounded-lg" />
                ))
              ) : propertyList.length > 0 ? (
                propertyList.map((property) => (
                  <PropertyListItem
                    key={property.id}
                    id={String(property.id)}
                    title={property.title}
                    price={property.price}
                    area={property.area}
                    address={`${property.addressStreet}, ${property.addressWard}, ${property.addressDistrict}`}
                    imageUrl={property.imageUrls?.[0] || ""}
                    createdAt={property.createdAt || ""}
                    isLiked={likedProperties.has(String(property.id))}
                    onFavoriteClick={handleFavoriteClick}
                  />
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  Không tìm thấy BĐS nào
                </div>
              )}
            </div>

            {/* Pagination */}
            {!isLoading && propertyList.length > 0 && (
              <div className="flex justify-center mb-8 pb-10 lg:pb-0">
                <ControlledPagination
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                  totalPages={totalPages}
                />
              </div>
            )}
          </div>
        </div>

        {/* === CỘT PHẢI: MAP hoặc SIDEBAR === */}
        {/* Mobile: Nếu isMapOpen -> Fixed Fullscreen, đè lên tất cả.
           Desktop: Luôn hiển thị (block) ở cột bên phải.
        */}
        <aside
          className={`
            ${
              isMapOpen
                ? "fixed inset-0 z-50 bg-white pt-[var(--sat)] pb-[var(--sab)]" // Mobile Fullscreen
                : "hidden" // Mobile Hidden
            }
            lg:static lg:block lg:pt-0 lg:pb-0
            ${isMapOpen ? "lg:w-[60%]" : "lg:w-1/4"}
          `}
        >
          {isMapOpen ? (
            <div className="w-full h-full relative">
              {/* Nút đóng Map trên Mobile */}
              <Button
                onClick={handleToggleMap}
                className="lg:hidden absolute top-4 right-4 z-[60] rounded-full w-10 h-10 p-0 shadow-lg bg-white text-black hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </Button>

              <MultipleMarkerMap
                properties={propertyMarkers}
                defaultZoom={11}
                onMapInteraction={handleMapInteraction}
              />
            </div>
          ) : (
            /* Sidebar Quick Filter (Chỉ hiện trên Desktop) */
            <div className="hidden lg:block space-y-4 mt-6">
              <PropertyTypeFilter />
              <PropertyDistrictFilter />
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
