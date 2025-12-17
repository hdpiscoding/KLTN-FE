import React, {useState, useEffect, useCallback} from 'react';
import {useParams} from 'react-router-dom';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi
} from '@/components/ui/carousel.tsx';
import {Button} from '@/components/ui/button.tsx';
import {Skeleton} from '@/components/ui/skeleton.tsx';
import {
    Heart,
    MapPin,
    Phone,
    User,
    Loader2,
    Shield,
    GraduationCap,
    ShoppingBag,
    Car,
    Leaf,
    Music,
    MessageCircle
} from 'lucide-react';
import {cn} from '@/lib/utils.ts';
import {formatPrice, formatArea, formatPhoneNumber} from '@/utils/generalFormat.ts';
import {formatDate} from "@/utils/generalFormat.ts";
import {PropertyCardItem} from '@/components/card-item/property-card-item.tsx';
import StaticMarkerMap from "@/components/map/static-marker-map.tsx";
import type {Location} from "@/types/location.d.ts";
import type {PropertyListing} from "@/types/property-listing.d.ts";
import {useUserStore} from "@/store/userStore.ts";
import {getPropertyDetails, getLivabilityScore, getRecommendedProperties} from "@/services/propertyServices.ts";
import {getPropertyInsight} from "@/services/chatbotServices.ts";
import {likeProperty, unlikeProperty, checkLikeProperty} from "@/services/userServices.ts";
import {PROPERTY_TYPES} from "@/constants/propertyTypes.ts";
import {CircularProgress} from "@/components/ui/circular-progress.tsx";
import {Progress} from "@/components/ui/progress.tsx";
import {toast} from "react-toastify";
import ReactMarkdown from "react-markdown";
import {useChatContext, useLoadChatHistory} from "@/hooks/chat";
import {useChatStore} from "@/store/chatStore";

interface LivabilityData {
    id: number;
    property_id: number;
    score_healthcare: number;
    score_education: number;
    score_shopping: number;
    score_transportation: number;
    score_environment: number;
    score_entertainment: number;
    score_safety: number;
    livability_score: number;
    update_at: string;

    [key: string]: string | number; // Allow additional dynamic properties like dist_* and count_*
}

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

export const PropertyDetail: React.FC = () => {
    const {id} = useParams();
    const [isFavorited, setIsFavorited] = useState(false);
    const [isCheckingFavorite, setIsCheckingFavorite] = useState(false);
    const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(1);
    const [carouselApi, setCarouselApi] = useState<CarouselApi>();
    const [property, setProperty] = useState<PropertyListing | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [livabilityData, setLivabilityData] = useState<LivabilityData | null>(null);
    const [isLoadingLivability, setIsLoadingLivability] = useState(false);
    const isLoggedIn = useUserStore((state) => state.isLoggedIn);

    // Chat hooks
    const { switchToInsight } = useChatContext();
    const { loadHistory } = useLoadChatHistory();
    const setIsOpen = useChatStore((state) => state.setIsOpen);

    // Location and recommended properties states
    const userId = useUserStore((state) => state.userId);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt' | null>(null);
    const [suggestedProperties, setSuggestedProperties] = useState<PropertyListing[]>([]);
    const [isLoadingSuggested, setIsLoadingSuggested] = useState(false);

    // Property insight states
    const [propertyInsight, setPropertyInsight] = useState<string>('');
    const [isLoadingInsight, setIsLoadingInsight] = useState(false);

    // Request user location
    const requestUserLocation = useCallback(() => {
        if (!navigator.geolocation) {
            console.error('Geolocation is not supported by this browser');
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
                console.log('User location obtained:', position.coords.latitude, position.coords.longitude);
            },
            (error) => {
                console.error('Error getting location:', error);
                setLocationPermission('denied');
            }
        );
    }, []);

    // Fetch property details from API
    useEffect(() => {
        const fetchPropertyDetails = async () => {
            if (!id) return;

            try {
                setIsLoading(true);
                const response = await getPropertyDetails(id);
                setProperty(response.data);
            } catch (error) {
                console.error('Error fetching property details:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPropertyDetails();
    }, [id]);

    // Check if property is liked (only if user is logged in)
    useEffect(() => {
        const checkIfLiked = async () => {
            if (!isLoggedIn || !property?.id) return;

            try {
                setIsCheckingFavorite(true);
                const response = await checkLikeProperty(property.id);

                if (response.status === "200" && response.data !== undefined) {
                    setIsFavorited(response.data);
                }
            } catch (error) {
                console.error('Error checking if property is liked:', error);
            } finally {
                setIsCheckingFavorite(false);
            }
        };

        checkIfLiked();
    }, [isLoggedIn, property?.id]);

    // Fetch livability score after property is loaded
    useEffect(() => {
        const fetchLivabilityScore = async () => {
            if (!property?.id) return;

            try {
                setIsLoadingLivability(true);
                const response = await getLivabilityScore({propertyIds: [property.id]});

                if (response.status === "200" && response.data?.items?.length > 0) {
                    setLivabilityData(response.data.items[0]);
                }
            } catch (error) {
                console.error('Error fetching livability score:', error);
            } finally {
                setIsLoadingLivability(false);
            }
        };

        fetchLivabilityScore();
    }, [property?.id]);

    // Fetch property insight
    useEffect(() => {
        const fetchPropertyInsight = async () => {
            if (!property?.id) return;

            try {
                setIsLoadingInsight(true);
                setPropertyInsight('');

                let fullInsight = '';

                await getPropertyInsight(
                    property.id,
                    (data) => {
                        // Accumulate the streamed content but don't display yet
                        if (data.type === 'content' && data.text) {
                            fullInsight += data.text;
                        }
                    },
                    () => {
                        // Display the full insight when streaming is complete
                        setPropertyInsight(fullInsight);
                        setIsLoadingInsight(false);
                    },
                    (error) => {
                        console.error('Error fetching property insight:', error);
                        setIsLoadingInsight(false);
                    }
                );
            } catch (error) {
                console.error('Error fetching property insight:', error);
                setIsLoadingInsight(false);
            }
        };

        fetchPropertyInsight();
    }, [property?.id]);

    // Build location object from property data
    const location: Location | null = property ? {
        latitude: property.location.coordinates[1], // GeoJSON format: [longitude, latitude]
        longitude: property.location.coordinates[0],
        address: `${property.addressStreet || ''}, ${property.addressWard || ''}, ${property.addressDistrict || ''}, ${property.addressCity || ''}`.trim(),
    } : null;

    const handleCopyPhone = (phoneNumber: string) => {
        navigator.clipboard.writeText(phoneNumber);
        toast.success('Đã copy số điện thoại!');
    };

    const handleToggleFavorite = async () => {
        if (!property?.id) return;

        // Prevent multiple clicks while processing
        if (isTogglingFavorite) return;

        try {
            setIsTogglingFavorite(true);

            if (isFavorited) {
                // Unlike property
                const response = await unlikeProperty(property.id);

                if (response.status === "200") {
                    setIsFavorited(false);
                    toast.success('Đã bỏ yêu thích!');
                }
            } else {
                // Like property
                const response = await likeProperty(property.id);

                if (response.status === "200") {
                    setIsFavorited(true);
                    toast.success('Đã thêm vào yêu thích!');
                }
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            toast.error('Có lỗi xảy ra. Vui lòng thử lại!');
        } finally {
            setIsTogglingFavorite(false);
        }
    };

    const handleContinueChat = async () => {
        if (!property?.id) return;

        try {
            // Switch to insight context with propertyId
            switchToInsight(property.id);

            // Load chat history for this property
            await loadHistory("insight", { propertyId: property.id });

            // Open chat window
            setIsOpen(true);
        } catch (error) {
            console.error("Failed to open chat:", error);
            toast.error("Không thể mở chat. Vui lòng thử lại.");
        }
    };

    // Component score labels - matching EstimatePropertyPrice
    const componentScoreLabels = [
        {key: 'score_safety', label: 'An ninh', icon: Shield, color: '#3b82f6'},
        {key: 'score_healthcare', label: 'Y tế', icon: Heart, color: '#ef4444'},
        {key: 'score_education', label: 'Giáo dục', icon: GraduationCap, color: '#8b5cf6'},
        {key: 'score_shopping', label: 'Tiện ích', icon: ShoppingBag, color: '#22c55e'},
        {key: 'score_transportation', label: 'Giao thông', icon: Car, color: '#eab308'},
        {key: 'score_environment', label: 'Môi trường', icon: Leaf, color: '#14b8a6'},
        {key: 'score_entertainment', label: 'Giải trí', icon: Music, color: '#ec4899'},
    ];

    // Get property type name from ID
    const getPropertyTypeName = (typeId: string) => {
        const propertyType = PROPERTY_TYPES.find(type => type.id === typeId);
        return propertyType ? propertyType.name : typeId;
    };

    // Fetch recommended properties based on user location
    const getRecommendedPropertiesData = useCallback(async () => {
        try {
            setIsLoadingSuggested(true);

            // Only fetch if user has granted location permission and we have coordinates
            if (locationPermission === 'granted' && userLocation) {
                let response;
                if (userId) {
                    response = await getRecommendedProperties(
                        userLocation.lat,
                        userLocation.lng,
                        6, // limit to 6 properties
                        20,
                        userId
                    );
                } else {
                    response = await getRecommendedProperties(
                        userLocation.lat,
                        userLocation.lng,
                        6, // limit to 6 properties
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
                        location: {type: 'Point', coordinates: [0, 0]},
                    }));

                    setSuggestedProperties(mappedProperties);
                } else {
                    // Clear recommendations if API fails
                    setSuggestedProperties([]);
                }
            } else {
                // No location permission - clear properties
                setSuggestedProperties([]);
            }
        } catch (error) {
            console.error('Error fetching recommended properties:', error);
            setSuggestedProperties([]);
        } finally {
            setIsLoadingSuggested(false);
        }
    }, [locationPermission, userLocation, userId]);

    React.useEffect(() => {
        if (!carouselApi) return;

        const onSelect = () => {
            setCurrentSlide(carouselApi.selectedScrollSnap() + 1);
        };

        carouselApi.on('select', onSelect);
        onSelect();

        return () => {
            carouselApi.off('select', onSelect);
        };
    }, [carouselApi]);

    // Fetch recommended properties when location changes
    useEffect(() => {
        getRecommendedPropertiesData();
    }, [getRecommendedPropertiesData]);

    // Request user location on mount if not already obtained
    useEffect(() => {
        if (locationPermission === null) {
            requestUserLocation();
        }
    }, [locationPermission, requestUserLocation]);

    // Show loading skeleton
    if (isLoading || !property) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Main Content Skeleton */}
                        <div className="flex-1 lg:w-3/4 space-y-6">
                            {/* Image Carousel Skeleton */}
                            <Skeleton className="w-full aspect-video rounded-lg"/>

                            {/* Title Section Skeleton */}
                            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                                <Skeleton className="h-8 w-3/4"/>
                                <Skeleton className="h-4 w-full"/>
                                <div className="flex gap-6 pt-4 border-t">
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-20"/>
                                        <Skeleton className="h-10 w-32"/>
                                    </div>
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-20"/>
                                        <Skeleton className="h-10 w-24"/>
                                    </div>
                                </div>
                            </div>

                            {/* Description Skeleton */}
                            <div className="bg-white rounded-lg shadow-md p-6 space-y-3">
                                <Skeleton className="h-6 w-48"/>
                                <Skeleton className="h-4 w-full"/>
                                <Skeleton className="h-4 w-full"/>
                                <Skeleton className="h-4 w-3/4"/>
                            </div>

                            {/* Characteristics Skeleton */}
                            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                                <Skeleton className="h-6 w-56"/>
                                <div className="grid grid-cols-2 gap-4">
                                    {[...Array(10)].map((_, i) => (
                                        <Skeleton key={i} className="h-12 w-full"/>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Skeleton */}
                        <div className="lg:w-1/4">
                            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                                <Skeleton className="h-6 w-32"/>
                                <div className="flex items-center gap-3">
                                    <Skeleton className="w-16 h-16 rounded-full"/>
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-4 w-24"/>
                                        <Skeleton className="h-3 w-20"/>
                                    </div>
                                </div>
                                <Skeleton className="h-12 w-full"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Main Content - 75% */}
                    <div className="flex-1 lg:w-3/4 space-y-6">
                        {/* Image Carousel */}
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <Carousel
                                setApi={setCarouselApi}
                                opts={{
                                    align: 'start',
                                    loop: false,
                                }}
                                className="w-full"
                            >
                                <div className="relative">
                                    <CarouselContent>
                                        {property.imageUrls?.map((image, index) => (
                                            <CarouselItem key={index}>
                                                <div className="relative aspect-video">
                                                    <img
                                                        src={image}
                                                        alt={`${property.title} - Ảnh ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    {/* Slide Status */}
                                                    <div
                                                        className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1.5 rounded-lg text-sm font-medium">
                                                        {currentSlide}/{property.imageUrls?.length}
                                                    </div>
                                                </div>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious className="left-4 cursor-pointer"/>
                                    <CarouselNext className="right-4 cursor-pointer"/>
                                </div>
                            </Carousel>
                        </div>

                        {/* Property Title */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                                {property.title}
                            </h2>

                            {/* Address */}
                            <div className="flex items-start gap-2 text-gray-600 mb-4">
                                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5"/>
                                <p className="text-base">{location?.address}</p>
                            </div>

                            {/* Price, Area, Favorite */}
                            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t">
                                <div className="flex flex-wrap items-center gap-6">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Mức giá</p>
                                        <p className="text-3xl font-bold text-[#008DDA]">
                                            {formatPrice(property.price)}
                                        </p>
                                    </div>
                                    <div className="h-12 w-px bg-gray-200"></div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Diện tích</p>
                                        <div className="flex items-center gap-1">
                                            <p className="text-xl font-semibold text-gray-900">
                                                {formatArea(property.area)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Favorite Button */}
                                {isLoggedIn && (
                                    <button
                                        onClick={handleToggleFavorite}
                                        disabled={isCheckingFavorite || isTogglingFavorite}
                                        className={cn(
                                            'cursor-pointer p-3 rounded-full transition-all duration-200 bg-white',
                                            'disabled:opacity-50 disabled:cursor-not-allowed',
                                            isFavorited
                                                ? 'text-red-500'
                                                : 'text-gray-400 hover:text-red-500'
                                        )}
                                    >
                                        {isTogglingFavorite ? (
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                        ) : (
                                            <Heart
                                                className={cn('w-6 h-6', isFavorited && 'fill-current')}
                                            />
                                        )}
                                    </button>
                                )}

                            </div>

                            {/* Property ID, Created Date, Updated Date */}
                            <div className="flex flex-wrap items-center gap-6 pt-4 border-t mt-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Mã tin</p>
                                    <p className="text-sm font-semibold text-gray-900 font-mono">
                                        #TN-{property.id}
                                    </p>
                                </div>
                                <div className="h-8 w-px bg-gray-200"></div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Ngày đăng</p>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {formatDate(property?.createdAt || "")}
                                    </p>
                                </div>
                                <div className="h-8 w-px bg-gray-200"></div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Cập nhật lần cuối</p>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {formatDate(property?.updatedAt || "")}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Thông tin mô tả
                            </h2>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {property.description}
                            </p>
                        </div>

                        {/* Property Characteristics */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Đặc điểm bất động sản
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Property Type - Always show */}
                                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                    <span className="text-gray-600">Loại bất động sản</span>
                                    <span className="font-semibold text-gray-900">
                                        {getPropertyTypeName(property.propertyType)}
                                    </span>
                                </div>

                                {/* Legal Doc */}
                                {property.legalStatus && (
                                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                        <span className="text-gray-600">Giấy tờ pháp lý</span>
                                        <span className="font-semibold text-gray-900">
                                            {property.legalStatus}
                                        </span>
                                    </div>
                                )}

                                {/* Furniture */}
                                {property.furnitureStatus && (
                                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                        <span className="text-gray-600">Nội thất</span>
                                        <span className="font-semibold text-gray-900">
                                            {property.furnitureStatus}
                                        </span>
                                    </div>
                                )}

                                {/* Bedrooms */}
                                {property.numBedrooms && (
                                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                        <span className="text-gray-600">Số phòng ngủ</span>
                                        <span className="font-semibold text-gray-900">
                                            {property.numBedrooms} phòng
                                        </span>
                                    </div>
                                )}

                                {/* Bathrooms */}
                                {property.numBathrooms && (
                                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                        <span className="text-gray-600">Số phòng tắm</span>
                                        <span className="font-semibold text-gray-900">
                                            {property.numBathrooms} phòng
                                        </span>
                                    </div>
                                )}

                                {/* Floors */}
                                {property.numFloors && (
                                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                        <span className="text-gray-600">Số tầng</span>
                                        <span className="font-semibold text-gray-900">
                                            {property.numFloors} tầng
                                        </span>
                                    </div>
                                )}

                                {/* House Direction */}
                                {property.houseDirection && (
                                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                        <span className="text-gray-600">Hướng nhà</span>
                                        <span className="font-semibold text-gray-900">
                                            {property.houseDirection}
                                        </span>
                                    </div>
                                )}

                                {/* Balcony Direction */}
                                {property.balconyDirection && (
                                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                        <span className="text-gray-600">Hướng ban công</span>
                                        <span className="font-semibold text-gray-900">
                                            {property.balconyDirection}
                                        </span>
                                    </div>
                                )}

                                {/* Road Width */}
                                {property.roadWidthM && (
                                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                        <span className="text-gray-600">Đường vào</span>
                                        <span className="font-semibold text-gray-900">
                                            {property.roadWidthM} m
                                        </span>
                                    </div>
                                )}

                                {/* Front Width */}
                                {property.facadeWidthM && (
                                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                        <span className="text-gray-600">Mặt tiền</span>
                                        <span className="font-semibold text-gray-900">
                                            {property.facadeWidthM} m
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Map Section */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Vị trí trên bản đồ
                            </h2>
                            <div
                                className="w-full h-96 rounded-lg bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center relative overflow-hidden border border-gray-200">
                                <StaticMarkerMap
                                    location={location!}
                                    defaultZoom={16}
                                />
                            </div>
                        </div>

                        {/* Livability Score Section */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                Chỉ số sống
                            </h2>

                            {isLoadingLivability ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="w-8 h-8 animate-spin text-[#008DDA]"/>
                                </div>
                            ) : livabilityData ? (
                                <div className="space-y-6">
                                    {/* Overall Livability Score */}
                                    <div className="flex flex-col items-center pb-6 border-b">
                                        <p className="text-sm text-gray-600 font-medium mb-4">
                                            Tổng quan chỉ số sống
                                        </p>
                                        <CircularProgress
                                            value={livabilityData.livability_score}
                                            size={140}
                                            strokeWidth={10}
                                        />
                                        <p className="text-sm text-gray-500 mt-3">
                                            Cập nhật: {formatDate(livabilityData.update_at)}
                                        </p>
                                    </div>

                                    {/* Component Scores */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                            Các chỉ số chi tiết
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {componentScoreLabels.map(({key, label, icon: Icon, color}) => {
                                                const score = livabilityData[key as keyof typeof livabilityData];
                                                if (typeof score !== 'number') return null;

                                                return (
                                                    <div key={key} className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <Icon className="w-5 h-5" style={{color}}/>
                                                                <span
                                                                    className="text-sm font-medium text-gray-700">{label}</span>
                                                            </div>
                                                            <span className="text-sm font-semibold" style={{color}}>
                                                                {score.toFixed(1)}
                                                            </span>
                                                        </div>
                                                        <Progress
                                                            value={score}
                                                            className="h-2"
                                                            indicatorColor={color}
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Additional Metrics */}
                                    {(() => {
                                        // Filter and map additional metrics
                                        const excludeKeys = ['id', 'property_id', 'score_healthcare', 'score_education',
                                            'score_shopping', 'score_transportation', 'score_environment',
                                            'score_entertainment', 'score_safety', 'livability_score', 'update_at'];

                                        const additionalMetrics = Object.entries(livabilityData)
                                            .filter(([key, value]) =>
                                                !excludeKeys.includes(key) &&
                                                value !== null &&
                                                value !== undefined &&
                                                (key.startsWith('dist_') || key.startsWith('count_'))
                                            )
                                            .map(([key, value]) => {
                                                // Format label
                                                const isDistance = key.startsWith('dist_');
                                                const rawLabel = key.replace('dist_', '').replace('count_', '');

                                                const labelMap: Record<string, string> = {
                                                    'healthcare': 'bệnh viện',
                                                    'education': 'trường học',
                                                    'shopping': 'mua sắm',
                                                    'transportation': 'giao thông',
                                                    'environment': 'công viên',
                                                    'entertainment': 'giải trí',
                                                    'safety': 'an ninh',
                                                };

                                                const label = isDistance
                                                    ? `Khoảng cách đến ${labelMap[rawLabel] || rawLabel}`
                                                    : `Số điểm ${labelMap[rawLabel] || rawLabel} gần đây`;

                                                // Format value
                                                const formattedValue = isDistance
                                                    ? `${(value as number).toFixed(0)} m`
                                                    : `${value}`;

                                                return {label, value: formattedValue};
                                            });

                                        if (additionalMetrics.length === 0) return null;

                                        return (
                                            <div className="pt-6 border-t">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                                    Thông tin bổ sung
                                                </h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {additionalMetrics.map((metric, index) => (
                                                        <div key={index}
                                                             className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                                                            <span
                                                                className="text-sm text-gray-600">{metric.label}</span>
                                                            <span className="font-semibold text-gray-900">
                                                                {metric.value}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    <p>Không có dữ liệu chỉ số sống cho bất động sản này</p>
                                </div>
                            )}

                            {/* AI Insight Section */}
                            {isLoadingInsight ? (
                                <div className="mt-6 pt-6 border-t">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Phân tích từ AI
                                    </h3>
                                    <div className="flex items-center justify-center py-8">
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 className="w-6 h-6 animate-spin text-[#008DDA]"/>
                                            <p className="text-sm text-gray-500">Đang phân tích bất động sản...</p>
                                        </div>
                                    </div>
                                </div>
                            ) : propertyInsight ? (
                                <div className="mt-6 pt-6 border-t">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Phân tích từ AI
                                    </h3>
                                    <div className="prose prose-sm max-w-none mb-4 text-gray-700">
                                        <ReactMarkdown>{propertyInsight}</ReactMarkdown>
                                    </div>
                                    <div className="mt-6 pt-6 border-t border-gray-200">
                                        <div className="relative">
                                            {/* Gradient background effect */}
                                            <div
                                                className="absolute inset-0 bg-gradient-to-r from-[#008DDA] to-[#00B4D8] rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>

                                            <Button
                                                onClick={handleContinueChat}
                                                className="relative w-full h-14 text-base font-semibold bg-gradient-to-r from-[#008DDA] to-[#00B4D8] hover:from-[#0064A6] hover:to-[#008DDA] text-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                                            >
                                                <div className="flex items-center justify-center gap-3">
                                                    <div className="relative">
                                                        <MessageCircle className="w-5 h-5 transition-transform group-hover:scale-110 duration-300"/>
                                                    </div>
                                                    <span className="bg-gradient-to-r from-white to-blue-50 bg-clip-text text-transparent font-bold">
                                                        Tiếp tục trò chuyện với AI
                                                    </span>
                                                    <div className="ml-1 transition-transform group-hover:translate-x-1 duration-300">
                                                        →
                                                    </div>
                                                </div>
                                            </Button>
                                        </div>
                                        <p className="text-center text-xs text-gray-500 mt-3">
                                            Đặt câu hỏi về bất động sản này và nhận tư vấn chi tiết từ AI
                                        </p>
                                    </div>
                                </div>
                            ) : null}
                        </div>

                        {/* Suggested Properties Section */}
                        {locationPermission === 'granted' && userLocation && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                    Bất động sản gợi ý
                                </h2>

                                {isLoadingSuggested ? (
                                    /* Loading Skeleton */
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {[...Array(6)].map((_, index) => (
                                            <div key={index} className="space-y-3">
                                                <Skeleton className="h-48 w-full rounded-lg"/>
                                                <Skeleton className="h-4 w-3/4"/>
                                                <Skeleton className="h-4 w-full"/>
                                                <div className="flex justify-between">
                                                    <Skeleton className="h-4 w-1/3"/>
                                                    <Skeleton className="h-4 w-1/3"/>
                                                </div>
                                                <Skeleton className="h-4 w-1/2"/>
                                            </div>
                                        ))}
                                    </div>
                                ) : suggestedProperties.length > 0 ? (
                                    <>
                                        {/* Desktop Grid View - hidden on mobile */}
                                        <div className="hidden sm:block">
                                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                                {suggestedProperties.map((item) => (
                                                    <PropertyCardItem
                                                        key={item.id}
                                                        id={String(item.id)}
                                                        title={item.title}
                                                        price={item.price}
                                                        area={item.area}
                                                        address={`${item.addressStreet}, ${item.addressWard}, ${item.addressDistrict}, ${item.addressCity}`}
                                                        imageUrl={item.imageUrls?.[0] || ""}
                                                        createdAt={item.createdAt || ""}
                                                        onFavoriteClick={(id) => console.log('Favorite clicked:', id)}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        {/* Mobile Carousel View - visible only on mobile */}
                                        <div className="block sm:hidden">
                                            <Carousel
                                                opts={{
                                                    align: 'start',
                                                    loop: true,
                                                }}
                                                className="w-full"
                                            >
                                                <CarouselContent className="-ml-2 md:-ml-4">
                                                    {suggestedProperties.map((item) => (
                                                        <CarouselItem key={item.id} className="pl-2 md:pl-4">
                                                            <PropertyCardItem
                                                                id={String(item.id)}
                                                                title={item.title}
                                                                price={item.price}
                                                                area={item.area}
                                                                address={`${item.addressStreet}, ${item.addressWard}, ${item.addressDistrict}, ${item.addressCity}`}
                                                                imageUrl={item.imageUrls?.[0] || ""}
                                                                createdAt={item.createdAt || ""}
                                                                onFavoriteClick={(id) => console.log('Favorite clicked:', id)}
                                                            />
                                                        </CarouselItem>
                                                    ))}
                                                </CarouselContent>
                                                <CarouselPrevious className="left-2 cursor-pointer hidden md:block"/>
                                                <CarouselNext className="right-2 cursor-pointer hidden md:block"/>
                                            </Carousel>
                                        </div>
                                    </>
                                ) : null}
                            </div>
                        )}
                    </div>

                    {/* Contact Card - 25% */}
                    <aside className="lg:w-1/4 space-y-4">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Thông tin liên hệ
                            </h3>

                            {/* Owner Info - TODO: Fetch owner data from separate API */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                    {property?.sellerProfile?.avatarUrl
                                        ?
                                        <img src={property.sellerProfile.avatarUrl} alt="avatar"
                                             className="w-full h-full object-cover"/>
                                        :
                                        <div className="w-full h-full flex items-center justify-center bg-[#008DDA]">
                                            <User className="w-8 h-8 text-white"/>
                                        </div>
                                    }

                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900 truncate">
                                        {property?.sellerProfile?.fullName}
                                    </p>
                                    <p className="text-sm text-gray-500">Người đăng tin</p>
                                </div>
                            </div>

                            {/* Phone Button - TODO: Get phone from owner data */}
                            <Button
                                onClick={() => {
                                    handleCopyPhone(String(property?.sellerProfile?.phoneNumber))
                                }}
                                className="w-full bg-[#008DDA] hover:bg-[#0064A6] text-white font-semibold py-6 transition-colors duration-200 cursor-pointer"
                            >
                                <Phone className="w-5 h-5 mr-2"/>
                                {formatPhoneNumber(String(property?.sellerProfile?.phoneNumber))}
                            </Button>

                            <p className="text-xs text-gray-500 text-center mt-3">
                                Click để copy số điện thoại
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};
