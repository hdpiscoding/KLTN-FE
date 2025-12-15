import React, { useState, useEffect } from 'react';
import { PropertyListItem } from '@/components/list-item/property-list-item.tsx';
import { ControlledPagination } from '@/components/ui/controlled-pagination.tsx';
import { searchFavoriteProperties, unlikeProperty } from '@/services/userServices.ts';
import type { PropertyListing } from '@/types/property-listing';
import { Skeleton } from '@/components/ui/skeleton.tsx';

export const FavoritePosts: React.FC = () => {
    // State
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [favoriteProperties, setFavoriteProperties] = useState<PropertyListing[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);

    // Fetch favorite properties from API
    const fetchFavoriteProperties = async () => {
        try {
            setIsLoading(true);
            const response = await searchFavoriteProperties({
                filters: [],
                sorts: [
                    {
                        key: 'createdAt',
                        type: 'DESC'
                    }
                ],
                rpp: 5,
                page: currentPage
            });

            setFavoriteProperties(response.data.items);
            setTotalPages(response.data.pages || 1);
            setTotalRecords(response.data.records || 0);
        } catch (error) {
            console.error('Error fetching favorite properties:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle unfavorite property
    const handleFavoriteClick = async (id: string, currentLikedState: boolean) => {
        if (!currentLikedState) return;

        try {
            const propertyId = Number(id);
            await unlikeProperty(propertyId);

            fetchFavoriteProperties();
        } catch (error) {
            console.error('Error removing favorite:', error);
        }
    };

    // Fetch data on mount and when page changes
    useEffect(() => {
        fetchFavoriteProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-semibold">Tin yêu thích</h1>
                </div>
                <p className="text-gray-600">
                    {isLoading ? (
                        <Skeleton className="h-5 w-64" />
                    ) : (
                        `Bạn đang theo dõi ${totalRecords} bất động sản`
                    )}
                </p>
            </div>

            {/* Property List */}
            <div className="space-y-3">
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
                ) : favoriteProperties.length > 0 ? (
                    favoriteProperties.map((property) => (
                        <PropertyListItem
                            key={property.id}
                            id={String(property.id)}
                            title={property.title}
                            price={property.price}
                            area={property.area}
                            address={`${property.addressStreet}, ${property.addressWard}, ${property.addressDistrict}, ${property.addressCity}`}
                            imageUrl={property.imageUrls?.[0] || ""}
                            createdAt={property.createdAt || ""}
                            isLiked={true}
                            onFavoriteClick={handleFavoriteClick}
                        />
                    ))
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <p className="text-gray-500 text-lg">Bạn chưa có tin yêu thích nào</p>
                        <p className="text-gray-400 mt-2">Hãy bắt đầu lưu các bất động sản bạn quan tâm</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {!isLoading && (
                <div className="flex justify-center pt-2">
                    <ControlledPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
};

