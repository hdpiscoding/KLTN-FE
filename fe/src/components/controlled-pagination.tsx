import * as React from 'react';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
} from '@/components/ui/pagination';

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    siblingCount?: number; // số trang hiển thị xung quanh currentPage
}

export const ControlledPagination: React.FC<PaginationControlsProps> = ({
                                                                            currentPage,
                                                                            totalPages,
                                                                            onPageChange,
                                                                            siblingCount = 1,
                                                                        }) => {
    // Hàm tạo mảng trang với ellipsis
    const getPageNumbers = () => {
        const totalNumbers = siblingCount * 2 + 5; // first, last, current ± sibling, prev/next ellipsis
        if (totalPages <= totalNumbers) {
            // nếu trang ít, hiển thị tất cả
            return Array.from({length: totalPages}, (_, i) => i + 1);
        }

        const pages: (number | string)[] = [];
        const leftSiblingIndex = Math.max(currentPage - siblingCount, 2);
        const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages - 1);

        pages.push(1); // luôn hiển thị trang đầu

        if (leftSiblingIndex > 2) {
            pages.push('...'); // ellipsis trước
        }

        for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
            pages.push(i);
        }

        if (rightSiblingIndex < totalPages - 1) {
            pages.push('...'); // ellipsis sau
        }

        pages.push(totalPages); // luôn hiển thị trang cuối
        return pages;
    };

    const pages = getPageNumbers();

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                </PaginationItem>

                {pages.map((page, idx) =>
                    typeof page === 'number' ? (
                        <PaginationItem key={page}>
                            <PaginationLink
                                isActive={page === currentPage}
                                onClick={() => onPageChange(page)}
                                className="cursor-pointer"
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    ) : (
                        <PaginationItem key={`ellipsis-${idx}`}>
                            <PaginationLink className="pointer-events-none opacity-50">{page}</PaginationLink>
                        </PaginationItem>
                    )
                )}

                <PaginationItem>
                    <PaginationNext
                        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};
