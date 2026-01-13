import { useState, useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useMarketData } from '@/hooks/use-market-data';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type ColumnDef } from '@tanstack/react-table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Field, FieldLabel, FieldError, FieldDescription } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Trash2, TrendingUp, TrendingDown, PlusCircle } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DataTable, DataTableFilter, DataTablePagination } from '@/components/data-table/index';

import { portfolioSchema, type PortfolioFormData } from '@/validations/portfolio';
import { addTransaction, deleteTransaction } from '@/store/portfolio-slice';
import { usePortfolioTable, type Transaction } from '@/hooks/use-portfolio-table';


const PortfolioPage = () => {
    const dispatch = useDispatch();

    const formatDate = (date: Date | undefined) => {
        if (!date) return '';
        return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    };
    const isValidDate = (date: Date | undefined) => {
        if (!date) return false;
        return !isNaN(date.getTime());
    };
    // const [portfolio, setPortfolio] = useState<Transaction[]>([]);

    const {
        data: availableCoins = [],
        isLoading: loading,
        error,
        isError,
        refetch
    } = useMarketData();

    const currentPrices = useMemo(() => {
        const prices: Record<string, number> = {};
        availableCoins.forEach((coin) => {
            prices[coin.id] = coin.current_price;
        });
        return prices;
    }, [availableCoins]);

    // Delete handler
    const handleDeleteTransaction = useCallback((id: string) => {
        dispatch(deleteTransaction(id));
    }, [dispatch]);

    // TanStack Table columns
    const columns: ColumnDef<Transaction>[] = useMemo(
        () => [
            {
                accessorKey: 'coinName',
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        className="-ml-4"
                    >
                        Coin
                        {column.getIsSorted() === 'asc' ? (
                            <ArrowUp className="ml-2 h-4 w-4" />
                        ) : column.getIsSorted() === 'desc' ? (
                            <ArrowDown className="ml-2 h-4 w-4" />
                        ) : (
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                    </Button>
                ),
                cell: ({ row }) => (
                    <div className="flex items-center gap-3">
                        <img src={row.original.coinImage} alt="" className="w-8 h-8 rounded-full" />
                        <div>
                            <p className="font-semibold text-sm">{row.original.coinName}</p>
                            <p className="text-xs text-muted-foreground uppercase">{row.original.coinSymbol}</p>
                        </div>
                    </div>
                ),
            },
            {
                accessorKey: 'amount',
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        className="w-full justify-end -mr-4"
                    >
                        Amount
                        {column.getIsSorted() === 'asc' ? (
                            <ArrowUp className="ml-2 h-4 w-4" />
                        ) : column.getIsSorted() === 'desc' ? (
                            <ArrowDown className="ml-2 h-4 w-4" />
                        ) : (
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                    </Button>
                ),
                cell: ({ row }) => (
                    <div className="text-right font-mono text-sm">
                        {row.original.amount.toLocaleString(undefined, { maximumFractionDigits: 8 })}
                    </div>
                ),
            },
            {
                accessorKey: 'purchasePrice',
                header: () => <div className="text-right">Price Paid</div>,
                cell: ({ row }) => (
                    <div className="text-right text-sm">
                        ${row.original.purchasePrice.toLocaleString()}
                    </div>
                ),
            },
            {
                id: 'profitLoss',
                header: () => <div className="text-right">P/L</div>,
                cell: ({ row }) => {
                    const currentPrice = currentPrices[row.original.coinId] || 0;
                    const currentValue = row.original.amount * currentPrice;
                    const profitLoss = currentValue - row.original.totalCost;
                    const profitLossPercent = row.original.totalCost > 0 ? (profitLoss / row.original.totalCost) * 100 : 0;

                    return (
                        <div className="flex flex-col items-end">
                            <span className={profitLoss >= 0 ? "text-green-500 font-medium text-sm" : "text-red-500 font-medium text-sm"}>
                                {profitLoss >= 0 ? '+' : ''}${Math.abs(profitLoss).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                            <Badge variant={profitLoss >= 0 ? "default" : "destructive"} className="text-[10px] px-1 h-4">
                                {profitLoss >= 0 ? '+' : ''}{profitLossPercent.toFixed(2)}%
                            </Badge>
                        </div>
                    );
                },
            },
            {
                id: 'actions',
                header: () => <div className="text-center">Action</div>,
                cell: ({ row }) => (
                    <div className="text-center">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-muted-foreground hover:text-destructive"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently remove this transaction from your portfolio.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => handleDeleteTransaction(row.original.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                ),
            },
        ],
        [currentPrices, handleDeleteTransaction]
    );

    // usePortfolioTable hook
    const { table, transactions, globalFilter, setGlobalFilter } = usePortfolioTable(columns);

    // React Hook Form
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue,
    } = useForm({
        resolver: zodResolver(portfolioSchema),
        defaultValues: {
            coinId: '',
            amount: 0,
            purchasePrice: 0,
            purchaseDate: new Date().toISOString().split('T')[0],
        },
    });

    const selectedCoinId = watch('coinId');
    const purchaseDate = watch('purchaseDate');
    // Calendar
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [calendarMonth, setCalendarMonth] = useState<Date | undefined>(
        purchaseDate ? new Date(purchaseDate) : undefined
    );
    const [dateInputValue, setDateInputValue] = useState(
        formatDate(purchaseDate ? new Date(purchaseDate) : undefined)
    );

    const onSubmit = (data: PortfolioFormData) => {
        const selectedCoin = availableCoins.find((coin) => coin.id === data.coinId);
        if (!selectedCoin) return;

        const newTransaction: Transaction = {
            id: Date.now().toString(),
            coinId: data.coinId,
            coinName: selectedCoin.name,
            coinSymbol: selectedCoin.symbol.toUpperCase(),
            coinImage: selectedCoin.image,
            amount: data.amount,
            purchasePrice: data.purchasePrice,
            purchaseDate: data.purchaseDate,
            totalCost: data.amount * data.purchasePrice,
        };

        // Redux dispatch
        dispatch(addTransaction(newTransaction));
        reset();
    };

    // Calculate portfolio stats
    const stats = useMemo(() => {
        let totalInvested = 0;
        let currentValue = 0;

        transactions.forEach((item) => {
            totalInvested += item.totalCost;
            const currentPrice = currentPrices[item.coinId] || 0;
            currentValue += item.amount * currentPrice;
        });

        const profitLoss = currentValue - totalInvested;
        const profitLossPercent = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;

        return {
            totalInvested,
            currentValue,
            profitLoss,
            profitLossPercent,
        };
    }, [transactions, currentPrices]);

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <p className="text-xl font-medium animate-pulse">Loading market data...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col h-[80vh] items-center justify-center gap-4">
                <div className="text-center text-red-500">
                    <p className="text-xl font-bold">Error loading market data</p>
                    <p className="text-sm">{(error as Error)?.message || 'Please check your internet connection and try again.'}</p>
                </div>
                <Button onClick={() => refetch()} variant="outline">
                    Try Again
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-10">
                <h1 className="text-4xl font-extrabold tracking-tight mb-2">Portfolio Tracker</h1>
                <p className="text-muted-foreground">Manage and track your cryptocurrency investments in real-time.</p>
            </div>

            {/* Statistics Section - 使用 Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Total Investment</CardDescription>
                        <CardTitle className="text-2xl">${stats.totalInvested.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Current Value</CardDescription>
                        <CardTitle className="text-2xl">${stats.currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Profit / Loss</CardDescription>
                        <CardTitle className={stats.profitLoss >= 0 ? "text-2xl text-green-500" : "text-2xl text-red-500"}>
                            {stats.profitLoss >= 0 ? '+' : ''}${stats.profitLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>P/L Percentage</CardDescription>
                        <CardTitle className={stats.profitLossPercent >= 0 ? "text-2xl text-green-500" : "text-2xl text-red-500"}>
                            <div className="flex items-center gap-2">
                                {stats.profitLossPercent >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                                {stats.profitLossPercent >= 0 ? '+' : ''}{stats.profitLossPercent.toFixed(2)}%
                            </div>
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Form Section - 改用 Field 組件  */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Add Transaction</CardTitle>
                            <CardDescription>Enter details to add a new coin to your portfolio.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                {/* 改用 Field - Select Coin */}
                                <Field>
                                    <FieldLabel htmlFor="coin-select">Select Coin</FieldLabel>
                                    <Select
                                        value={selectedCoinId}
                                        onValueChange={(val) => setValue('coinId', val, { shouldValidate: true })}
                                    >
                                        <SelectTrigger id="coin-select">
                                            <SelectValue placeholder="-- Select a coin --" />
                                        </SelectTrigger>
                                        <SelectContent
                                            position='popper'
                                            className="w-[var(--radix-select-trigger-width)]"
                                        >
                                            {availableCoins.map((coin) => (
                                                <SelectItem key={coin.id} value={coin.id}>
                                                    <div className="flex items-center gap-2">
                                                        <img src={coin.image} alt="" className="w-4 h-4 rounded-full" />
                                                        <span>{coin.name} ({coin.symbol.toUpperCase()})</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FieldError>{errors.coinId?.message}</FieldError>
                                </Field>

                                {/* 改用 Field - Quantity */}
                                <Field>
                                    <FieldLabel htmlFor="amount">Quantity</FieldLabel>
                                    <Input
                                        id="amount"
                                        type="number"
                                        step="any"
                                        {...register('amount')}
                                        placeholder="0.00"
                                    />
                                    <FieldDescription>
                                        Enter the amount of coins you purchased
                                    </FieldDescription>
                                    <FieldError>{errors.amount?.message}</FieldError>
                                </Field>

                                {/* 改用 Field - Purchase Price */}
                                <Field>
                                    <div className="flex justify-between items-center">
                                        <FieldLabel htmlFor="purchase-price">Purchase Price (USD)</FieldLabel>
                                        {selectedCoinId && currentPrices[selectedCoinId] && (
                                            <span className="text-xs text-muted-foreground">
                                                Current: ${currentPrices[selectedCoinId].toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                    <Input
                                        id="purchase-price"
                                        type="number"
                                        step="any"
                                        {...register('purchasePrice')}
                                        placeholder="0.00"
                                    />
                                    <FieldError>{errors.purchasePrice?.message}</FieldError>
                                </Field>

                                {/* 改用 Field - Purchase Date */}
                                <Field>
                                    <FieldLabel htmlFor="purchase-date">Purchase Date</FieldLabel>
                                    <div className="relative flex gap-2">
                                        <Input
                                            id="purchase-date"
                                            value={dateInputValue}
                                            placeholder="01/07/2026"
                                            className="bg-background pr-10"
                                            onChange={(e) => {
                                                const date = new Date(e.target.value);
                                                setDateInputValue(e.target.value);
                                                if (isValidDate(date)) {
                                                    setValue('purchaseDate', date.toISOString().split('T')[0], { shouldValidate: true });
                                                    setCalendarMonth(date);
                                                }
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === "ArrowDown") {
                                                    e.preventDefault();
                                                    setCalendarOpen(true);
                                                }
                                            }}
                                        />
                                        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                                                >
                                                    <CalendarIcon className="size-3.5" />
                                                    <span className="sr-only">Select date</span>
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto overflow-hidden p-0"
                                                align="end"
                                                alignOffset={-8}
                                                sideOffset={10}
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={purchaseDate ? new Date(purchaseDate) : undefined}
                                                    month={calendarMonth}
                                                    onMonthChange={setCalendarMonth}
                                                    onSelect={(date) => {
                                                        if (date) {
                                                            setValue('purchaseDate', date.toISOString().split('T')[0], { shouldValidate: true });
                                                            setDateInputValue(formatDate(date));
                                                            setCalendarOpen(false);
                                                        }
                                                    }}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <FieldError>{errors.purchaseDate?.message}</FieldError>
                                </Field>

                                <Button type="submit" className="w-full gap-2">
                                    <PlusCircle className="w-4 h-4" />
                                    Add Transaction
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* List Section - 使用 DataTable 組件 */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>My Holdings</CardTitle>
                            {transactions.length > 0 && (
                                <DataTableFilter
                                    value={globalFilter}
                                    onChange={setGlobalFilter}
                                    placeholder="Search holdings..."
                                    className="max-w-xs"
                                />
                            )}
                        </CardHeader>
                        <CardContent>
                            {transactions.length === 0 ? (
                                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                                    <p className="text-muted-foreground mb-4">You don't have any holdings yet.</p>
                                    <p className="text-sm text-muted-foreground">Add your first transaction using the form on the left.</p>
                                </div>
                            ) : (
                                <>
                                    <DataTable
                                        table={table}
                                        columns={columns}
                                    />

                                    {table.getPageCount() > 1 && (
                                        <DataTablePagination
                                            table={table}
                                            totalRows={transactions.length}
                                            showPageSizeSelector={false}
                                        />
                                    )}
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PortfolioPage;