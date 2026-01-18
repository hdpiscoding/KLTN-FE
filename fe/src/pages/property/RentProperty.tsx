/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {useState, useEffect, useCallback, useRef} from 'react';
import { Search, MapIcon } from 'lucide-react';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Helmet } from "react-helmet-async";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select.tsx';
import { DISTRICTS } from '@/constants/districts.ts';
import { PROPERTY_TYPES } from "@/constants/propertyTypes.ts";
import { PRICE_RANGES} from "@/constants/priceRanges.ts";
import { PROPERTY_SORT_CRITERIAS } from "@/constants/propertySortCriterias.ts";
import { PropertyListItem } from '@/components/list-item/property-list-item.tsx';
import { PropertyTypeFilter } from '@/components/general/property-type-filter.tsx';
import { PropertyDistrictFilter } from '@/components/general/property-district-filter.tsx';
import {ControlledPagination} from "@/components/ui/controlled-pagination.tsx";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel.tsx";
import {PropertyCardItem} from "@/components/card-item/property-card-item.tsx";
import MultipleMarkerMap from '@/components/map/multiple-marker-map.tsx';
import type {PropertyListing} from "@/types/property-listing";
import { useSearchFilters } from '@/hooks/use-search-filters.ts';
import {getRecommendedProperties, searchProperties, getPropertiesWithinViewPort} from '@/services/propertyServices.ts';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { getPriceRangeValue, getPriceRangeId } from '@/utils/priceRangeHelper.ts';
import { getSortCriteriaValue } from '@/utils/sortCriteriaHelper.ts';
import { useSearchParams } from 'react-router-dom';
import { likeProperty, unlikeProperty, checkLikeProperty } from '@/services/userServices.ts';
import {useUserStore} from "@/store/userStore.ts";
import {useDebounce} from "use-debounce";
import type {PropertyMarker} from "@/types/property-marker";

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

export const RentProperty: React.FC = () => {
    const [searchValue, setSearchValue] = useState('');
    const [district, setDistrict] = useState('all');
    const [propertyType, setPropertyType] = useState('all');
    const [priceRange, setPriceRange] = useState('all');
    const [sortCriteria, setSortCriteria] = useState('default');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [isMobileMapView, setIsMobileMapView] = useState(false); // For mobile full-screen map
    const [propertyList, setPropertyList] = useState<PropertyListing[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [likedProperties, setLikedProperties] = useState<Set<string>>(new Set());
    const { filters, setFilter } = useSearchFilters();
    const [searchParams, setSearchParams] = useSearchParams();

    // Location and recommended properties states
    const {userId, isLoggedIn} = useUserStore();
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt' | null>(null);
    const [recommendedProperties, setRecommendedProperties] = useState<PropertyListing[]>([]);
    const [isLoadingRecommended, setIsLoadingRecommended] = useState(false);

    // Request user location
    const requestUserLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setLocationPermission('denied');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                setUserLocation(location);
                setLocationPermission('granted');
            },
            (error) => {
                console.error('Error getting location:', error);
                setLocationPermission('denied');
            }
        );
    }, []);

    // Convert propertyList to propertyMarkers for map display
    const propertyMarkers: PropertyMarker[] = propertyList
        .filter(property => property.location?.coordinates) // Only include properties with valid location
        .map(property => ({
            id: String(property.id),
            location: {
                latitude: property.location.coordinates[1],
                longitude: property.location.coordinates[0],
                address: `${property.addressStreet}, ${property.addressWard}, ${property.addressDistrict}, ${property.addressCity}`
            },
            listingType: property.listingType,
            title: property.title,
            image: property.imageUrls?.[0] || '',
            price: property.price,
            area: property.area
        }));


    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            executeSearch();
        }
    };

    const executeSearch = () => {
        const trimmedValue = searchValue.trim();
        if (trimmedValue) {
            setFilter('title', 'lk', trimmedValue);
        } else {
            setFilter('title', 'lk', ''); // Xóa filter nếu rỗng
        }
    };

    const handleToggleMap = () => {
        setIsMapOpen(!isMapOpen);
    };

    // Toggle mobile map view (full screen)
    const handleToggleMobileMap = () => {
        setIsMobileMapView((prev) => !prev);
    };

    // Check liked status for all properties - defined early to be used in handleMapInteraction
    const checkLikedStatus = useCallback(async (properties: PropertyListing[]) => {
        if (!userId || !isLoggedIn) {
            return;
        }
        try {
            const likedSet = new Set<string>();
            await Promise.all(
                properties.map(async (property) => {
                    try {
                        const response = await checkLikeProperty(Number(property.id));
                        if (response.data) {
                            likedSet.add(String(property.id));
                        }
                    } catch (error) {
                        console.error(`Error checking liked status for property ${property.id}:`, error);
                    }
                })
            );
            setLikedProperties(likedSet);
        } catch (error) {
            console.error('Error checking liked properties:', error);
        }
    }, [userId, isLoggedIn]);

    // Refs for optimization
    const lastApiCallRef = useRef<string>('');
    const isApiCallingRef = useRef<boolean>(false);

    // Handle map interaction (zoom or drag end) - OPTIMIZED
    const handleMapInteractionCore = useCallback(async (
        bounds: { minLat: number; minLng: number; maxLat: number; maxLng: number; zoom: number },
    ) => {
        // Only call API if zoom is high enough
        if (bounds.zoom < 10) {
            return;
        }

        // Create unique key to prevent duplicate calls
        const callKey = `${bounds.minLat.toFixed(4)}-${bounds.minLng.toFixed(4)}-${bounds.maxLat.toFixed(4)}-${bounds.maxLng.toFixed(4)}-${bounds.zoom.toFixed(1)}`;

        // Skip if duplicate or already calling
        if (callKey === lastApiCallRef.current || isApiCallingRef.current) {
            return;
        }

        try {
            isApiCallingRef.current = true;
            lastApiCallRef.current = callKey;
            const response = await getPropertiesWithinViewPort(
                bounds.minLat,
                bounds.minLng,
                bounds.maxLat,
                bounds.maxLng
            );

            if (response.status === "200" && response.data) {
                // Map response - OPTIMIZED: Simplified mapping
                const mappedProperties: PropertyListing[] = response.data
                    .filter((item: { listingType?: string; listing_type?: string; [key: string]: unknown }) => {
                        const listingType = item.listingType || item.listing_type;
                        return listingType === 'for_rent';
                    })
                    .map((item: {
                        id: number;
                        title: string;
                        price: number;
                        priceUnit?: string;
                        price_unit?: string;
                        listingType?: string;
                        listing_type?: string;
                        location: { type: string; coordinates: number[] };
                        area: number;
                        addressStreet?: string;
                        address_street?: string;
                        addressWard?: string;
                        address_ward?: string;
                        addressDistrict?: string;
                        address_district?: string;
                        addressCity?: string;
                        address_city?: string;
                        createdAt?: string;
                        created_at?: string;
                        thumbnailUrl?: string;
                        [key: string]: any;
                    }) => ({
                        id: item.id,
                        userId: item.user_id || 0,
                        approvalStatus: 'APPROVED',
                        title: item.title,
                        description: item.description || '',
                        listingType: item.listingType || item.listing_type || 'for_sale',
                        price: item.price,
                        priceUnit: item.priceUnit || item.price_unit || 'VND',
                        area: item.area,
                        propertyType: item.propertyType || item.property_type || 'house',
                        legalStatus: item.legalStatus || item.legal_status || null,
                        numBedrooms: item.numBedrooms || item.num_bedrooms || null,
                        numBathrooms: item.numBathrooms || item.num_bathrooms || null,
                        numFloors: item.numFloors || item.num_floors || null,
                        facadeWidthM: item.facadeWidthM || item.facade_width_m || null,
                        roadWidthM: item.roadWidthM || item.road_width_m || null,
                        houseDirection: item.houseDirection || item.house_direction || null,
                        balconyDirection: item.balconyDirection || item.balcony_direction || null,
                        furnitureStatus: item.furnitureStatus || item.furniture_status || null,
                        addressStreet: item.addressStreet || item.address_street || '',
                        addressWard: item.addressWard || item.address_ward || '',
                        addressDistrict: item.addressDistrict || item.address_district || '',
                        addressCity: item.addressCity || item.address_city || 'TPHCM',
                        location: item.location,
                        imageUrls: item.thumbnailUrl ? [item.thumbnailUrl] : (item.imageUrls || item.image_urls || []),
                        createdAt: item.createdAt || item.created_at || new Date().toISOString(),
                        updatedAt: item.updatedAt || item.updated_at || new Date().toISOString(),
                    }));

                setPropertyList(mappedProperties);
                setTotalPages(1);

                if (userId) {
                    await checkLikedStatus(mappedProperties);
                }
            }
        } catch (error) {
            console.error('Error fetching viewport properties:', error);
        } finally {
            isApiCallingRef.current = false;
        }
    }, []);

    // Debounced version - wait 500ms after last interaction
    const [debouncedHandleMapInteraction] = useDebounce(handleMapInteractionCore, 500);

    // Wrapper to use debounced version
    const handleMapInteraction = useCallback((
        bounds: { minLat: number; minLng: number; maxLat: number; maxLng: number; zoom: number },
    ) => {
        debouncedHandleMapInteraction(bounds);
    }, [debouncedHandleMapInteraction]);

    const handleFavoriteClick = async (id: string, currentLikedState: boolean) => {
        try {
            const propertyId = Number(id);
            if (currentLikedState) {
                await unlikeProperty(propertyId);
                setLikedProperties(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(id);
                    return newSet;
                });
            } else {
                await likeProperty(propertyId);
                setLikedProperties(prev => new Set(prev).add(id));
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    // Handle district select change
    const handleDistrictChange = (value: string) => {
        setDistrict(value);
        if (value === 'all') {
            setFilter('addressDistrict', 'eq', '');
        } else {
            const districtName = DISTRICTS.find(d => d.id === value)?.name;
            if (districtName) {
                setFilter('addressDistrict', 'eq', districtName);
            }
        }
    };

    const getRecommendedPropertiesData = useCallback(async () => {
        try {
            setIsLoadingRecommended(true);

            // Only fetch if user has granted location permission and we have coordinates
            if (locationPermission === 'granted' && userLocation) {
                let response;
                if (userId) {
                    response = await getRecommendedProperties(
                        userLocation.lat,
                        userLocation.lng,
                        8,
                        20,
                        userId
                    );
                }
                else {
                    response = await getRecommendedProperties(
                        userLocation.lat,
                        userLocation.lng,
                        8,
                        20,
                    );
                }

                if (response.status === "200" && response.data?.items) {
                    // Map response from getRecommendedProperties format to PropertyListing format
                    const mappedProperties: PropertyListing[] = response.data.items.map((item: RecommendedPropertyItem) => ({
                        id: item.id,
                        title: item.title,
                        price: item.price,
                        priceUnit: item.price_unit,
                        area: item.area,
                        // Parse address string to get district
                        addressDistrict: item.address.split(',').map((s: string) => s.trim()).find((s: string) => s.includes('Quận') || s.includes('Huyện')) || '',
                        // Use full address as street for display
                        addressStreet: item.address.split(',')[0]?.trim() || '',
                        addressWard: item.address.split(',').map((s: string) => s.trim()).find((s: string) => s.includes('Phường') || s.includes('Xã')) || '',
                        addressCity: 'TPHCM',
                        numBedrooms: item.num_bedrooms,
                        numBathrooms: item.num_bathrooms,
                        imageUrls: item.thumbnail_url ? [item.thumbnail_url] : [],
                        // Set other required fields with defaults
                        listingType: 'for_sale',
                        propertyType: 'house',
                        approvalStatus: 'APPROVED',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        userId: 0,
                        location: { type: 'Point', coordinates: [0, 0] },
                    }));

                    setRecommendedProperties(mappedProperties);
                } else {
                    // Clear recommendations if API fails
                    setRecommendedProperties([]);
                }
            } else {
                // No location permission - clear properties
                setRecommendedProperties([]);
            }
        } catch (error) {
            console.error('Error fetching recommended properties:', error);
            setRecommendedProperties([]);
        } finally {
            setIsLoadingRecommended(false);
        }
    }, [locationPermission, userLocation, userId]);


    // Handle property type select change
    const handlePropertyTypeChange = (value: string) => {
        setPropertyType(value);
        if (value === 'all') {
            setFilter('propertyType', 'eq', '');
        } else {
            setFilter('propertyType', 'eq', value);
        }
    };

    // Handle sort criteria change
    const handleSortChange = (value: string) => {
        setSortCriteria(value);
        const params = new URLSearchParams(searchParams);
        if (value === 'default') {
            params.delete('sort');
        } else {
            params.set('sort', value);
        }
        setSearchParams(params);
    };

    // Handle price range select change
    const handlePriceRangeChange = (value: string) => {
        setPriceRange(value);
        if (value === 'all') {
            setFilter('price', 'rng', '');
        } else {
            const rangeValue = getPriceRangeValue(value);
            if (rangeValue) {
                setFilter('price', 'rng', rangeValue);
            }
        }
    };

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll to top when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Sync district state with URL filters
    useEffect(() => {
        const districtFilter = filters.find(f => f.key === 'addressDistrict' && f.operator === 'eq');
        if (districtFilter) {
            // Filter có district name, cần tìm id tương ứng
            const districtId = DISTRICTS.find(d => d.name === districtFilter.value)?.id;
            if (districtId) {
                setDistrict(districtId);
            }
        } else {
            setDistrict('all');
        }
    }, [filters]);

    // Sync property type state with URL filters
    useEffect(() => {
        const propertyTypeFilter = filters.find(f => f.key === 'propertyType' && f.operator === 'eq');
        if (propertyTypeFilter) {
            setPropertyType(propertyTypeFilter.value);
        } else {
            setPropertyType('all');
        }
    }, [filters]);

    // Sync sort criteria state with URL
    useEffect(() => {
        const sortParam = searchParams.get('sort');
        if (sortParam) {
            setSortCriteria(sortParam);
        } else {
            setSortCriteria('default');
        }
    }, [searchParams]);

    // Sync price range state with URL filters
    useEffect(() => {
        const priceFilter = filters.find(f => f.key === 'price' && f.operator === 'rng');
        if (priceFilter) {
            // Filter có min-max value, cần tìm id tương ứng
            const rangeId = getPriceRangeId(priceFilter.value);
            if (rangeId) {
                setPriceRange(rangeId);
            }
        } else {
            setPriceRange('all');
        }
    }, [filters]);

    // Sync search input value with URL title filter
    useEffect(() => {
        const titleFilter = filters.find(
            (f) => f.key === "title" && f.operator === "lk"
        );
        if (titleFilter && titleFilter.value) {
            setSearchValue(titleFilter.value);
        } else {
            setSearchValue("");
        }
    }, [filters]);

    // Reset về trang 1 khi filters thay đổi
    useEffect(() => {
        setCurrentPage(1);
    }, [filters]);

    // Fetch properties based on filters from URL
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                setIsLoading(true);

                // Convert filters from URL to API format
                const apiFilters = filters.map(filter => ({
                    key: filter.key,
                    operator: filter.operator === 'eq' ? 'equal' :
                        filter.operator === 'gt' ? 'greater' :
                            filter.operator === 'lt' ? 'less' :
                                filter.operator === 'gte' ? 'greater_equal' :
                                    filter.operator === 'lte' ? 'less_equal' :
                                        filter.operator === 'lk' ? 'like' :
                                            filter.operator === 'rng' ? 'range' : 'equal',
                    value: filter.value
                }));

                // Always add listingType filter for buy properties
                const filtersWithType = [
                    ...apiFilters,
                    {
                        key: 'listingType',
                        operator: 'equal',
                        value: 'for_rent'
                    },
                    {
                        key: 'approvalStatus',
                        operator: 'equal',
                        value: 'APPROVED'
                    },
                ];

                // Determine sorts based on sort criteria from URL
                let sorts = [
                    {
                        key: 'createdAt',
                        type: 'DESC'
                    }
                ];

                const sortParam = searchParams.get('sort');
                if (sortParam && sortParam !== 'default') {
                    const sortValue = getSortCriteriaValue(sortParam);
                    if (sortValue) {
                        sorts = [sortValue];
                    }
                }

                const response = await searchProperties({
                    filters: filtersWithType,
                    sorts: sorts,
                    rpp: 10,
                    page: currentPage
                });

                setPropertyList(response.data.items);
                setTotalPages(response.data.pages || 1);
            } catch (error) {
                console.error('Error fetching properties:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProperties();
    }, [filters, currentPage, searchParams]);

    // Fetch recommended properties when component mounts or location changes
    useEffect(() => {
        getRecommendedPropertiesData();
    }, [getRecommendedPropertiesData]);

    // Request user location on mount if not already obtained
    useEffect(() => {
        if (locationPermission === null) {
            requestUserLocation();
        }
    }, [locationPermission, requestUserLocation]);

    // Check liked status for properties when they are loaded
    useEffect(() => {
        if (propertyList.length > 0) {
            checkLikedStatus(propertyList);
        }
    }, [propertyList, checkLikedStatus]);

    // Cleanup effect: Reset body overflow when component unmounts
    useEffect(() => {
        return () => {
            // Always reset body overflow when leaving this page
            document.body.style.overflow = '';
        };
    }, []);

    // Effect to handle body overflow based on map state
    useEffect(() => {
        if (isMapOpen || isMobileMapView) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        // Cleanup when effect re-runs or component unmounts
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMapOpen, isMobileMapView]);

    // Generate dynamic SEO based on filters
    const generateSEOTitle = (): string => {
        let title = "Cho thuê nhà đất";

        // Add property type
        const selectedPropertyType = PROPERTY_TYPES.find(pt => pt.id === propertyType);
        if (selectedPropertyType && propertyType !== 'all') {
            title = `Cho thuê ${selectedPropertyType.name.toLowerCase()}`;
        }

        // Add district
        const selectedDistrict = DISTRICTS.find(d => d.id === district);
        if (selectedDistrict && district !== 'all') {
            title += ` ${selectedDistrict.name}`;
        } else {
            title += " TP.HCM";
        }

        // Add price range
        const selectedPriceRange = PRICE_RANGES.find(pr => pr.id === priceRange);
        if (selectedPriceRange && priceRange !== 'all') {
            title += ` ${selectedPriceRange.title.toLowerCase()}`;
        }

        title += " | timnha";
        return title;
    };

    const generateSEODescription = (): string => {
        let description = "Tìm kiếm";

        // Add property type
        const selectedPropertyType = PROPERTY_TYPES.find(pt => pt.id === propertyType);
        if (selectedPropertyType && propertyType !== 'all') {
            description += ` ${selectedPropertyType.name.toLowerCase()}`;
        } else {
            description += " bất động sản";
        }

        description += " cho thuê";

        // Add district
        const selectedDistrict = DISTRICTS.find(d => d.id === district);
        if (selectedDistrict && district !== 'all') {
            description += ` tại ${selectedDistrict.name}`;
        } else {
            description += " tại TP.HCM";
        }

        // Add price range
        const selectedPriceRange = PRICE_RANGES.find(pr => pr.id === priceRange);
        if (selectedPriceRange && priceRange !== 'all') {
            description += `, mức giá ${selectedPriceRange.title.toLowerCase()}`;
        }

        description += ". Thông tin cập nhật, đầy đủ pháp lý, hình ảnh rõ ràng. Tìm đúng nhà, sống đúng cách.";

        return description;
    };

    return (
        <div className={`min-h-screen bg-gray-50 ${isMapOpen ? 'h-screen overflow-hidden' : ''}`}>
            <Helmet>
                <title>{generateSEOTitle()}</title>
                <meta name="description" content={generateSEODescription()} />
                <meta property="og:title" content={generateSEOTitle()} />
                <meta property="og:description" content={generateSEODescription()} />
                <meta property="og:type" content="website" />
                <link rel="canonical" href="https://timnha.sonata.io.vn/thue-nha" />
            </Helmet>

            {/* Mobile Full Screen Map View */}
            {isMobileMapView && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <MultipleMarkerMap
                        properties={propertyMarkers}
                        defaultZoom={11}
                        onMapInteraction={handleMapInteraction}
                    />
                </div>
            )}

            {/* Main Content - Hidden when mobile map is active */}
            <div className={`${isMobileMapView ? "hidden md:block" : ""} ${isMapOpen ? "w-full" : "max-w-7xl mx-auto px-4 py-6"}`}>
                <div className="flex flex-col lg:flex-row lg:gap-6">
                    {/* Main Content - Dynamic width based on map state */}
                    <div className={isMapOpen ? "lg:w-[40%] overflow-y-auto px-4 py-6 h-screen" : "flex-1 lg:w-3/4"}>
                        {/* Search and Map Button */}
                        <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                            <div className="flex flex-col sm:flex-row gap-3 items-center">
                                <div className="flex flex-1">
                                    <Input
                                        type="text"
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                        onKeyDown={handleSearchKeyDown}
                                        placeholder="Tìm kiếm theo địa điểm, dự án..."
                                        className="h-[48px] bg-white text-gray-600 flex-1 rounded-r-none border-r-0 focus-visible:ring-[#008DDA] focus-visible:ring-2 focus-visible:ring-offset-0"
                                    />
                                    <Button
                                        type="button"
                                        onClick={executeSearch}
                                        className="h-[48px] rounded-l-none px-3 bg-[#008DDA] hover:bg-[#0072b0] cursor-pointer"
                                    >
                                        <Search className="w-4 h-4 text-white" />
                                    </Button>
                                </div>
                                {/* Map Button - Hidden on mobile */}
                                <Button
                                    onClick={handleToggleMap}
                                    variant="outline"
                                    className="hidden md:flex items-center justify-center gap-2 border-[#008DDA] text-[#008DDA] hover:bg-[#008DDA] hover:text-white transition-colors cursor-pointer"
                                >
                                    <MapIcon className="w-4 h-4" />
                                    {isMapOpen ? 'Đóng bản đồ' : 'Mở bản đồ'}
                                </Button>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {/* District Filter */}
                                <Select value={district} onValueChange={handleDistrictChange}>
                                    <SelectTrigger className="w-full focus:ring-[#008DDA] focus:ring-2 focus:ring-offset-0 cursor-pointer">
                                        <SelectValue placeholder="Khu vực" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem className="cursor-pointer" value="all">Tất cả khu vực</SelectItem>
                                        {DISTRICTS.map((DISTRICT) => (
                                            <SelectItem key={DISTRICT.id} value={DISTRICT.id} className="cursor-pointer">
                                                {DISTRICT.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {/* Property Type Filter */}
                                <Select value={propertyType} onValueChange={handlePropertyTypeChange}>
                                    <SelectTrigger className="w-full focus:ring-[#008DDA] focus:ring-2 focus:ring-offset-0 cursor-pointer">
                                        <SelectValue placeholder="Loại bất động sản" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem className="cursor-pointer" value="all">Tất cả loại</SelectItem>
                                        {PROPERTY_TYPES.map((PROPERTY_TYPE) => (
                                            <SelectItem key={PROPERTY_TYPE.id} value={PROPERTY_TYPE.id} className="cursor-pointer">
                                                {PROPERTY_TYPE.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {/* Price Range Filter */}
                                <Select value={priceRange} onValueChange={handlePriceRangeChange}>
                                    <SelectTrigger className="w-full focus:ring-[#008DDA] focus:ring-2 focus:ring-offset-0 cursor-pointer">
                                        <SelectValue placeholder="Giá bán" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all" className="cursor-pointer">Tất cả</SelectItem>
                                        {PRICE_RANGES.map((PRICE_RANGE) => (
                                            <SelectItem key={PRICE_RANGE.id} value={PRICE_RANGE.id} className="cursor-pointer">
                                                {PRICE_RANGE.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>


                        {/* Title */}
                        <h2 className="text-2xl font-semibold text-gray-900 my-8">
                            Thuê nhà đất ở Thành phố Hồ Chí Minh
                        </h2>

                        <div className="flex justify-between items-center mb-4">
                            <p className="text-gray-600 text-sm">Hiện có {propertyList.length} bất động sản</p>

                            <div className="flex items-center lg:w-1/3">
                                <Select value={sortCriteria} onValueChange={handleSortChange}>
                                    <SelectTrigger className="w-full bg-white focus:ring-[#008DDA] focus:ring-2 focus:ring-offset-0 cursor-pointer">
                                        <SelectValue placeholder="Mặc định" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="default" className="cursor-pointer">Mặc định</SelectItem>
                                        {PROPERTY_SORT_CRITERIAS.map((PROPERTY_SORT_CRITERIA) => (
                                            <SelectItem key={PROPERTY_SORT_CRITERIA.id} value={PROPERTY_SORT_CRITERIA.id} className="cursor-pointer">
                                                {PROPERTY_SORT_CRITERIA.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                        </div>

                        {/* Property List */}
                        <div className="space-y-4 mb-6">
                            {isLoading ? (
                                <>
                                    {[...Array(5)].map((_, index) => (
                                        <div key={index} className="bg-white rounded-lg shadow-sm p-4 flex gap-4">
                                            <Skeleton className="w-64 h-48 rounded-lg flex-shrink-0" />
                                            <div className="flex-1 space-y-3">
                                                <Skeleton className="h-6 w-3/4" />
                                                <Skeleton className="h-4 w-1/2" />
                                                <Skeleton className="h-4 w-1/3" />
                                                <Skeleton className="h-4 w-1/4" />
                                                <div className="flex justify-between items-center mt-4">
                                                    <Skeleton className="h-4 w-24" />
                                                    <Skeleton className="h-8 w-8 rounded-full" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            ) : propertyList.length > 0 ? (
                                propertyList.map((property) => (
                                    <PropertyListItem
                                        key={property.id}
                                        id={String(property.id)}
                                        title={property.title}
                                        listingType={property.listingType}
                                        price={property.price}
                                        area={property.area}
                                        address={`${property.addressStreet}, ${property.addressWard}, ${property.addressDistrict}, ${property.addressCity}`}
                                        imageUrl={property.imageUrls?.[0] || ""}
                                        createdAt={property.createdAt || ""}
                                        isLiked={likedProperties.has(String(property.id))}
                                        onFavoriteClick={handleFavoriteClick}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">Không tìm thấy bất động sản nào</p>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {!isLoading && propertyList.length > 0 && (
                            <div className="flex justify-center mb-6">
                                <ControlledPagination
                                    currentPage={currentPage}
                                    onPageChange={handlePageChange}
                                    totalPages={totalPages}
                                />
                            </div>
                        )}


                        {/* Suggested Properties - Show only if location is granted */}
                        {locationPermission === 'granted' && userLocation && (
                            <section className={isMapOpen ? "py-8" : "py-12 px-4 max-w-7xl mx-auto"}>
                                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-8">
                                    Bất động sản gợi ý
                                </h2>

                                {isLoadingRecommended ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {[...Array(4)].map((_, index) => (
                                            <div key={index} className="space-y-3">
                                                <Skeleton className="h-48 w-full rounded-lg" />
                                                <Skeleton className="h-4 w-3/4" />
                                                <Skeleton className="h-4 w-full" />
                                                <div className="flex justify-between">
                                                    <Skeleton className="h-4 w-1/3" />
                                                    <Skeleton className="h-4 w-1/3" />
                                                </div>
                                                <Skeleton className="h-4 w-1/2" />
                                            </div>
                                        ))}
                                    </div>
                                ) : recommendedProperties.length > 0 ? (
                                    <Carousel
                                        opts={{
                                            align: "start",
                                            loop: true,
                                        }}
                                        className="w-full"
                                    >
                                        <div className="relative">
                                            <CarouselContent className="-ml-2 md:-ml-4">
                                                {recommendedProperties.map((property) => (
                                                    <CarouselItem key={property.id} className={`pl-2 md:pl-4 ${isMapOpen ? 'basis-full md:basis-1/2 lg:basis-1/2' : 'sm:basis-1/2 md:basis-1/2 lg:basis-1/3'}`}>
                                                        <div className="h-[420px]">
                                                            <PropertyCardItem
                                                                id={String(property.id)}
                                                                title={property.title}
                                                                listingType={property.listingType}
                                                                price={property.price}
                                                                area={property.area}
                                                                address={[
                                                                    property.addressStreet,
                                                                    property.addressWard,
                                                                    property.addressDistrict,
                                                                    property.addressCity,
                                                                ].filter(Boolean).join(", ")}
                                                                imageUrl={property.imageUrls?.[0] || ""}
                                                                createdAt={property.createdAt || ""}
                                                                onFavoriteClick={(id) => console.log('Favorite clicked:', id)}
                                                            />
                                                        </div>
                                                    </CarouselItem>
                                                ))}
                                            </CarouselContent>
                                            <div className="hidden sm:block">
                                                <CarouselPrevious className="-left-4 sm:-left-5 lg:-left-6 cursor-pointer" />
                                                <CarouselNext className="-right-4 sm:-right-5 lg:-right-6 cursor-pointer" />
                                            </div>
                                        </div>
                                    </Carousel>
                                ) : null}
                            </section>
                        )}
                    </div>

                    {/* Right Sidebar - Conditional: Map (60%) or Quick Filters (25%) */}
                    <aside className={isMapOpen ? "lg:w-[60%] hidden md:block" : "lg:w-1/4 hidden md:block"}>
                        {isMapOpen ? (
                            /* Map View - Fixed full height on right side */
                            <div className="fixed top-0 right-0 h-screen" style={{ width: '60%' }}>
                                <MultipleMarkerMap
                                    properties={propertyMarkers}
                                    defaultZoom={11}
                                    onMapInteraction={handleMapInteraction}
                                />
                            </div>
                        ) : (
                            /* Quick Filter Sidebar */
                            <div className="space-y-4">
                                <PropertyTypeFilter />
                                <PropertyDistrictFilter />
                            </div>
                        )}
                    </aside>
                </div>
            </div>

            {/* Floating Map/List Toggle Button - Mobile Only */}
            <Button
                onClick={handleToggleMobileMap}
                className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[1001] bg-[#008DDA] hover:bg-[#0072b0] text-white shadow-lg px-6 py-6 rounded-full flex items-center gap-2 cursor-pointer"
            >
                <MapIcon className="w-5 h-5" />
                <span className="font-semibold">
                    {isMobileMapView ? "Danh sách" : "Bản đồ"}
                </span>
            </Button>
        </div>
    );
};






