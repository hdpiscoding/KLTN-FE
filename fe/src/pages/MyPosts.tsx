import React from 'react';
import { MyPropertyListItem } from '@/components/my-property-list-item';
// Cast to any due to stale TS mismatch on optional props
const MyPropertyListItemAny = MyPropertyListItem as any;
import { ControlledPagination } from '@/components/controlled-pagination';

export const MyPosts: React.FC = () => {
    // pagination state
    const [currentPage, setCurrentPage] = React.useState(1);
    const pageSize = 3; // items per page

    type MyProperty = {
        id: string;
        title: string;
        price: number;
        area: number;
        address: string;
        imageUrl: string;
        createdAt: string;
        status: 'Đang hiển thị' | 'Chờ duyệt' | 'Đã gỡ' | 'Không duyệt' | 'Hết hạn';
        code: string;
        expirationDate: string;
    };

    // Sample data - TODO: Replace with real data from API
    const myProperties: MyProperty[] = [
        {
            id: '1',
            title: 'Căn hộ cao cấp Vinhomes Central Park, 3 phòng ngủ, view sông đẹp',
            price: 5500000000,
            area: 120,
            address: 'Vinhomes Central Park, 208 Nguyễn Hữu Cảnh, Phường 22, Quận Bình Thạnh, TP.HCM',
            imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500',
            createdAt: '2024-11-10T14:30:00',
            status: 'Đang hiển thị' as const,
            code: 'TN0001',
            expirationDate: '2024-12-10T23:59:00'
        },
        {
            id: '2',
            title: 'Nhà phố 1 trệt 2 lầu, khu dân cư an ninh',
            price: 8500000000,
            area: 80,
            address: '123 Lê Văn Việt, Phường Hiệp Phú, Quận 9, TP.HCM',
            imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500',
            createdAt: '2024-11-08T09:15:00',
            status: 'Chờ duyệt' as const,
            code: 'TN0002',
            expirationDate: '2024-12-08T23:59:00'
        },
        {
            id: '3',
            title: 'Biệt thự Thảo Điền, sân vườn rộng rãi',
            price: 25000000000,
            area: 300,
            address: '456 Đường Thảo Điền, Phường Thảo Điền, Quận 2, TP.HCM',
            imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=500',
            createdAt: '2024-11-01T16:45:00',
            status: 'Đã gỡ' as const,
            code: 'TN0003',
            expirationDate: '2024-12-01T23:59:00'
        },
        {
            id: '4',
            title: 'Căn hộ mini gần chợ, tiện ích đầy đủ',
            price: 1200000000,
            area: 35,
            address: '789 Nguyễn Thị Minh Khai, Phường 5, Quận 3, TP.HCM',
            imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500',
            createdAt: '2024-10-25T11:20:00',
            status: 'Không duyệt' as const,
            code: 'TN0004',
            expirationDate: '2024-11-25T23:59:00'
        },
        {
            id: '5',
            title: 'Mặt bằng kinh doanh mặt tiền đường lớn',
            price: 15000000000,
            area: 200,
            address: '321 Võ Văn Tần, Phường 5, Quận 3, TP.HCM',
            imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500',
            createdAt: '2024-09-15T08:00:00',
            status: 'Hết hạn' as const,
            code: 'TN0005',
            expirationDate: '2024-10-15T23:59:00'
        },
        {
            id: '6',
            title: 'Căn hộ officetel trung tâm quận 1, nội thất cao cấp',
            price: 4200000000,
            area: 60,
            address: '15 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM',
            imageUrl: 'https://images.unsplash.com/photo-1501183638710-841dd1904471?w=500',
            createdAt: '2024-11-11T10:05:00',
            status: 'Đang hiển thị' as const,
            code: 'TN0006',
            expirationDate: '2024-12-11T23:59:00'
        }
    ];

    const totalPages = Math.ceil(myProperties.length / pageSize);
    const paginatedItems = myProperties.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-3xl font-semibold mb-2">Tin đăng của tôi</h1>
                <p className="text-gray-600">
                    Quản lý {myProperties.length} tin đăng bất động sản của bạn
                </p>
            </div>

            {/* Filter/Stats Bar */}
            <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex flex-wrap gap-3 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-green-500"></span>
                        <span className="text-gray-600">
                            Đang hiển thị: {myProperties.filter(p => p.status === 'Đang hiển thị').length}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                        <span className="text-gray-600">
                            Chờ duyệt: {myProperties.filter(p => p.status === 'Chờ duyệt').length}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-gray-500"></span>
                        <span className="text-gray-600">
                            Đã gỡ: {myProperties.filter(p => p.status === 'Đã gỡ').length}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-500"></span>
                        <span className="text-gray-600">
                            Không duyệt: {myProperties.filter(p => p.status === 'Không duyệt').length}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                        <span className="text-gray-600">
                            Hết hạn: {myProperties.filter(p => p.status === 'Hết hạn').length}
                        </span>
                    </div>
                </div>
            </div>

            {/* Property List */}
            <div className="space-y-3">
                {paginatedItems.map((property) => (
                    <MyPropertyListItemAny
                        key={property.id}
                        id={property.id}
                        title={property.title}
                        price={property.price}
                        area={property.area}
                        address={property.address}
                        imageUrl={property.imageUrl}
                        createdAt={property.createdAt}
                        status={property.status}
                        code={property.code}
                        expirationDate={property.expirationDate}
                    />
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center pt-2">
                <ControlledPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>

            {/* Empty State */}
            {myProperties.length === 0 && (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <p className="text-gray-500 text-lg">Bạn chưa có tin đăng nào</p>
                    <p className="text-gray-400 mt-2">Hãy bắt đầu đăng tin bất động sản của bạn</p>
                </div>
            )}
        </div>
    );
};
