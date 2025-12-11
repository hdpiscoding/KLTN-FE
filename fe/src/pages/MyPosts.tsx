import React from 'react';
import { MyPropertyListItem } from '@/components/my-property-list-item';
// Cast to any due to stale TS mismatch on optional props
const MyPropertyListItemAny = MyPropertyListItem as any;
import { ControlledPagination } from '@/components/controlled-pagination';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import {useUserStore} from "@/store/userStore.ts";
import {searchProperties, deletePropertyListing} from "@/services/propertyServices.ts";
import type {PropertyListing} from "@/types/property-listing";
import { Skeleton } from '@/components/ui/skeleton';
import { useSearchFilters } from '@/hooks/use-search-filters';
import {NoneSellerView} from "@/components/none-seller-view.tsx";
import {PendingSellerView} from "@/components/pending-seller-view.tsx";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {toast} from "react-toastify";

type StatusFilter = 'all' | 'Đang hiển thị' | 'Chờ duyệt' | 'Không duyệt';

export const MyPosts: React.FC = () => {
    // pagination state
    const [currentPage, setCurrentPage] = React.useState(1);
    const [totalPages, setTotalPages] = React.useState(1);
    const pageSize = 8; // items per page (match API rpp)

    // filter states
    const [searchQuery, setSearchQuery] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState<StatusFilter>('all');

    // delete dialog states
    const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
    const [propertyToDelete, setPropertyToDelete] = React.useState<string | null>(null);
    const [isDeleting, setIsDeleting] = React.useState(false);

    const userId = useUserStore((state) => state.userId);
    const [myProperties, setMyProperties] = React.useState<PropertyListing[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const { filters, setFilter } = useSearchFilters();
    const becomeSellerApproveStatus = useUserStore((state) => state.becomeSellerApproveStatus);

    type MyProperty = {
        id: string;
        title: string;
        price: number;
        area: number;
        address: string;
        imageUrl: string;
        createdAt: string;
        status: 'Đang hiển thị' | 'Chờ duyệt' | 'Không duyệt';
        code: string;
    };

    const getMyProperties = React.useCallback(async () => {
        if (!userId) return;

        try {
            setIsLoading(true);

            // Build filters array
            const apiFilters = [
                {
                    key: "userId",
                    operator: "equal",
                    value: String(userId)
                }
            ];

            // Add approvalStatus filter if exists in URL
            const approvalStatusFilter = filters.find(f => f.key === 'approvalStatus' && f.operator === 'eq');
            if (approvalStatusFilter) {
                apiFilters.push({
                    key: "approvalStatus",
                    operator: "equal",
                    value: approvalStatusFilter.value
                });
            }

            // Add title filter if exists in URL
            const titleFilter = filters.find(f => f.key === 'title' && f.operator === 'lk');
            if (titleFilter) {
                apiFilters.push({
                    key: "title",
                    operator: "like",
                    value: titleFilter.value
                });
            }

            const response = await searchProperties({
                filters: apiFilters,
                sorts: [
                    {
                        key: "createdAt",
                        type: "DESC"
                    }
                ],
                rpp: pageSize,
                page: currentPage
            });

            setMyProperties(response.data.items);
            setTotalPages(response.data.pages || 1);
        } catch (error) {
            console.error('Error fetching my properties:', error);
        } finally {
            setIsLoading(false);
        }
    }, [userId, filters, currentPage, pageSize]);

    // Fetch properties when component mounts or userId changes
    React.useEffect(() => {
        getMyProperties();
    }, [getMyProperties]);

    // Sync statusFilter with URL
    React.useEffect(() => {
        const approvalStatusFilter = filters.find(f => f.key === 'approvalStatus' && f.operator === 'eq');
        if (approvalStatusFilter) {
            // Map API status to display status
            const statusMap: Record<string, StatusFilter> = {
                'APPROVED': 'Đang hiển thị',
                'PENDING': 'Chờ duyệt',
                'REJECTED': 'Không duyệt'
            };
            const mappedStatus = statusMap[approvalStatusFilter.value] || 'all';
            setStatusFilter(mappedStatus);
        } else {
            setStatusFilter('all');
        }
    }, [filters]);

    // Handle status filter change
    const handleStatusFilterChange = (status: StatusFilter) => {
        if (status === 'all') {
            setFilter('approvalStatus', 'eq', '');
        } else {
            // Map display status to API status
            const reverseStatusMap: Record<StatusFilter, string> = {
                'all': '',
                'Đang hiển thị': 'APPROVED',
                'Chờ duyệt': 'PENDING',
                'Không duyệt': 'REJECTED'
            };
            const apiStatus = reverseStatusMap[status];
            if (apiStatus) {
                setFilter('approvalStatus', 'eq', apiStatus);
            }
        }
    };

    // Sync searchQuery with URL
    React.useEffect(() => {
        const titleFilter = filters.find(f => f.key === 'title' && f.operator === 'lk');
        if (titleFilter) {
            setSearchQuery(titleFilter.value);
        } else {
            setSearchQuery('');
        }
    }, [filters]);

    // Handle search on Enter key
    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const trimmedValue = searchQuery.trim();
            if (trimmedValue) {
                setFilter('title', 'lk', trimmedValue);
            } else {
                setFilter('title', 'lk', '');
            }
        }
    };

    // Helper function to map approval status
    const mapApprovalStatus = (status: string): 'Đang hiển thị' | 'Chờ duyệt' | 'Không duyệt' => {
        switch (status) {
            case 'APPROVED':
                return 'Đang hiển thị';
            case 'PENDING':
                return 'Chờ duyệt';
            case 'REJECTED':
                return 'Không duyệt';
            default:
                return 'Chờ duyệt';
        }
    };

    // Map API data to MyProperty format
    const mappedProperties: MyProperty[] = myProperties.map((property) => ({
        id: String(property.id),
        title: property.title,
        price: property.price,
        area: property.area,
        address: `${property.addressStreet}, ${property.addressWard}, ${property.addressDistrict}, ${property.addressCity}`,
        imageUrl: property.imageUrls?.[0] || '',
        createdAt: property.createdAt || '',
        status: mapApprovalStatus(property.approvalStatus || ""),
        code: `TN${String(property.id).padStart(4, '0')}`,
    }));

    // No client-side filtering - API handles all filters (status and title)
    const filteredProperties = mappedProperties;

    // Tab configuration
    const tabs: { label: string; value: StatusFilter; color: string }[] = [
        { label: 'Tất cả', value: 'all', color: 'text-blue-600 border-blue-600' },
        { label: 'Đang hiển thị', value: 'Đang hiển thị', color: 'text-green-600 border-green-600' },
        { label: 'Chờ duyệt', value: 'Chờ duyệt', color: 'text-yellow-600 border-yellow-600' },
        { label: 'Không duyệt', value: 'Không duyệt', color: 'text-red-600 border-red-600' },
    ];

    // Reset to page 1 when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [filters]);

    // No client-side pagination - API handles pagination
    const paginatedItems = filteredProperties;

    // Handle delete click - show confirmation dialog
    const handleDelete = (id: string) => {
        setPropertyToDelete(id);
        setShowDeleteDialog(true);
    };

    // Handle confirm delete - call API
    const handleConfirmDelete = async () => {
        if (!propertyToDelete) return;

        try {
            setIsDeleting(true);
            await deletePropertyListing(Number(propertyToDelete));
            toast.success('Xóa tin đăng thành công!');

            // Refresh the property list
            await getMyProperties();

            // Close dialog
            setShowDeleteDialog(false);
            setPropertyToDelete(null);
        } catch (error) {
            console.error('Error deleting property:', error);
            toast.error('Có lỗi xảy ra khi xóa tin đăng. Vui lòng thử lại!');
        } finally {
            setIsDeleting(false);
        }
    };

    // Handle cancel delete
    const handleCancelDelete = () => {
        setShowDeleteDialog(false);
        setPropertyToDelete(null);
    };

    return (
        <>
            {['NONE', 'REJECTED'].includes(String(becomeSellerApproveStatus)) &&
                <NoneSellerView/>
            }

            {becomeSellerApproveStatus === 'PENDING' && <PendingSellerView/>}

            {becomeSellerApproveStatus === 'APPROVED'
                &&
                <div className="space-y-4">
                    {/* Header */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h1 className="text-3xl font-semibold mb-2">Tin đăng của tôi</h1>
                        <p className="text-gray-600">
                            {isLoading ? 'Đang tải...' : (
                                <>
                                    Quản lý {mappedProperties.length} tin đăng bất động sản của bạn
                                    {filteredProperties.length !== mappedProperties.length &&
                                        ` (Hiển thị ${filteredProperties.length} kết quả)`
                                    }
                                </>
                            )}
                        </p>
                    </div>

                    {/* Search and Filter Section */}
                    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                        {/* Search Input */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                type="text"
                                placeholder="Tìm kiếm theo tiêu đề tin..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearchKeyDown}
                                className="pl-10 focus-visible:ring-[#008DDA]"
                            />
                        </div>

                        {/* Status Tabs */}
                        <div className="flex flex-wrap gap-5">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.value}
                                    onClick={() => handleStatusFilterChange(tab.value)}
                                    className={cn(
                                        "px-4 py-2 rounded-lg border-2 transition-all duration-200 font-medium text-sm",
                                        "hover:shadow-md active:scale-95 cursor-pointer",
                                        statusFilter === tab.value
                                            ? `${tab.color} bg-opacity-10`
                                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                                    )}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Property List */}
                    <div className="space-y-3">
                        {isLoading ? (
                            // Loading skeleton
                            <>
                                {[...Array(pageSize)].map((_, index) => (
                                    <div key={index} className="bg-white rounded-lg shadow-sm p-4 flex gap-4">
                                        <Skeleton className="w-64 h-48 rounded-lg flex-shrink-0" />
                                        <div className="flex-1 space-y-3">
                                            <Skeleton className="h-6 w-3/4" />
                                            <Skeleton className="h-4 w-1/2" />
                                            <div className="flex gap-4">
                                                <Skeleton className="h-4 w-24" />
                                                <Skeleton className="h-4 w-24" />
                                            </div>
                                            <Skeleton className="h-4 w-full" />
                                            <div className="flex justify-between items-center mt-4">
                                                <Skeleton className="h-4 w-32" />
                                                <Skeleton className="h-6 w-24 rounded-full" />
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <Skeleton className="h-4 w-24" />
                                                <Skeleton className="h-4 w-24" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        ) : (
                            paginatedItems.map((property) => (
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
                                    onDelete={handleDelete}
                                />
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    {!isLoading && totalPages >= 1 && mappedProperties.length !== 0 && (
                        <div className="flex justify-center pt-2">
                            <ControlledPagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={(page) => {
                                    setCurrentPage(page);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                            />
                        </div>
                    )}

                    {/* Empty State - No properties at all */}
                    {!isLoading && mappedProperties.length === 0 && (
                        <div className="bg-white rounded-lg shadow-md p-12 text-center">
                            <p className="text-gray-500 text-lg">Bạn chưa có tin đăng nào</p>
                            <p className="text-gray-400 mt-2">Hãy bắt đầu đăng tin bất động sản của bạn</p>
                        </div>
                    )}

                    {/* Empty State - No filtered results */}
                    {!isLoading && mappedProperties.length > 0 && filteredProperties.length === 0 && (
                        <div className="bg-white rounded-lg shadow-md p-12 text-center">
                            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">Không tìm thấy kết quả phù hợp</p>
                            <p className="text-gray-400 mt-2">Thử tìm kiếm với từ khóa khác hoặc thay đổi bộ lọc</p>
                        </div>
                    )}
                </div>
            }

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa tin đăng</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa tin đăng này không? Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer" onClick={handleCancelDelete} disabled={isDeleting}>
                            Hủy
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            disabled={isDeleting}
                            className="cursor-pointer bg-red-500 hover:bg-red-700"
                        >
                            {isDeleting ? 'Đang xóa...' : 'Xóa'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};
