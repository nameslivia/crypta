import { useState, useEffect, useMemo } from 'react';
import { useMarketData } from '@/hooks/use-market-data';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Field, FieldLabel, FieldError, FieldDescription } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
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

import { portfolioSchema, type PortfolioFormData } from '@/validations/portfolio';

interface Transaction {
    id: string;
    coinId: string;
    coinName: string;
    coinSymbol: string;
    coinImage: string;
    amount: number;
    purchasePrice: number;
    purchaseDate: string;
    totalCost: number;
}


const PortfolioPage = () => {
    const formatDate = (date: Date | undefined) => {
        if (!date) return '';
        return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    };
    const isValidDate = (date: Date | undefined) => {
        if (!date) return false;
        return !isNaN(date.getTime());
    };
    const [portfolio, setPortfolio] = useState<Transaction[]>([]);
    const { data: availableCoins = [], isLoading: loading } = useMarketData();

    const currentPrices = useMemo(() => {
        const prices: Record<string, number> = {};
        availableCoins.forEach((coin) => {
            prices[coin.id] = coin.current_price;
        });
        return prices;
    }, [availableCoins]);

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
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [calendarMonth, setCalendarMonth] = useState<Date | undefined>(
        purchaseDate ? new Date(purchaseDate) : undefined
    );
    const [dateInputValue, setDateInputValue] = useState(
        formatDate(purchaseDate ? new Date(purchaseDate) : undefined)
    );


    useEffect(() => {
        const savedPortfolio = localStorage.getItem('cryptoPortfolio');
        if (savedPortfolio) {
            setPortfolio(JSON.parse(savedPortfolio));
        }
    }, []);

    const savePortfolio = (newPortfolio: Transaction[]) => {
        localStorage.setItem('cryptoPortfolio', JSON.stringify(newPortfolio));
        setPortfolio(newPortfolio);
    };

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

        const updatedPortfolio = [...portfolio, newTransaction];
        savePortfolio(updatedPortfolio);
        reset();
    };

    const deleteTransaction = (id: string) => {
        const updatedPortfolio = portfolio.filter((item) => item.id !== id);
        savePortfolio(updatedPortfolio);
    };

    const calculateStats = () => {
        let totalInvested = 0;
        let currentValue = 0;

        portfolio.forEach((item) => {
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
    };

    const stats = calculateStats();

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <p className="text-xl font-medium animate-pulse">Loading market data...</p>
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

                {/* List Section - 使用 Card */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>My Holdings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {portfolio.length === 0 ? (
                                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                                    <p className="text-muted-foreground mb-4">You don't have any holdings yet.</p>
                                    <p className="text-sm text-muted-foreground">Add your first transaction using the form on the left.</p>
                                </div>
                            ) : (
                                <div className="rounded-md border overflow-hidden">
                                    <Table>
                                        <TableHeader className="bg-muted/50">
                                            <TableRow>
                                                <TableHead>Coin</TableHead>
                                                <TableHead className="text-right">Amount</TableHead>
                                                <TableHead className="text-right">Price Paid</TableHead>
                                                <TableHead className="text-right">P/L</TableHead>
                                                <TableHead className="text-center">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {portfolio.map((item) => {
                                                const currentPrice = currentPrices[item.coinId] || 0;
                                                const currentValue = item.amount * currentPrice;
                                                const profitLoss = currentValue - item.totalCost;
                                                const profitLossPercent = item.totalCost > 0 ? (profitLoss / item.totalCost) * 100 : 0;

                                                return (
                                                    <TableRow key={item.id}>
                                                        <TableCell>
                                                            <div className="flex items-center gap-3">
                                                                <img src={item.coinImage} alt="" className="w-8 h-8 rounded-full" />
                                                                <div>
                                                                    <p className="font-semibold text-sm">{item.coinName}</p>
                                                                    <p className="text-xs text-muted-foreground uppercase">{item.coinSymbol}</p>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right font-mono text-sm">
                                                            {item.amount.toLocaleString(undefined, { maximumFractionDigits: 8 })}
                                                        </TableCell>
                                                        <TableCell className="text-right text-sm">
                                                            ${item.purchasePrice.toLocaleString()}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex flex-col items-end">
                                                                <span className={profitLoss >= 0 ? "text-green-500 font-medium text-sm" : "text-red-500 font-medium text-sm"}>
                                                                    {profitLoss >= 0 ? '+' : ''}${Math.abs(profitLoss).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                                </span>
                                                                <Badge variant={profitLoss >= 0 ? "default" : "destructive"} className="text-[10px] px-1 h-4">
                                                                    {profitLoss >= 0 ? '+' : ''}{profitLossPercent.toFixed(2)}%
                                                                </Badge>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-center">
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
                                                                        <AlertDialogAction onClick={() => deleteTransaction(item.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                                            Delete
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PortfolioPage;