import { useMemo } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { type Coin } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
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
import { ArrowUpDown } from 'lucide-react';
import { useCoins } from '@/hooks/use-coins';
import { flexRender } from '@tanstack/react-table';

const CoinsTablePage = () => {
    const columns = useMemo<ColumnDef<Coin>[]>(
        () => [
            {
                accessorKey: 'name',
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        >
                            Coin Name
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    );
                },
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <img src={row.original.image} alt={row.original.name} className="w-6 h-6 rounded-full" />
                        <span className="font-medium">{row.original.name}</span>
                        <span className="text-muted-foreground uppercase text-xs">{row.original.symbol}</span>
                    </div>
                ),
            },
            {
                accessorKey: 'current_price',
                header: ({ column }) => {
                    return (
                        <div className="text-right">
                            <Button
                                variant="ghost"
                                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                            >
                                Price
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    );
                },
                cell: ({ row }) => {
                    const price = parseFloat(row.getValue('current_price'));
                    const formatted = new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                    }).format(price);
                    return <div className="text-right font-mono">{formatted}</div>;
                },
            },
            {
                accessorKey: 'price_change_percentage_24h',
                header: ({ column }) => {
                    return (
                        <div className="text-right">
                            <Button
                                variant="ghost"
                                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                            >
                                24h Change
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    );
                },
                cell: ({ row }) => {
                    const amount = parseFloat(row.getValue('price_change_percentage_24h'));
                    const isPositive = amount >= 0;
                    return (
                        <div className={`text-right font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            {isPositive ? '+' : ''}{amount.toFixed(2)}%
                        </div>
                    );
                },
            },
            {
                accessorKey: 'market_cap',
                header: ({ column }) => {
                    return (
                        <div className="text-right">
                            <Button
                                variant="ghost"
                                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                            >
                                Market Cap
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    );
                },
                cell: ({ row }) => {
                    const mcap = parseFloat(row.getValue('market_cap'));
                    const formatted = new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        notation: 'compact',
                        maximumFractionDigits: 1,
                    }).format(mcap);
                    return <div className="text-right">{formatted}</div>;
                },
            },
        ],
        []
    );

    const { table, dataQuery, globalFilter, setGlobalFilter } = useCoins(columns);

    const isInitialLoading = dataQuery.isFetching;
    const currentPage = table.getState().pagination.pageIndex + 1;
    const totalPages = table.getPageCount();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col gap-4 mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Cryptocurrency Prices</h1>
                <p className="text-muted-foreground">
                    Live prices, charts, and market data (Server-Side Table Demo).
                </p>
            </div>

            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter coins..."
                    value={globalFilter}
                    onChange={(event) => setGlobalFilter(event.target.value)}
                    className="max-w-sm"
                    disabled={isInitialLoading}
                />
            </div>

            <div className="rounded-md border">
                <table className="w-full">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id} className="border-b">
                                {headerGroup.headers.map((header) => (
                                    <th key={header.id} className="h-12 px-4 text-left align-middle font-medium">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {isInitialLoading ? (
                            Array.from({ length: 10 }).map((_, index) => (
                                <tr key={index} className="border-b">
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="h-6 w-6 rounded-full" />
                                            <Skeleton className="h-4 w-32" />
                                            <Skeleton className="h-3 w-12" />
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <Skeleton className="h-4 w-24 ml-auto" />
                                    </td>
                                    <td className="p-4">
                                        <Skeleton className="h-4 w-16 ml-auto" />
                                    </td>
                                    <td className="p-4">
                                        <Skeleton className="h-4 w-20 ml-auto" />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                <tr key={row.id} className="border-b hover:bg-muted/50">
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="p-4 align-middle">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* 使用 shadcn Pagination */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-2 py-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="text-sm text-muted-foreground whitespace-nowrap">
                        {isInitialLoading ? (
                            <Skeleton className="h-4 w-48" />
                        ) : (
                            `Showing ${table.getRowModel().rows.length} of ${dataQuery.data?.total ?? 0} rows`
                        )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground whitespace-nowrap">Rows per page:</span>
                        <Select
                            value={table.getState().pagination.pageSize.toString()}
                            onValueChange={(value) => table.setPageSize(Number(value))}
                            disabled={isInitialLoading}
                        >
                            <SelectTrigger className="w-[70px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {[10, 20, 30, 40, 50].map((size) => (
                                    <SelectItem key={size} value={size.toString()}>
                                        {size}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Pagination className="flex justify-end">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious 
                                onClick={() => table.previousPage()}
                                className={!table.getCanPreviousPage() || isInitialLoading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                        </PaginationItem>
                        
                        {/* 顯示頁碼 */}
                        {totalPages <= 7 ? (
                            // 總頁數少於等於 7，全部顯示
                            Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <PaginationItem key={page}>
                                    <PaginationLink
                                        onClick={() => !isInitialLoading && table.setPageIndex(page - 1)}
                                        isActive={currentPage === page}
                                        className={isInitialLoading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                    >
                                        {page}
                                    </PaginationLink>
                                </PaginationItem>
                            ))
                        ) : (
                            // 總頁數大於 7，顯示省略號
                            <>
                                <PaginationItem>
                                    <PaginationLink
                                        onClick={() => !isInitialLoading && table.setPageIndex(0)}
                                        isActive={currentPage === 1}
                                        className={isInitialLoading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
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
                                                    onClick={() => !isInitialLoading && table.setPageIndex(page - 1)}
                                                    isActive={currentPage === page}
                                                    className={isInitialLoading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
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
                                        onClick={() => !isInitialLoading && table.setPageIndex(totalPages - 1)}
                                        isActive={currentPage === totalPages}
                                        className={isInitialLoading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                    >
                                        {totalPages}
                                    </PaginationLink>
                                </PaginationItem>
                            </>
                        )}
                        
                        <PaginationItem>
                            <PaginationNext 
                                onClick={() => table.nextPage()}
                                className={!table.getCanNextPage() || isInitialLoading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
};

export default CoinsTablePage;