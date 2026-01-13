import { useCallback, useMemo, useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { type Coin } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
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
import { ArrowUp, ArrowDown, ArrowUpDown, Bell, MoreHorizontal, Star, TrendingUp } from 'lucide-react';
import { useCoins } from '@/hooks/use-coins';
import { flexRender } from '@tanstack/react-table';
import { CoinChartDialog } from '@/features/coin/coin-chart-dialog';

const CoinsTablePage = () => {
    const [ favorites, setFavorites ] = useState<string[]>(() => {
        const storedFavorites = localStorage.getItem('favorites');
        return storedFavorites ? JSON.parse(storedFavorites) : [];
    });

    const [chartDialogOpen, setChartDialogOpen] = useState(false);
    const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
    
    // 開啟 chart 的函式
    const handleViewChart = useCallback((coin: Coin) => {
        setSelectedCoin(coin);
        setChartDialogOpen(true);
    }, []);

    const toggleFavorite = (coinId: string) => {
        setFavorites((prevFavorites) => {
            const newFavorites = prevFavorites.includes(coinId)
                ? prevFavorites.filter((id) => id !== coinId)
                : [...prevFavorites, coinId];
            localStorage.setItem('favorites', JSON.stringify(newFavorites));
            return newFavorites;
        });
    };

    const isFavorite = (coinId: string) => favorites.includes(coinId);
    const columns = useMemo<ColumnDef<Coin>[]>(
        () => [
            {
                id: 'select',
                header: ({ table }) => (
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected()}
                        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                    />
                ),
                cell: ({ row }) => (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={value => row.toggleSelected(!!value)}
                        aria-label="Select row"
                    />
                ),
            },
            {
                accessorKey: 'name',
                header: ({ column }) => {
                    const isSorted = column.getIsSorted();
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        >
                            Coin Name
                            {isSorted === 'asc' ? (
                                <ArrowUp className="ml-2 h-4 w-4" />
                            ) : isSorted === 'desc' ? (
                                <ArrowDown className="ml-2 h-4 w-4" />
                            ) : (
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                            )}
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
                    const isSorted = column.getIsSorted();
                    return (
                        <div className="text-right">
                            <Button
                                variant="ghost"
                                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                            >
                                Price
                                {isSorted === 'asc' ? (
                                    <ArrowUp className="ml-2 h-4 w-4" />
                                ) : isSorted === 'desc' ? (
                                    <ArrowDown className="ml-2 h-4 w-4" />
                                ) : (
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                )}
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
                    const isSorted = column.getIsSorted();
                    return (
                        <div className="text-right">
                            <Button
                                variant="ghost"
                                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                            >
                                24h Change
                                {isSorted === 'asc' ? (
                                    <ArrowUp className="ml-2 h-4 w-4" />
                                ) : isSorted === 'desc' ? (
                                    <ArrowDown className="ml-2 h-4 w-4" />
                                ) : (
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                )}
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
                    const isSorted = column.getIsSorted();
                    return (
                        <div className="text-right">
                            <Button
                                variant="ghost"
                                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                            >
                                Market Cap
                                {isSorted === 'asc' ? (
                                    <ArrowUp className="ml-2 h-4 w-4" />
                                ) : isSorted === 'desc' ? (
                                    <ArrowDown className="ml-2 h-4 w-4" />
                                ) : (
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                )}
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
            {
                id: 'actions',
                header: () => <div className="text-right">Actions</div>,
                cell: ({ row }) => {
                    const coin = row.original;
                    const isStarred = isFavorite(coin.id);
                    return (
                        <div className="text-right">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>{coin.name}</DropdownMenuLabel>
                                    <DropdownMenuSeparator/>
                                    <DropdownMenuItem onClick={() => toggleFavorite(coin.id)}>
                                        <Star 
                                           className={`mr-2 h-4 w-4 ${isStarred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                                        {isStarred ? 'Remove from favorites' : 'Add to favorites'}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleViewChart(coin)}>
                                        <TrendingUp className="mr-2 h-4 w-4" />
                                        View chart
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => console.log('Set price alert', coin)}>
                                        <Bell className="mr-2 h-4 w-4" />
                                        Set price alert
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator/>
                                    <DropdownMenuItem 
                                        onClick={() => {
                                        navigator.clipboard.writeText(coin.id);
                                        console.log('Copied ID:', coin.id);
                                    }}>
                                        Copy coin ID
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )
                }
            },
        ],
        [favorites, isFavorite, toggleFavorite, handleViewChart]
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
                                        <Skeleton className="h-4 w-4" />
                                    </td>
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
                                    <td className="p-4">
                                        <Skeleton className="h-8 w-8 ml-auto" />
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
            <CoinChartDialog 
                coin={selectedCoin}
                open={chartDialogOpen}
                onOpenChange={setChartDialogOpen}
            />
        </div>
    );
};

export default CoinsTablePage;