import React, {useState} from 'react';
import {useParams} from 'react-router-dom';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi
} from '@/components/ui/carousel';
import {Button} from '@/components/ui/button';
import {Heart, MapPin, Phone, User} from 'lucide-react';
import {cn} from '@/lib/utils';
import {formatPrice, formatArea} from '@/utils/generalFormat';
import {PropertyTypeFilter} from "@/components/property-type-filter.tsx";
import {PropertyDistrictFilter} from "@/components/property-district-filter.tsx";
import {formatDate} from "@/utils/generalFormat.ts";
import {PropertyCardItem} from '@/components/property-card-item';

export const PropertyDetail: React.FC = () => {
    const {id} = useParams();
    const [isFavorited, setIsFavorited] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(1);
    const [carouselApi, setCarouselApi] = useState<CarouselApi>();

    // Sample data - TODO: Replace with real API call
    const property = {
        id: id || '1',
        code: 'TN0001',
        title: 'Căn hộ cao cấp Vinhomes Central Park, 3 phòng ngủ, view sông đẹp',
        price: 5500000000,
        area: 120,
        address: 'Vinhomes Central Park, 208 Nguyễn Hữu Cảnh, Phường 22, Quận Bình Thạnh, TP.HCM',
        description: 'Căn hộ nằm tại tầng cao, view thoáng mát hướng sông Sài Gòn. Thiết kế hiện đại với nội thất đầy đủ bao gồm: phòng khách rộng rãi, bếp âm tủ, 3 phòng ngủ master có giường tủ, điều hòa. Khu vực an ninh 24/7, có hồ bơi, phòng gym, khu vui chơi trẻ em, siêu thị, trường h��c quốc tế. Giao thông thuận tiện, gần cầu Sài Gòn, dễ dàng di chuyển đến Quận 1, Quận 2.',
        createdAt: '2024-11-10T14:30:00',
        expirationDate: '2024-12-10T23:59:00',
        images: [
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
            'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
            'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
            'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800',
            'https://images.unsplash.com/photo-1512916194211-3f2b7f5f7de3?w=800',
        ],
        propertyType: 'Căn hộ',
        legalDoc: 'Sổ đỏ/Sổ hồng',
        furniture: 'Đầy đủ',
        bedrooms: 3,
        bathrooms: 2,
        floors: 1,
        houseDirection: 'Hướng Đông',
        balconyDirection: 'Hướng Nam',
        roadWidth: 8,
        frontWidth: 6,
        owner: {
            name: 'Nguyễn Văn A',
            avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=008DDA&color=fff',
            phone: '0123456789',
        },
    };

    // Suggested properties data
    const suggestedProperties = [
        {
            id: '2',
            title: 'Căn hộ 2 phòng ngủ The Sun Avenue, nội thất đầy đủ',
            price: 3800000000,
            area: 75,
            address: 'The Sun Avenue, 28 Mai Chí Thọ, Phường An Phú, Quận 2, TP.HCM',
            imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500',
            createdAt: '2024-11-05T16:40:00',
        },
        {
            id: '3',
            title: 'Nhà phố 1 trệt 2 lầu, khu dân cư an ninh',
            price: 8500000000,
            area: 80,
            address: '123 Lê Văn Việt, Phường Hiệp Phú, Quận 9, TP.HCM',
            imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500',
            createdAt: '2024-11-08T09:15:00',
        },
        {
            id: '4',
            title: 'Biệt thự Thảo Điền, sân vườn rộng rãi',
            price: 25000000000,
            area: 300,
            address: '456 Đường Thảo Điền, Phường Thảo Điền, Quận 2, TP.HCM',
            imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=500',
            createdAt: '2024-11-01T16:45:00',
        },
        {
            id: '5',
            title: 'Căn hộ mini gần chợ, tiện ích đầy đủ',
            price: 1200000000,
            area: 35,
            address: '789 Nguyễn Thị Minh Khai, Phường 5, Quận 3, TP.HCM',
            imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500',
            createdAt: '2024-10-25T11:20:00',
        },
        {
            id: '6',
            title: 'Mặt bằng kinh doanh mặt tiền đường lớn',
            price: 15000000000,
            area: 200,
            address: '321 Võ Văn Tần, Phường 5, Quận 3, TP.HCM',
            imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500',
            createdAt: '2024-09-15T08:00:00',
        },
        {
            id: '7',
            title: 'Nhà mặt tiền Quận 7, vị trí đẹp',
            price: 12000000000,
            area: 150,
            address: '789 Nguyễn Văn Linh, Phường Tân Phú, Quận 7, TP.HCM',
            imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500',
            createdAt: '2024-10-20T13:25:00',
        },
    ];

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

    const handleCopyPhone = () => {
        navigator.clipboard.writeText(property.owner.phone);
        alert('Đã copy số điện thoại!');
    };

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
                                        {property.images.map((image, index) => (
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
                                                        {currentSlide}/{property.images.length}
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
                                <p className="text-base">{property.address}</p>
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
                                <button
                                    onClick={() => setIsFavorited(!isFavorited)}
                                    className={cn(
                                        'cursor-pointer p-3 rounded-full transition-all duration-200 bg-white',
                                        isFavorited
                                            ? 'text-red-500'
                                            : 'text-gray-400 hover:text-red-500'
                                    )}
                                >
                                    <Heart
                                        className={cn('w-6 h-6', isFavorited && 'fill-current')}
                                    />
                                </button>
                            </div>

                            {/* Property Code, Created Date, Expiration Date */}
                            <div className="flex flex-wrap items-center gap-6 pt-4 border-t mt-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Mã tin</p>
                                    <p className="text-sm font-semibold text-gray-900 font-mono">
                                        {property.code}
                                    </p>
                                </div>
                                <div className="h-8 w-px bg-gray-200"></div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Ngày đăng</p>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {formatDate(property.createdAt)}
                                    </p>
                                </div>
                                <div className="h-8 w-px bg-gray-200"></div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Ngày hết hạn</p>
                                    <p className="text-sm font-semibold text-gray-900">
                                    </p>
                                    {formatDate(property.expirationDate)}
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
                                {/* Property Type */}
                                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                    <span className="text-gray-600">Loại bất động sản</span>
                                    <span className="font-semibold text-gray-900">
                                        {property.propertyType}
                                    </span>
                                </div>

                                {/* Legal Doc */}
                                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                    <span className="text-gray-600">Giấy tờ pháp lý</span>
                                    <span className="font-semibold text-gray-900">
                                        {property.legalDoc}
                                    </span>
                                </div>

                                {/* Furniture */}
                                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                    <span className="text-gray-600">Nội thất</span>
                                    <span className="font-semibold text-gray-900">
                                        {property.furniture}
                                    </span>
                                </div>

                                {/* Bedrooms */}
                                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                    <span className="text-gray-600">Số phòng ngủ</span>
                                    <span className="font-semibold text-gray-900">
                                        {property.bedrooms} phòng
                                    </span>
                                </div>

                                {/* Bathrooms */}
                                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                    <span className="text-gray-600">Số phòng tắm</span>
                                    <span className="font-semibold text-gray-900">
                                        {property.bathrooms} phòng
                                    </span>
                                </div>

                                {/* Floors */}
                                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                    <span className="text-gray-600">Số tầng</span>
                                    <span className="font-semibold text-gray-900">
                                        {property.floors} tầng
                                    </span>
                                </div>

                                {/* House Direction */}
                                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                    <span className="text-gray-600">Hướng nhà</span>
                                    <span className="font-semibold text-gray-900">
                                        {property.houseDirection}
                                    </span>
                                </div>

                                {/* Balcony Direction */}
                                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                    <span className="text-gray-600">Hướng ban công</span>
                                    <span className="font-semibold text-gray-900">
                                        {property.balconyDirection}
                                    </span>
                                </div>

                                {/* Road Width */}
                                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                    <span className="text-gray-600">Đường vào</span>
                                    <span className="font-semibold text-gray-900">
                                        {property.roadWidth} m
                                    </span>
                                </div>

                                {/* Front Width */}
                                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                    <span className="text-gray-600">Mặt tiền</span>
                                    <span className="font-semibold text-gray-900">
                                        {property.frontWidth} m
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Map Section */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Vị trí trên bản đồ
                            </h2>
                            <div
                                className="w-full h-96 rounded-lg bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center relative overflow-hidden border border-gray-200">
                                {/* Placeholder gradient background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-gray-100"></div>

                                <div className="relative z-10 flex flex-col items-center gap-4">
                                    <div
                                        className="w-20 h-20 rounded-full bg-blue-200 flex items-center justify-center">
                                        <MapPin className="w-10 h-10 text-blue-600"/>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-gray-700 font-medium text-lg">
                                            Google Maps sẽ được tích hợp tại đây
                                        </p>
                                        <p className="text-sm text-gray-500 mt-2">
                                            {property.address}
                                        </p>
                                    </div>
                                </div>

                                {/* Decorative grid pattern */}
                                <div className="absolute inset-0 opacity-5">
                                    <div className="w-full h-full" style={{
                                        backgroundImage: `
                                            linear-gradient(to right, #008DDA 1px, transparent 1px),
                                            linear-gradient(to bottom, #008DDA 1px, transparent 1px)
                                        `,
                                        backgroundSize: '40px 40px'
                                    }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Suggested Properties Section */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                Bất động sản gợi ý
                            </h2>

                            {/* Desktop Grid View - hidden on mobile */}
                            <div className="hidden sm:block">
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                    {suggestedProperties.map((item) => (
                                        <PropertyCardItem
                                            key={item.id}
                                            {...item}
                                        />
                                    ))}
                                </div>
                                <div className="flex justify-center">
                                    <Button
                                        className="cursor-pointer px-8 py-6 bg-[#008DDA] hover:bg-[#0064A6] text-white font-semibold transition-colors duration-200"
                                    >
                                        Xem thêm
                                    </Button>
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
                                                <PropertyCardItem {...item} />
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious className="left-2 cursor-pointer hidden md:block"/>
                                    <CarouselNext className="right-2 cursor-pointer hidden md:block"/>
                                </Carousel>
                                <div className="flex justify-center mt-6">
                                    <Button
                                        className="cursor-pointer px-8 py-6 bg-[#008DDA] hover:bg-[#0064A6] text-white font-semibold transition-colors duration-200"
                                    >
                                        Xem thêm
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Card - 25% */}
                    <aside className="lg:w-1/4 space-y-4">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Thông tin liên hệ
                            </h3>

                            {/* Owner Info */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                    {property.owner.avatar ? (
                                        <img
                                            src={property.owner.avatar}
                                            alt={property.owner.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div
                                            className="w-full h-full flex items-center justify-center bg-[#008DDA]">
                                            <User className="w-8 h-8 text-white"/>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900 truncate">
                                        {property.owner.name}
                                    </p>
                                    <p className="text-sm text-gray-500">Người đăng tin</p>
                                </div>
                            </div>

                            {/* Phone Button */}
                            <Button
                                onClick={handleCopyPhone}
                                className="w-full bg-[#008DDA] hover:bg-[#0064A6] text-white font-semibold py-6 transition-colors duration-200 cursor-pointer"
                            >
                                <Phone className="w-5 h-5 mr-2"/>
                                {property.owner.phone}
                            </Button>

                            <p className="text-xs text-gray-500 text-center mt-3">
                                Click để copy số điện thoại
                            </p>
                        </div>

                        <div className="hidden sm:block space-y-4">
                            <PropertyTypeFilter/>
                            <PropertyDistrictFilter/>
                        </div>

                    </aside>
                </div>
            </div>
        </div>
    );
};
