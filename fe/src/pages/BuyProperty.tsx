import React, { useState, useEffect } from 'react';
import { Search, MapIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { DISTRICTS } from '@/constants/districts';
import { PROPERTY_TYPES } from "@/constants/propertyTypes.ts";
import { PRICE_RANGES} from "@/constants/priceRanges.ts";
import { PROPERTY_SORT_CRITERIAS } from "@/constants/propertySortCriterias.ts";
import { PropertyListItem } from '@/components/property-list-item';
import { PropertyTypeFilter } from '@/components/property-type-filter';
import { PropertyDistrictFilter } from '@/components/property-district-filter';
import {ControlledPagination} from "@/components/controlled-pagination.tsx";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel.tsx";
import {PropertyCardItem} from "@/components/property-card-item.tsx";
import MultipleMarkerMap, { type PropertyMarker } from '@/components/multiple-marker-map';
import type {PropertyListing} from "@/types/property-listing";
import { useSearchFilters } from '@/hooks/use-search-filters';
import { searchProperties } from '@/services/propertyServices';
import { Skeleton } from '@/components/ui/skeleton';
import { getPriceRangeValue, getPriceRangeId } from '@/utils/priceRangeHelper';
import { getSortCriteriaValue } from '@/utils/sortCriteriaHelper';
import { useSearchParams } from 'react-router-dom';

export const BuyProperty: React.FC = () => {
    const [searchValue, setSearchValue] = useState('');
    const [district, setDistrict] = useState('all');
    const [propertyType, setPropertyType] = useState('all');
    const [priceRange, setPriceRange] = useState('all');
    const [sortCriteria, setSortCriteria] = useState('default');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [propertyList, setPropertyList] = useState<PropertyListing[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { filters, setFilter } = useSearchFilters();
    const [searchParams, setSearchParams] = useSearchParams();

    // Sample data for properties
    const sampleProperties = [
        {
            id: "1",
            title: "Căn hộ cao cấp tại trung tâm quận 1, view sông Sài Gòn tuyệt đẹp",
            price: 2500000000,
            area: 85,
            address: "Vinhomes Central Park, 208 Nguyễn Hữu Cảnh, Quận 1, TP.HCM",
            imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
            createdAt: "2025-11-05T09:00:00.000Z",
            location: {
                latitude: 10.8231,
                longitude: 106.6297,
                address: "Vinhomes Central Park, 208 Nguyễn Hữu Cảnh, Quận 1, TP.HCM"
            }
        },
        {
            id: "2",
            title: "Nhà phố liền kề khu compound an ninh 24/7",
            price: 4200000000,
            area: 120,
            address: "Palm City, Quận 9, TP.HCM",
            imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
            createdAt: "2025-11-06T15:30:00.000Z",
            location: {
                latitude: 10.8545,
                longitude: 106.6296,
                address: "Palm City, Quận 9, TP.HCM"
            }
        },
        {
            id: "3",
            title: "Căn hộ 2 phòng ngủ full nội thất cao cấp",
            price: 1800000000,
            area: 65,
            address: "Masteri Thảo Điền, Quận 2, TP.HCM",
            imageUrl: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?q=80&w=2084&auto=format&fit=crop",
            createdAt: "2025-11-07T08:15:00.000Z",
            location: {
                latitude: 10.7970,
                longitude: 106.7215,
                address: "Masteri Thảo Điền, Quận 2, TP.HCM"
            }
        },
        {
            id: "4",
            title: "Biệt thự sân vườn phong cách hiện đại",
            price: 8500000000,
            area: 300,
            address: "Thảo Điền, Quận 2, TP.HCM",
            imageUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop",
            createdAt: "2025-11-07T10:45:00.000Z",
            location: {
                latitude: 10.8050,
                longitude: 106.7350,
                address: "Thảo Điền, Quận 2, TP.HCM"
            }
        },
        {
            id: "5",
            title: "Căn hộ Duplex view công viên",
            price: 3200000000,
            area: 110,
            address: "Lumière Riverside, Quận 2, TP.HCM",
            imageUrl: "https://images.unsplash.com/photo-1512916194211-3f2b7f5f7de3?q=80&w=2070&auto=format&fit=crop",
            createdAt: "2025-11-06T11:20:00.000Z",
            location: {
                latitude: 10.7820,
                longitude: 106.7020,
                address: "Lumière Riverside, Quận 2, TP.HCM"
            }
        },
        {
            id: "6",
            title: "Nhà phố thương mại mặt tiền đường lớn",
            price: 12000000000,
            area: 160,
            address: "Phú Mỹ Hưng, Quận 7, TP.HCM",
            imageUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=2074&auto=format&fit=crop",
            createdAt: "2025-11-05T14:10:00.000Z",
            location: {
                latitude: 10.7350,
                longitude: 106.7123,
                address: "Phú Mỹ Hưng, Quận 7, TP.HCM"
            }
        },
        {
            id: "7",
            title: "Căn hộ Studio hiện đại, đầy đủ tiện nghi",
            price: 1200000000,
            area: 35,
            address: "The Gold View, Quận 4, TP.HCM",
            imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
            createdAt: "2025-11-08T09:00:00.000Z",
            location: {
                latitude: 10.7626,
                longitude: 106.7040,
                address: "The Gold View, Quận 4, TP.HCM"
            }
        },
        {
            id: "8",
            title: "Penthouse Duplex view toàn cảnh thành phố",
            price: 15000000000,
            area: 250,
            address: "Empire City, Mai Chí Thọ, Quận 2, TP.HCM",
            imageUrl: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=2070&auto=format&fit=crop",
            createdAt: "2025-11-08T09:00:00.000Z",
            location: {
                latitude: 10.7900,
                longitude: 106.7150,
                address: "Empire City, Mai Chí Thọ, Quận 2, TP.HCM"
            }
        },
    ];

    // Convert sampleProperties to PropertyMarker format for map
    const propertyMarkers: PropertyMarker[] = sampleProperties.map(property => ({
        id: property.id,
        location: property.location,
        title: property.title,
        image: property.imageUrl,
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
            console.log('Searching for:', trimmedValue);
        } else {
            setFilter('title', 'lk', ''); // Xóa filter nếu rỗng
        }
    };

    const handleToggleMap = () => {
        setIsMapOpen(!isMapOpen);
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
                        value: 'for_sale'
                    }
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

    // Cleanup effect: Reset body overflow when component unmounts
    useEffect(() => {
        return () => {
            // Always reset body overflow when leaving this page
            document.body.style.overflow = '';
        };
    }, []);

    // Effect to handle body overflow based on map state
    useEffect(() => {
        if (isMapOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        // Cleanup when effect re-runs or component unmounts
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMapOpen]);

    return (
        <div className={`min-h-screen bg-gray-50 ${isMapOpen ? 'h-screen overflow-hidden' : ''}`}>
            <div className={isMapOpen ? "w-full" : "max-w-7xl mx-auto px-4 py-6"}>
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
                                <Button
                                    onClick={handleToggleMap}
                                    variant="outline"
                                    className="flex items-center justify-center gap-2 border-[#008DDA] text-[#008DDA] hover:bg-[#008DDA] hover:text-white transition-colors cursor-pointer"
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
                            Mua bán nhà đất ở Thành phố Hồ Chí Minh
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
                                        price={property.price}
                                        area={property.area}
                                        address={`${property.addressStreet}, ${property.addressWard}, ${property.addressDistrict}, ${property.addressCity}`}
                                        imageUrl={property.imageUrls[0] || ""}
                                        createdAt={property.createdAt}
                                        onFavoriteClick={(id) => console.log('Favorite clicked:', id)}
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


                        {/* Suggested Properties - Always show */}
                        <section className={isMapOpen ? "py-8" : "py-12 px-4 max-w-7xl mx-auto"}>
                            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-8">
                                Bất động sản gợi ý
                            </h2>

                            <Carousel
                                opts={{
                                    align: "start",
                                    loop: true,
                                }}
                                className="w-full"
                            >
                                <div className="relative">
                                    <CarouselContent className="-ml-2 md:-ml-4">
                                        {sampleProperties.map((property) => (
                                            <CarouselItem key={property.id} className={`pl-2 md:pl-4 ${isMapOpen ? 'basis-full md:basis-1/2 lg:basis-1/2' : 'sm:basis-1/2 md:basis-1/2 lg:basis-1/3'}`}>
                                                <div className="h-[420px]"> {/* Fixed height wrapper */}
                                                    <PropertyCardItem {...property} />
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
                        </section>
                    </div>

                    {/* Right Sidebar - Conditional: Map (60%) or Quick Filters (25%) */}
                    <aside className={isMapOpen ? "lg:w-[60%] hidden md:block" : "lg:w-1/4 hidden md:block"}>
                        {isMapOpen ? (
                            /* Map View - Fixed full height on right side */
                            <div className="fixed top-0 right-0 h-screen" style={{ width: '60%' }}>
                                <MultipleMarkerMap
                                    properties={propertyMarkers}
                                    defaultZoom={12}
                                    showNavigation={true}
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
        </div>
    );
};