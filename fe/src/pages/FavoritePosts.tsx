import React from 'react';
import { PropertyListItem } from '@/components/property-list-item';
import { ControlledPagination } from '@/components/controlled-pagination';

export const FavoritePosts: React.FC = () => {
    // pagination state
    const [currentPage, setCurrentPage] = React.useState(1);
    const pageSize = 5; // items per page

    // Sample data - TODO: Replace with real data from API
    const favoriteProperties = [
        {
            id: '1',
            title: 'Căn hộ cao cấp Vinhomes Central Park, 3 phòng ngủ, view sông đẹp',
            price: 5500000000,
            area: 120,
            address: 'Vinhomes Central Park, 208 Nguyễn Hữu Cảnh, Phường 22, Quận Bình Thạnh, TP.HCM',
            imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500',
            createdAt: '2024-11-10T14:30:00',
        },
        {
            id: '2',
            title: 'Nhà phố 1 trệt 2 lầu, khu dân cư an ninh',
            price: 8500000000,
            area: 80,
            address: '123 Lê Văn Việt, Phường Hiệp Phú, Quận 9, TP.HCM',
            imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500',
            createdAt: '2024-11-08T09:15:00',
        },
        {
            id: '3',
            title: 'Biệt thự Thảo Điền, sân vườn rộng rãi',
            price: 25000000000,
            area: 300,
            address: '456 Đường Thảo Điền, Phường Thảo Điền, Quận 2, TP.HCM',
            imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=500',
            createdAt: '2024-11-01T16:45:00',
        },
        {
            id: '4',
            title: 'Căn hộ mini gần chợ, tiện ích đầy đủ',
            price: 1200000000,
            area: 35,
            address: '789 Nguyễn Thị Minh Khai, Phường 5, Quận 3, TP.HCM',
            imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500',
            createdAt: '2024-10-25T11:20:00',
        },
        {
            id: '5',
            title: 'Mặt bằng kinh doanh mặt tiền đường lớn',
            price: 15000000000,
            area: 200,
            address: '321 Võ Văn Tần, Phường 5, Quận 3, TP.HCM',
            imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500',
            createdAt: '2024-09-15T08:00:00',
        },
        {
            id: '6',
            title: 'Căn hộ officetel trung tâm quận 1, nội thất cao cấp',
            price: 4200000000,
            area: 60,
            address: '15 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM',
            imageUrl: 'https://images.unsplash.com/photo-1501183638710-841dd1904471?w=500',
            createdAt: '2024-11-11T10:05:00',
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
        {
            id: '8',
            title: 'Chung cư The Sun Avenue, 2PN, đầy đủ nội thất',
            price: 3800000000,
            area: 75,
            address: 'The Sun Avenue, 28 Mai Chí Thọ, Phường An Phú, Quận 2, TP.HCM',
            imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500',
            createdAt: '2024-11-05T16:40:00',
        },
    ];

    const handleFavoriteClick = (id: string) => {
        console.log('Toggle favorite for property:', id);
        // TODO: Implement API call to toggle favorite status
    };

    const totalPages = Math.ceil(favoriteProperties.length / pageSize);
    const paginatedItems = favoriteProperties.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-semibold">Tin yêu thích</h1>
                </div>
                <p className="text-gray-600">
                    Bạn đang theo dõi {favoriteProperties.length} bất động sản
                </p>
            </div>

            {/* Property List */}
            <div className="space-y-3">
                {paginatedItems.map((property) => (
                    <PropertyListItem
                        key={property.id}
                        id={property.id}
                        title={property.title}
                        price={property.price}
                        area={property.area}
                        address={property.address}
                        imageUrl={property.imageUrl}
                        createdAt={property.createdAt}
                        isFavorited={true}
                        onFavoriteClick={handleFavoriteClick}
                    />
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center pt-2">
                    <ControlledPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}

            {/* Empty State */}
            {favoriteProperties.length === 0 && (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <p className="text-gray-500 text-lg">Bạn chưa có tin yêu thích nào</p>
                    <p className="text-gray-400 mt-2">Hãy bắt đầu lưu các bất động sản bạn quan tâm</p>
                </div>
            )}
        </div>
    );
};

