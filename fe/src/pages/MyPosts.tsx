import React from 'react';
import { MyPropertyListItem } from '@/components/my-property-list-item';
// Cast to any due to stale TS mismatch on optional props
const MyPropertyListItemAny = MyPropertyListItem as any;
import { ControlledPagination } from '@/components/controlled-pagination';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

type StatusFilter = 'all' | 'Đang hiển thị' | 'Chờ duyệt' | 'Đã gỡ' | 'Không duyệt' | 'Hết hạn';

export const MyPosts: React.FC = () => {
    // pagination state
    const [currentPage, setCurrentPage] = React.useState(1);
    const pageSize = 3; // items per page

    // filter states
    const [searchQuery, setSearchQuery] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState<StatusFilter>('all');

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

    // Filter logic
    const filteredProperties = myProperties.filter((property) => {
        // Search filter
        const matchesSearch = searchQuery === '' ||
            property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
            property.code.toLowerCase().includes(searchQuery.toLowerCase());

        // Status filter
        const matchesStatus = statusFilter === 'all' || property.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Tab configuration
    const tabs: { label: string; value: StatusFilter; color: string }[] = [
        { label: 'Tất cả', value: 'all', color: 'text-blue-600 border-blue-600' },
        { label: 'Đang hiển thị', value: 'Đang hiển thị', color: 'text-green-600 border-green-600' },
        { label: 'Chờ duyệt', value: 'Chờ duyệt', color: 'text-yellow-600 border-yellow-600' },
        { label: 'Đã gỡ', value: 'Đã gỡ', color: 'text-gray-600 border-gray-600' },
        { label: 'Không duyệt', value: 'Không duyệt', color: 'text-red-600 border-red-600' },
        { label: 'Hết hạn', value: 'Hết hạn', color: 'text-orange-600 border-orange-600' },
    ];

    // Get count for each status
    const getStatusCount = (status: StatusFilter): number => {
        if (status === 'all') return myProperties.length;
        return myProperties.filter(p => p.status === status).length;
    };

    // Reset to page 1 when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter]);

    const totalPages = Math.ceil(filteredProperties.length / pageSize);
    const paginatedItems = filteredProperties.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-3xl font-semibold mb-2">Tin đăng của tôi</h1>
                <p className="text-gray-600">
                    Quản lý {myProperties.length} tin đăng bất động sản của bạn
                    {filteredProperties.length !== myProperties.length &&
                        ` (Hiển thị ${filteredProperties.length} kết quả)`
                    }
                </p>
            </div>

            {/* Search and Filter Section */}
            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                {/* Search Input */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                        type="text"
                        placeholder="Tìm kiếm theo tiêu đề, địa chỉ hoặc mã tin..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 focus-visible:ring-[#008DDA]"
                    />
                </div>

                {/* Status Tabs */}
                <div className="flex flex-wrap gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => setStatusFilter(tab.value)}
                            className={cn(
                                "px-4 py-2 rounded-lg border-2 transition-all duration-200 font-medium text-sm",
                                "hover:shadow-md active:scale-95 cursor-pointer",
                                statusFilter === tab.value
                                    ? `${tab.color} bg-opacity-10`
                                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                            )}
                        >
                            {tab.label}
                            <span className={cn(
                                "ml-2 px-2 py-0.5 rounded-full text-xs font-semibold",
                                statusFilter === tab.value
                                    ? "bg-white"
                                    : "bg-gray-100"
                            )}>
                                {getStatusCount(tab.value)}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Filter/Stats Bar - Keep for visual consistency */}
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
            {totalPages > 1 && (
                <div className="flex justify-center pt-2">
                    <ControlledPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}

            {/* Empty State - No properties at all */}
            {myProperties.length === 0 && (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <p className="text-gray-500 text-lg">Bạn chưa có tin đăng nào</p>
                    <p className="text-gray-400 mt-2">Hãy bắt đầu đăng tin bất động sản của bạn</p>
                </div>
            )}

            {/* Empty State - No filtered results */}
            {myProperties.length > 0 && filteredProperties.length === 0 && (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">Không tìm thấy kết quả phù hợp</p>
                    <p className="text-gray-400 mt-2">Thử tìm kiếm với từ khóa khác hoặc thay đổi bộ lọc</p>
                </div>
            )}
        </div>
    );
};
