import { type Table as TanStackTable } from '@tanstack/react-table';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

interface DataTablePaginationProps<TData> {
    table: TanStackTable<TData>;
    totalRows?: number;
    isLoading?: boolean;
    pageSizeOptions?: number[];
    showPageSizeSelector?: boolean;
}

export function DataTablePagination<TData>({
    table,
    totalRows,
    isLoading = false,
    pageSizeOptions = [10, 25, 50, 100],
    showPageSizeSelector = true,
}: DataTablePaginationProps<TData>) {
    const currentPage = table.getState().pagination.pageIndex + 1;
    const totalPages = table.getPageCount();

    // 智慧分頁：頁數 <= 7 全顯示，否則用省略號
    const renderPageNumbers = () => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                    <PaginationLink
                        onClick={() => !isLoading && table.setPageIndex(page - 1)}
                        isActive={currentPage === page}
                        className={isLoading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    >
                        {page}
                    </PaginationLink>
                </PaginationItem>
            ));
        }

        // 頁數 > 7，顯示省略號
        return (
            <>
                <PaginationItem>
                    <PaginationLink
                        onClick={() => !isLoading && table.setPageIndex(0)}
                        isActive={currentPage === 1}
                        className={isLoading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    >
                        1
                    </PaginationLink>
                </PaginationItem>

                {currentPage > 3 && (
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                )}

                {Array.from({ length: 3 }, (_, i) => {
                    const page = currentPage - 1 + i;
                    if (page > 1 && page < totalPages) {
                        return (
                            <PaginationItem key={page}>
                                <PaginationLink
                                    onClick={() => !isLoading && table.setPageIndex(page - 1)}
                                    isActive={currentPage === page}
                                    className={isLoading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                >
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        );
                    }
                    return null;
                })}

                {currentPage < totalPages - 2 && (
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                )}

                <PaginationItem>
                    <PaginationLink
                        onClick={() => !isLoading && table.setPageIndex(totalPages - 1)}
                        isActive={currentPage === totalPages}
                        className={isLoading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    >
                        {totalPages}
                    </PaginationLink>
                </PaginationItem>
            </>
        );
    };

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-2 py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="text-sm text-muted-foreground whitespace-nowrap">
                    {isLoading ? (
                        <Skeleton className="h-4 w-48" />
                    ) : (
                        `Showing ${table.getRowModel().rows.length} of ${totalRows ?? 0} rows`
                    )}
                </div>

                {showPageSizeSelector && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground whitespace-nowrap">Rows per page:</span>
                        <Select
                            value={table.getState().pagination.pageSize.toString()}
                            onValueChange={(value) => table.setPageSize(Number(value))}
                            disabled={isLoading}
                        >
                            <SelectTrigger className="w-[70px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {pageSizeOptions.map((size) => (
                                    <SelectItem key={size} value={size.toString()}>
                                        {size}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>

            {totalPages > 1 && (
                <Pagination className="flex justify-end w-auto mx-0">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => table.previousPage()}
                                className={!table.getCanPreviousPage() || isLoading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                        </PaginationItem>
                        {renderPageNumbers()}
                        <PaginationItem>
                            <PaginationNext
                                onClick={() => table.nextPage()}
                                className={!table.getCanNextPage() || isLoading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
}

