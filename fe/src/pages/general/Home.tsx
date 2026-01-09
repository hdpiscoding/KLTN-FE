import React, {useEffect, useState, useCallback, useRef} from 'react';
import { Helmet } from 'react-helmet-async';
import { PropertyCardItem } from "@/components/card-item/property-card-item.tsx";
import { DistrictCardItem } from "@/components/card-item/district-card-item.tsx";
import { PropertySuggestionItem } from "@/components/list-item/property-suggestion-item.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Alert, AlertDescription } from "@/components/ui/alert.tsx";
import homeBackground from "@/assets/timnha-home-background.png";
import { Search, MapPin } from "lucide-react";
import { cn } from "@/lib/utils.ts";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel.tsx";
import {useNavigate} from "react-router-dom";
import type {PropertyListing} from "@/types/property-listing";
import {searchProperties, getRecommendedProperties} from "@/services/propertyServices.ts";
import {useUserStore} from "@/store/userStore.ts";
import { useDebounce } from 'use-debounce';

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

export const Home: React.FC = () => {
    const [searchType, setSearchType] = useState<'for_sale' | 'for_rent'>('for_sale');
    const [searchValue, setSearchValue] = useState('');
    const navigate = useNavigate();
    const userId = useUserStore((state) => state.userId);
    const [saleProperties, setSaleProperties] = useState<PropertyListing[]>([]);
    const [rentProperties, setRentProperties] = useState<PropertyListing[]>([]);
    const [recommendedProperties, setRecommendedProperties] = useState<PropertyListing[]>([]);

    // Autocomplete states
    const [suggestions, setSuggestions] = useState<PropertyListing[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const [debouncedSearchValue] = useDebounce(searchValue, 300);
    const searchContainerRef = useRef<HTMLDivElement>(null);

    // Location states
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt' | null>(null);
    const [showLocationNote, setShowLocationNote] = useState(false);

    // Loading states
    const [isLoadingRecommended, setIsLoadingRecommended] = useState(true);
    const [isLoadingSale, setIsLoadingSale] = useState(true);
    const [isLoadingRent, setIsLoadingRent] = useState(true);

    // Sample data for districts
    const sampleDistricts = [
        {
            id: "quan-1",
            name: "Quận 1",
            postCount: 1234,
            imageUrl: "https://owa.bestprice.vn/images/destinations/uploads/quan-1-6094b9a6a8de1.jpg",
        },
        {
            id: "quan-3",
            name: "Quận 3",
            postCount: 856,
            imageUrl: "https://blog.rever.vn/hubfs/Blog%20images/PhuLH/quan-2-1.jpg",
        },
        {
            id: "quan-7",
            name: "Quận 7",
            postCount: 2451,
            imageUrl: "https://iwater.vn/Image/Picture/New/333/quan_7.jpg",
        },
        {
            id: "binh-thanh",
            name: "Quận Bình Thạnh",
            postCount: 1876,
            imageUrl: "https://nhadathoangviet.com/wp-content/uploads/2024/04/Anh-man-hinh-2024-04-17-luc-10.29.19.png",
        },
        {
            id: "quan-11",
            name: "Quận 11",
            postCount: 943,
            imageUrl: "https://maisonoffice.vn/wp-content/uploads/2024/04/1-gioi-thieu-tong-quan-ve-quan-11-tphcm.jpg",
        },
    ];

    // Request user location
    const requestUserLocation = () => {
        if (!navigator.geolocation) {
            setLocationPermission('denied');
            setShowLocationNote(true);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                setLocationPermission('granted');
                setShowLocationNote(false);
            },
            (error) => {
                console.error('Error getting location:', error);
                setLocationPermission('denied');
                setShowLocationNote(true);
            }
        );
    };

    const getSaleProperties = async () => {
        try {
            setIsLoadingSale(true);
            const response = await searchProperties({
                filters: [
                    {
                        key: "listingType",
                        operator: "equal",
                        value: "for_sale"
                    },
                    {
                        key: 'approvalStatus',
                        operator: 'equal',
                        value: 'APPROVED'
                    },
                ],
                sorts: [
                    {
                        key: "createdAt",
                        type: "DESC"
                    }
                ],
                rpp: 8,
                page: 1
            })
            setSaleProperties(response.data.items);
        } catch (error) {
            console.error('Error fetching sale properties:', error);
        } finally {
            setIsLoadingSale(false);
        }
    }

    const getRentProperties = async () => {
        try {
            setIsLoadingRent(true);
            const response = await searchProperties({
                filters: [
                    {
                        key: "listingType",
                        operator: "equal",
                        value: "for_rent"
                    },
                    {
                        key: 'approvalStatus',
                        operator: 'equal',
                        value: 'APPROVED'
                    },
                ],
                sorts: [
                    {
                        key: "createdAt",
                        type: "DESC"
                    }
                ],
                rpp: 8,
                page: 1
            })
            setRentProperties(response.data.items);
        } catch (error) {
            console.error('Error fetching rent properties:', error);
        } finally {
            setIsLoadingRent(false);
        }
    }

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
                        createdAt: "",
                        updatedAt: new Date().toISOString(),
                        userId: 0,
                        location: { type: 'Point', coordinates: [0, 0] },
                    }));
                    setRecommendedProperties(mappedProperties);
                    setShowLocationNote(false);
                } else {
                    // Clear recommendations if API fails
                    setRecommendedProperties([]);
                }
            } else {
                // No location permission - clear properties and show note
                setRecommendedProperties([]);
                setShowLocationNote(true);
            }
        } catch (error) {
            console.error('Error fetching recommended properties:', error);
            setRecommendedProperties([]);
        } finally {
            setIsLoadingRecommended(false);
        }
    }, [locationPermission, userLocation, userId]);

    const handleDistrictClick = (districtId: string) => {
        navigate(`/mua-nha?addressDistrict_eq=${encodeURIComponent(districtId)}`)
    }

    // Fetch suggestions for autocomplete
    const fetchSuggestions = useCallback(async (query: string, type: 'for_sale' | 'for_rent') => {
        if (!query.trim() || query.trim().length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        try {
            setIsLoadingSuggestions(true);
            const response = await searchProperties({
                filters: [
                    {
                        key: "listingType",
                        operator: "equal",
                        value: type
                    },
                    {
                        key: 'approvalStatus',
                        operator: 'equal',
                        value: 'APPROVED'
                    },
                    {
                        key: "title",
                        operator: "like",
                        value: query
                    }
                ],
                sorts: [
                    {
                        key: "createdAt",
                        type: "DESC"
                    }
                ],
                rpp: 7,
                page: 1
            });

            if (response.status === "200" && response.data?.items) {
                setSuggestions(response.data.items);
                setShowSuggestions(true);
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            setSuggestions([]);
            setShowSuggestions(false);
        } finally {
            setIsLoadingSuggestions(false);
        }
    }, []);

    // Handle click outside to close suggestions
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Fetch suggestions when debounced search value changes
    useEffect(() => {
        if (debouncedSearchValue) {
            fetchSuggestions(debouncedSearchValue, searchType);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [debouncedSearchValue, searchType, fetchSuggestions]);

    const handleSuggestionClick = (propertyId: number) => {
        setShowSuggestions(false);
        setSearchValue('');
        navigate(`/bat-dong-san/${propertyId}`);
    };

    useEffect(() => {
        // Request user location on mount
        requestUserLocation();
        getSaleProperties();
        getRentProperties();
    }, []);

    // Refetch recommendations when location permission changes
    useEffect(() => {
        if (locationPermission !== null) {
            getRecommendedPropertiesData();
        }
    }, [locationPermission, userLocation, getRecommendedPropertiesData]);

    const executeSearch = () => {
        const trimmedValue = searchValue.trim();
        if (!trimmedValue) return;
        setShowSuggestions(false);
        const encodedValue = encodeURIComponent(trimmedValue);
        if (searchType === 'for_sale') {
            navigate(`/mua-nha?title_lk=${encodedValue}`)
        } else {
            navigate(`/thue-nha?title_lk=${encodedValue}`)
        }
    }

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            executeSearch();
        }
    };

    const handleLoadMore = () => {
        if (searchType === 'for_sale')
            navigate(`/mua-nha`)
        else
            navigate(`/thue-nha`)
    }

    return (
        <div>
            <Helmet>
                <title>Trang chủ - timnha</title>
                <meta name="description" content="Tìm kiếm bất động sản nhà đất mua bán và cho thuê nhanh chóng, dễ dàng trên timnha." />
            </Helmet>

            {/* Hero Section */}
            <div className="relative h-[600px] w-screen">
                {/* Background Image */}
                <img
                    src={homeBackground}
                    alt="Home Background"
                    className="w-full h-full object-cover"
                />

                {/* Search Container */}
                <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
                    <div className="bg-black/60 rounded-xl p-6 backdrop-blur-sm w-full max-w-3xl mx-auto">
                        {/* Search Tabs */}
                        <div className="rounded-t-lg p-1 flex items-center justify-center space-x-1 mb-3">
                            <button
                                onClick={() => setSearchType('for_sale')}
                                className={cn(
                                    "px-6 py-2.5 rounded-md transition-colors cursor-pointer text-base sm:text-lg",
                                    searchType === 'for_sale'
                                        ? "bg-[#008DDA] text-white"
                                        : "hover:bg-gray-700 text-gray-300"
                                )}
                            >
                                Mua nhà
                            </button>
                            <button
                                onClick={() => setSearchType('for_rent')}
                                className={cn(
                                    "px-6 py-2.5 rounded-md transition-colors cursor-pointer text-base sm:text-lg",
                                    searchType === 'for_rent'
                                        ? "bg-[#008DDA] text-white"
                                        : "hover:bg-gray-700 text-gray-300"
                                )}
                            >
                                Thuê nhà
                            </button>
                        </div>

                        {/* Search Box */}
                        <div className="w-full relative isolate" ref={searchContainerRef} style={{ zIndex: 10000 }}>
                            <div className="flex w-full">
                                <Input
                                    type="text"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    onKeyDown={handleSearch}
                                    onFocus={() => {
                                        if (suggestions.length > 0) {
                                            setShowSuggestions(true);
                                        }
                                    }}
                                    placeholder={`Tìm kiếm ${searchType === 'for_sale' ? 'nhà để mua' : 'nhà để thuê'}...`}
                                    className="h-[52px] bg-white text-gray-600 text-base sm:text-lg w-full rounded-r-none border-r-0 focus-visible:ring-[#008DDA] focus-visible:ring-2 focus-visible:ring-offset-0"
                                />
                                <Button
                                    type="button"
                                    onClick={executeSearch}
                                    className="h-[52px] rounded-l-none px-4 bg-[#008DDA] hover:bg-[#0072b0] cursor-pointer"
                                >
                                    <Search className="w-5 h-5 text-white" />
                                </Button>
                            </div>

                            {/* Autocomplete Suggestions Dropdown */}
                            {showSuggestions && (searchValue.trim().length >= 2) && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden max-h-[320px] overflow-y-auto" style={{ zIndex: 9999, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
                                    {isLoadingSuggestions ? (
                                        <div className="p-4 text-center text-gray-500">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-4 h-4 border-2 border-[#008DDA] border-t-transparent rounded-full animate-spin"></div>
                                                <span>Đang tìm kiếm...</span>
                                            </div>
                                        </div>
                                    ) : suggestions.length > 0 ? (
                                        <>
                                            {suggestions.map((property) => (
                                                <PropertySuggestionItem
                                                    key={property.id}
                                                    id={property.id!}
                                                    title={property.title || ''}
                                                    listingType={property.listingType}
                                                    price={property.price || 0}
                                                    priceUnit={property.priceUnit || 'VND'}
                                                    area={property.area || 0}
                                                    addressDistrict={property.addressDistrict || ''}
                                                    addressStreet={property.addressStreet || ''}
                                                    imageUrls={property.imageUrls || []}
                                                    onClick={() => handleSuggestionClick(property.id!)}
                                                />
                                            ))}
                                        </>
                                    ) : (
                                        <div className="p-4 text-center text-gray-500">
                                            Không tìm thấy kết quả phù hợp
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Properties Section */}
            <section className="py-12 px-4 max-w-7xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
                    Bất động sản dành cho bạn
                </h2>

                {/* Location Permission Note */}
                {showLocationNote && locationPermission !== 'granted' && (
                    <Alert className="mb-6 border-[#008DDA] bg-blue-50">
                        <AlertDescription className="ml-2">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900 mb-1">
                                        Chia sẻ vị trí để nhận gợi ý tốt hơn
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Cho phép truy cập vị trí của bạn để chúng tôi có thể gợi ý những bất động sản phù hợp
                                        gần khu vực bạn đang quan tâm.
                                    </p>
                                    <button
                                        onClick={requestUserLocation}
                                        className="mt-3 px-4 py-2 bg-[#008DDA] text-white text-sm rounded-md hover:bg-[#0072b0] transition-colors cursor-pointer"
                                    >
                                        Chia sẻ vị trí
                                    </button>
                                </div>
                                {/*<button*/}
                                {/*    onClick={() => setShowLocationNote(false)}*/}
                                {/*    className="text-gray-400 hover:text-gray-600 cursor-pointer"*/}
                                {/*>*/}
                                {/*    <X className="h-5 w-5" />*/}
                                {/*</button>*/}
                            </div>
                        </AlertDescription>
                    </Alert>
                )}

                {isLoadingRecommended ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {[...Array(8)].map((_, index) => (
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
                ) : (
                    <>
                        {recommendedProperties.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                    {recommendedProperties.map((property) => (
                                        <PropertyCardItem
                                            key={property.id}
                                            id={String(property.id)}
                                            listingType={property.listingType}
                                            title={property.title}
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
                                    ))}
                                </div>

                                <div className="text-center">
                                    <button
                                        onClick={() => handleLoadMore()}
                                        className="px-6 py-3 bg-white text-[#008DDA] border-2 border-[#008DDA] rounded-lg font-medium hover:bg-[#008DDA] hover:text-white transition-colors duration-200 cursor-pointer"
                                    >
                                        Xem thêm
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-16">
                                <MapPin className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                <p className="text-gray-500 text-lg mb-2">
                                    Chưa có gợi ý bất động sản
                                </p>
                                <p className="text-gray-400 text-sm">
                                    Vui lòng chia sẻ vị trí của bạn để nhận được những gợi ý phù hợp nhất
                                </p>
                            </div>
                        )}
                    </>
                )}
            </section>

            {/* Districts Section */}
            <section className="py-12 px-4 max-w-7xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
                    Bất động sản theo địa điểm
                </h2>

                <div className="grid grid-cols-12 gap-4 mb-8">
                    {/* Large district card */}
                    <div className="col-span-12 md:col-span-8 lg:col-span-6">
                        <div onClick={() => handleDistrictClick(sampleDistricts[0].id)}>
                            <DistrictCardItem {...sampleDistricts[0]}/>
                        </div>
                    </div>

                    {/* Medium district cards */}
                    <div className="col-span-12 md:col-span-4 lg:col-span-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div onClick={() => handleDistrictClick(sampleDistricts[1].id)}>
                                <DistrictCardItem {...sampleDistricts[1]} />
                            </div>

                            <div onClick={() => handleDistrictClick(sampleDistricts[2].id)}>
                                <DistrictCardItem {...sampleDistricts[2]} />
                            </div>

                        </div>
                    </div>

                    {/* Small district cards */}
                    <div className="col-span-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div onClick={() => handleDistrictClick(sampleDistricts[3].id)}>
                            <DistrictCardItem {...sampleDistricts[3]} />
                        </div>

                        <div onClick={() => handleDistrictClick(sampleDistricts[4].id)}>
                            <DistrictCardItem {...sampleDistricts[4]} />
                        </div>

                    </div>
                </div>

                <div className="text-center">
                    <button
                        onClick={() => navigate('/mua-nha')}
                        className="px-6 py-3 bg-white text-[#008DDA] border-2 border-[#008DDA] rounded-lg font-medium hover:bg-[#008DDA] hover:text-white transition-colors duration-200 cursor-pointer"
                    >
                        Xem thêm
                    </button>
                </div>
            </section>

            {/* Sale Properties Section */}
            <section className="py-12 px-4 max-w-7xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
                    Bất động sản đăng bán
                </h2>

                {isLoadingSale ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
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
                ) : (
                    <>
                        <Carousel
                            opts={{
                                align: "start",
                                loop: true,
                            }}
                            className="w-full"
                        >
                            <div className="relative">
                                <CarouselContent className="-ml-2 md:-ml-4">
                                    {saleProperties.map((property) => (
                                        <CarouselItem key={property.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                                            <div className="h-[420px]"> {/* Fixed height wrapper */}
                                                <PropertyCardItem
                                                    id={String(property.id)}
                                                    title={property.title}
                                                    listingType={property.listingType}
                                                    price={property.price}
                                                    area={property.area}
                                                    address={String(property.addressStreet + " " + property.addressWard + " " + property.addressDistrict + " " + property.addressCity)}
                                                    imageUrl={property.imageUrls?.[0] || ""}
                                                    createdAt={property.createdAt || ""}
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

                        <div className="text-center mt-8">
                            <button
                                onClick={() => navigate('/mua-nha')}
                                className="px-6 py-3 bg-white text-[#008DDA] border-2 border-[#008DDA] rounded-lg font-medium hover:bg-[#008DDA] hover:text-white transition-colors duration-200 cursor-pointer"
                            >
                                Xem tất cả
                            </button>
                        </div>
                    </>
                )}
            </section>

            {/* Rent Properties Section */}
            <section className="py-12 px-4 max-w-7xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
                    Bất động sản cho thuê
                </h2>

                {isLoadingRent ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
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
                ) : (
                    <>
                        <Carousel
                            opts={{
                                align: "start",
                                loop: true,
                            }}
                            className="w-full"
                        >
                            <div className="relative">
                                <CarouselContent className="-ml-2 md:-ml-4">
                                    {rentProperties.map((property) => (
                                        <CarouselItem key={property.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                                            <div className="h-[420px]"> {/* Fixed height wrapper */}
                                                <PropertyCardItem
                                                    id={String(property.id)}
                                                    title={property.title}
                                                    listingType={property.listingType}
                                                    price={property.price}
                                                    area={property.area}
                                                    address={String(property.addressStreet + " " + property.addressWard + " " + property.addressDistrict + " " + property.addressCity)}
                                                    imageUrl={property.imageUrls?.[0] || ""}
                                                    createdAt={property.createdAt || ""}
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

                        <div className="text-center mt-8">
                            <button
                                onClick={() => navigate('/thue-nha')}
                                className="px-6 py-3 bg-white text-[#008DDA] border-2 border-[#008DDA] rounded-lg font-medium hover:bg-[#008DDA] hover:text-white transition-colors duration-200 cursor-pointer"
                            >
                                Xem tất cả
                            </button>
                        </div>
                    </>
                )}
            </section>
        </div>
    );
}

