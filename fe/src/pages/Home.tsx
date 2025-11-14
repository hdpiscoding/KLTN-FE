import React, { useState } from 'react';
import { PropertyCardItem } from "@/components/property-card-item.tsx";
import { DistrictCardItem } from "@/components/district-card-item.tsx";
import homeBackground from "@/assets/timnha-home-background.png";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import {useNavigate} from "react-router-dom";

export const Home: React.FC = () => {
    const [searchType, setSearchType] = useState<'buy' | 'rent'>('buy');
    const [searchValue, setSearchValue] = useState('');
    const navigate = useNavigate();

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
        },
        {
            id: "2",
            title: "Nhà phố liền kề khu compound an ninh 24/7",
            price: 4200000000,
            area: 120,
            address: "Palm City, Quận 9, TP.HCM",
            imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
            createdAt: "2025-11-06T15:30:00.000Z",
        },
        {
            id: "3",
            title: "Căn hộ 2 phòng ngủ full nội thất cao cấp",
            price: 1800000000,
            area: 65,
            address: "Masteri Thảo Điền, Quận 2, TP.HCM",
            imageUrl: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?q=80&w=2084&auto=format&fit=crop",
            createdAt: "2025-11-07T08:15:00.000Z",
        },
        {
            id: "4",
            title: "Biệt thự sân vườn phong cách hiện đại",
            price: 8500000000,
            area: 300,
            address: "Thảo Điền, Quận 2, TP.HCM",
            imageUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop",
            createdAt: "2025-11-07T10:45:00.000Z",
        },
        {
            id: "5",
            title: "Căn hộ Duplex view công viên",
            price: 3200000000,
            area: 110,
            address: "Lumière Riverside, Quận 2, TP.HCM",
            imageUrl: "https://images.unsplash.com/photo-1512916194211-3f2b7f5f7de3?q=80&w=2070&auto=format&fit=crop",
            createdAt: "2025-11-06T11:20:00.000Z",
        },
        {
            id: "6",
            title: "Nhà phố thương mại mặt tiền đường lớn",
            price: 12000000000,
            area: 160,
            address: "Phú Mỹ Hưng, Quận 7, TP.HCM",
            imageUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=2074&auto=format&fit=crop",
            createdAt: "2025-11-05T14:10:00.000Z",
        },
        {
            id: "7",
            title: "Căn hộ Duplex view công viên",
            price: 3200000000,
            area: 110,
            address: "Lumière Riverside, Quận 2, TP.HCM",
            imageUrl: "https://images.unsplash.com/photo-1512916194211-3f2b7f5f7de3?q=80&w=2070&auto=format&fit=crop",
            createdAt: "2025-11-06T11:20:00.000Z",
        },
        {
            id: "8",
            title: "Nhà phố thương mại mặt tiền đường lớn",
            price: 12000000000,
            area: 160,
            address: "Phú Mỹ Hưng, Quận 7, TP.HCM",
            imageUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=2074&auto=format&fit=crop",
            createdAt: "2025-11-05T14:10:00.000Z",
        },
    ];

    // Sample data for districts
    const sampleDistricts = [
        {
            id: "1",
            name: "Quận 1",
            postCount: 1234,
            imageUrl: "https://owa.bestprice.vn/images/destinations/uploads/quan-1-6094b9a6a8de1.jpg",
        },
        {
            id: "2",
            name: "Quận 2",
            postCount: 856,
            imageUrl: "https://blog.rever.vn/hubfs/Blog%20images/PhuLH/quan-2-1.jpg",
        },
        {
            id: "3",
            name: "Quận 7",
            postCount: 2451,
            imageUrl: "https://iwater.vn/Image/Picture/New/333/quan_7.jpg",
        },
        {
            id: "4",
            name: "Quận Bình Thạnh",
            postCount: 1876,
            imageUrl: "https://nhadathoangviet.com/wp-content/uploads/2024/04/Anh-man-hinh-2024-04-17-luc-10.29.19.png",
        },
        {
            id: "5",
            name: "Quận 11",
            postCount: 943,
            imageUrl: "https://maisonoffice.vn/wp-content/uploads/2024/04/1-gioi-thieu-tong-quan-ve-quan-11-tphcm.jpg",
        },
    ];

    // Sample data for sale properties
    const saleProperties = [
        {
            id: "7",
            title: "Penthouse Duplex view toàn cảnh thành phố",
            price: 15000000000,
            area: 250,
            address: "Empire City, Mai Chí Thọ, Quận 2, TP.HCM",
            imageUrl: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=2070&auto=format&fit=crop",
            createdAt: "2025-11-08T09:00:00.000Z",
        },
        {
            id: "8",
            title: "Căn hộ 3 phòng ngủ view sông",
            price: 5500000000,
            area: 110,
            address: "Saigon Pearl, Quận Bình Thạnh, TP.HCM",
            imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop",
            createdAt: "2025-11-08T10:30:00.000Z",
        },
        {
            id: "9",
            title: "Biệt thự đơn lập khu compound",
            price: 28000000000,
            area: 400,
            address: "Riviera Cove, Quận 9, TP.HCM",
            imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop",
            createdAt: "2025-11-08T11:15:00.000Z",
        },
        {
            id: "10",
            title: "Căn hộ Officetel trung tâm quận 1",
            price: 3200000000,
            area: 45,
            address: "Vinhomes Golden River, Quận 1, TP.HCM",
            imageUrl: "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?q=80&w=2070&auto=format&fit=crop",
            createdAt: "2025-11-08T12:00:00.000Z",
        },
        {
            id: "11",
            title: "Nhà phố 4 tầng mặt tiền",
            price: 18500000000,
            area: 200,
            address: "Đường Nguyễn Văn Trỗi, Phú Nhuận, TP.HCM",
            imageUrl: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?q=80&w=2070&auto=format&fit=crop",
            createdAt: "2025-11-08T13:30:00.000Z",
        },
    ];

    // Sample data for rent properties
    const rentProperties = [
        {
            id: "12",
            title: "Căn hộ cao cấp 2PN full nội thất Vinhomes Central Park",
            price: 15000000,
            area: 70,
            address: "Vinhomes Central Park, Bình Thạnh, TP.HCM",
            imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
            createdAt: "2025-11-08T09:00:00.000Z",
        },
        {
            id: "13",
            title: "Studio Landmark 81 view sông và thành phố",
            price: 12000000,
            area: 45,
            address: "Landmark 81, Bình Thạnh, TP.HCM",
            imageUrl: "https://images.unsplash.com/photo-1502672023488-70e25813eb80?q=80&w=2069&auto=format&fit=crop",
            createdAt: "2025-11-08T10:30:00.000Z",
        },
        {
            id: "14",
            title: "Nhà phố nguyên căn khu compound",
            price: 35000000,
            area: 200,
            address: "Park Riverside, Quận 9, TP.HCM",
            imageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2070&auto=format&fit=crop",
            createdAt: "2025-11-08T11:15:00.000Z",
        },
        {
            id: "15",
            title: "Căn hộ duplex 3PN Feliz En Vista",
            price: 25000000,
            area: 120,
            address: "Feliz En Vista, Quận 2, TP.HCM",
            imageUrl: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=2070&auto=format&fit=crop",
            createdAt: "2025-11-08T12:00:00.000Z",
        },
        {
            id: "16",
            title: "Căn hộ 2PN The Estella An Phú",
            price: 18000000,
            area: 98,
            address: "The Estella, An Phú, Quận 2, TP.HCM",
            imageUrl: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=2070&auto=format&fit=crop",
            createdAt: "2025-11-08T13:30:00.000Z",
        },
    ];

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            // TODO: Implement search logic here
            console.log('Searching for:', searchValue, 'Type:', searchType);
        }
    };

    return (
        <div>
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
                                onClick={() => setSearchType('buy')}
                                className={cn(
                                    "px-6 py-2.5 rounded-md transition-colors cursor-pointer text-base sm:text-lg",
                                    searchType === 'buy'
                                        ? "bg-[#008DDA] text-white"
                                        : "hover:bg-gray-700 text-gray-300"
                                )}
                            >
                                Mua nhà
                            </button>
                            <button
                                onClick={() => setSearchType('rent')}
                                className={cn(
                                    "px-6 py-2.5 rounded-md transition-colors cursor-pointer text-base sm:text-lg",
                                    searchType === 'rent'
                                        ? "bg-[#008DDA] text-white"
                                        : "hover:bg-gray-700 text-gray-300"
                                )}
                            >
                                Thuê nhà
                            </button>
                        </div>

                        {/* Search Box */}
                        <div className="w-full">
                            <div className="relative">
                                <Input
                                    type="text"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    onKeyDown={handleSearch}
                                    placeholder={`Tìm kiếm ${searchType === 'buy' ? 'nhà để mua' : 'nhà để thuê'}...`}
                                    className="pl-12 h-[52px] bg-white text-gray-600 text-base sm:text-lg w-full focus-visible:ring-[#008DDA] focus-visible:ring-2 focus-visible:ring-offset-0"
                                />
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Properties Section */}
            <section className="py-12 px-4 max-w-7xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
                    Bất động sản dành cho bạn
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {sampleProperties.map((property) => (
                        <PropertyCardItem
                            key={property.id}
                            {...property}
                            onFavoriteClick={(id) => console.log('Favorite clicked:', id)}
                        />
                    ))}
                </div>

                <div className="text-center">
                    <button
                        onClick={() => console.log('Load more')}
                        className="px-6 py-3 bg-white text-[#008DDA] border-2 border-[#008DDA] rounded-lg font-medium hover:bg-[#008DDA] hover:text-white transition-colors duration-200 cursor-pointer"
                    >
                        Xem thêm
                    </button>
                </div>
            </section>

            {/* Districts Section */}
            <section className="py-12 px-4 max-w-7xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
                    Bất động sản theo địa điểm
                </h2>

                <div className="grid grid-cols-12 gap-4 mb-8">
                    {/* Large district card */}
                    <div className="col-span-12 md:col-span-8 lg:col-span-6">
                        <DistrictCardItem {...sampleDistricts[0]} />
                    </div>

                    {/* Medium district cards */}
                    <div className="col-span-12 md:col-span-4 lg:col-span-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <DistrictCardItem {...sampleDistricts[1]} />
                            <DistrictCardItem {...sampleDistricts[2]} />
                        </div>
                    </div>

                    {/* Small district cards */}
                    <div className="col-span-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <DistrictCardItem {...sampleDistricts[3]} />
                        <DistrictCardItem {...sampleDistricts[4]} />
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

                <div className="text-center mt-8">
                    <button
                        onClick={() => console.log('View all sale properties')}
                        className="px-6 py-3 bg-white text-[#008DDA] border-2 border-[#008DDA] rounded-lg font-medium hover:bg-[#008DDA] hover:text-white transition-colors duration-200 cursor-pointer"
                    >
                        Xem tất cả
                    </button>
                </div>
            </section>

            {/* Rent Properties Section */}
            <section className="py-12 px-4 max-w-7xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
                    Bất động sản cho thuê
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
                            {rentProperties.map((property) => (
                                <CarouselItem key={property.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                                    <div className="relative h-[420px] bg-white rounded-lg shadow-sm">
                                        <div className="absolute inset-0">
                                            <PropertyCardItem {...property} />
                                        </div>
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
                        onClick={() => console.log('View all rent properties')}
                        className="px-6 py-3 bg-white text-[#008DDA] border-2 border-[#008DDA] rounded-lg font-medium hover:bg-[#008DDA] hover:text-white transition-colors duration-200 cursor-pointer"
                    >
                        Xem tất cả
                    </button>
                </div>
            </section>
        </div>
    );
}