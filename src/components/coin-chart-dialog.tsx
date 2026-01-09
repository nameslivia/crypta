import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { type Coin } from '@/types';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CoinChartDialogProps {
    coin: Coin | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface ChartDataPoint {
    date: string;
    price: number;
}

export function CoinChartDialog({ coin, open, onOpenChange }: CoinChartDialogProps) {
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!coin || !open) return;

        const fetchChartData = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(
                    `https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart?vs_currency=usd&days=30&interval=daily`
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch chart data');
                }

                const data = await response.json();

                const formattedData: ChartDataPoint[] = data.prices.map((item: [number, number]) => ({
                    date: new Date(item[0]).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                    }),
                    price: parseFloat(item[1].toFixed(2)),
                }));
                
                setChartData(formattedData);
            } catch (err) {
                console.error('Error fetching chart data:', err);
                setError('Failed to load chart data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchChartData();
    }, [coin, open]);

    if (!coin) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full" />
                        {coin.name} ({coin.symbol.toUpperCase()}) - Price Chart (30 Days)
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Current Price</p>
                            <p className="text-2xl font-bold">
                                ${coin.current_price.toLocaleString('en-US')}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground">24h Change</p>
                            <p className={`text-xl font-semibold ${
                                coin.price_change_percentage_24h >= 0 
                                    ? 'text-green-600' 
                                    : 'text-red-600'
                            }`}>
                                {coin.price_change_percentage_24h >= 0 ? '+' : ''}
                                {coin.price_change_percentage_24h.toFixed(2)}%
                            </p>
                        </div>
                    </div>

                    {error ? (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    ) : loading ? (
                        <div className="h-[400px] flex items-center justify-center">
                            <div className="space-y-4 w-full">
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-8 w-full" />
                            </div>
                        </div>
                    ) : chartData.length > 0 ? (
                        <div className="w-full" style={{ height: '400px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis 
                                        dataKey="date" 
                                        tick={{ fontSize: 12 }}
                                        angle={-45}
                                        textAnchor="end"
                                        height={60}
                                    />
                                    <YAxis 
                                        tick={{ fontSize: 12 }}
                                        domain={['auto', 'auto']}
                                        tickFormatter={(value) => `$${value.toLocaleString()}`}
                                    />
                                    <Tooltip 
                                        formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']}
                                        contentStyle={{ 
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            border: '1px solid #ccc',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="price" 
                                        stroke="#8884d8" 
                                        strokeWidth={3}
                                        dot={false}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                            No chart data available
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}