
import { useState, useEffect, useMemo } from 'react';
import { type ColumnDef, type PaginationState, type SortingState } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import { fetchCoinsServer, type Coin } from '@/lib/mock-api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';

const CoinsTablePage = () => {
    const [data, setData] = useState<Coin[]>([]);
    const [rowCount, setRowCount] = useState(0);
    const [loading, setLoading] = useState(false);

    // Table State
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');

    // Debounce filter
    const [debouncedFilter, setDebouncedFilter] = useState(globalFilter);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedFilter(globalFilter);
            setPagination((prev) => ({ ...prev, pageIndex: 0 })); // Reset to page 1 on search
        }, 500);
        return () => clearTimeout(handler);
    }, [globalFilter]);

    // Fetch data
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const res = await fetchCoinsServer({
                    pageIndex: pagination.pageIndex,
                    pageSize: pagination.pageSize,
                    sorting,
                    globalFilter: debouncedFilter,
                });
                setData(res.data);
                setRowCount(res.total);
            } catch (error) {
                console.error('Failed to fetch coins:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [pagination, sorting, debouncedFilter]);

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
                />
            </div>

            <DataTable
                columns={columns}
                data={data}
                rowCount={rowCount}
                pagination={pagination}
                sorting={sorting}
                onPaginationChange={setPagination}
                onSortingChange={setSorting}
                loading={loading}
            />
        </div>
    );
};

export default CoinsTablePage;
