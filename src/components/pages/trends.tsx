import { useState, useEffect } from 'react';
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Globe, Activity, BarChart3 } from 'lucide-react';
import Spinner from '../Spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface GlobalData {
    market_cap_usd: number;
    volume_24h_usd: number;
    bitcoin_dominance_percentage: number;
}

interface CoinTicker {
    id: string;
    name: string;
    symbol: string;
    quotes: {
        USD: {
            price: number;
            volume_24h: number;
            market_cap: number;
            percent_change_24h: number;
        }
    }
}

const TrendsPage = () => {
    const [globalData, setGlobalData] = useState<GlobalData | null>(null);
    const [gainers, setGainers] = useState<CoinTicker[]>([]);
    const [losers, setLosers] = useState<CoinTicker[]>([]);
    const [trending, setTrending] = useState<CoinTicker[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // 1. 全球市場數據
                const globalRes = await fetch('https://api.coinpaprika.com/v1/global');
                if (!globalRes.ok) throw new Error('Failed to fetch global data');
                const globalJson = await globalRes.json();
                setGlobalData(globalJson);

                // 2. 所有幣種數據
                const tickersRes = await fetch('https://api.coinpaprika.com/v1/tickers?quotes=USD');
                if (!tickersRes.ok) throw new Error('Failed to fetch tickers');
                const tickersData: CoinTicker[] = await tickersRes.json();

                // 漲幅前 10
                const sortedGainers = [...tickersData]
                    .sort((a, b) => b.quotes.USD.percent_change_24h - a.quotes.USD.percent_change_24h)
                    .slice(0, 10);
                setGainers(sortedGainers);

                // 跌幅前 10
                const sortedLosers = [...tickersData]
                    .sort((a, b) => a.quotes.USD.percent_change_24h - b.quotes.USD.percent_change_24h)
                    .slice(0, 10);
                setLosers(sortedLosers);

                // 熱門趨勢：用 24h 交易量排序
                const sortedTrending = [...tickersData]
                    .sort((a, b) => b.quotes.USD.volume_24h - a.quotes.USD.volume_24h)
                    .slice(0, 8);
                setTrending(sortedTrending);

                setLoading(false);
            } catch (err) {
                console.error('API Error:', err);
                setError('載入資料失敗，請稍後再試或檢查網路');
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 300000);
        return () => clearInterval(interval);
    }, []);

    const dominanceData = globalData
        ? [
            { name: 'Bitcoin', value: globalData.bitcoin_dominance_percentage },
            { name: 'Other Coins', value: 100 - globalData.bitcoin_dominance_percentage }
        ]
        : [];

    const COLORS = ['#f7931a', '#94a3b8']; // BTC 橙 + Slate-400

    const getCoinImage = (symbol: string) => `https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/${symbol.toLowerCase()}.png`;
    const fallbackImage = 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/generic.png';

    if (loading) return <Spinner size="lg" className="h-[80vh]" />;

    if (error) {
        return (
            <div className="container mx-auto px-4 py-12">
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight mb-2">Market Trends</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Deep dive into the current state of the global cryptocurrency market, including top movers and dominance analysis.
                </p>
            </div>

            {/* Global Overview Section */}
            {globalData && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                    <Card className="flex flex-col justify-center items-center p-6 bg-primary/5 border-primary/20">
                        <Globe className="w-10 h-10 mb-4 text-primary" />
                        <p className="text-muted-foreground text-sm uppercase font-semibold">Market Cap</p>
                        <p className="text-3xl font-bold mt-1">
                            ${(globalData.market_cap_usd / 1e12).toFixed(2)}T
                        </p>
                    </Card>

                    <Card className="flex flex-col justify-center items-center p-6 bg-primary/5 border-primary/20">
                        <Activity className="w-10 h-10 mb-4 text-primary" />
                        <p className="text-muted-foreground text-sm uppercase font-semibold">24h Volume</p>
                        <p className="text-3xl font-bold mt-1">
                            ${(globalData.volume_24h_usd / 1e9).toFixed(1)}B
                        </p>
                    </Card>

                    <Card className="p-6">
                        <CardHeader className="p-0 mb-4 text-center">
                            <CardTitle className="text-sm font-semibold uppercase text-muted-foreground">BTC Dominance</CardTitle>
                        </CardHeader>
                        <div className="h-[180px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={dominanceData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {dominanceData.map((_entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            borderColor: 'hsl(var(--border))',
                                            borderRadius: '8px'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="text-center text-2xl font-bold mt-2">
                            {globalData.bitcoin_dominance_percentage.toFixed(1)}%
                        </p>
                    </Card>
                </div>
            )}

            {/* Gainers & Losers Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Gainers */}
                <Card>
                    <CardHeader className="border-b bg-muted/30">
                        <CardTitle className="flex items-center gap-2 text-green-500">
                            <TrendingUp className="w-5 h-5" />
                            Top 10 Gainers (24h)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            {gainers.map((coin, index) => (
                                <div key={coin.id} className="flex items-center justify-between group transition-colors hover:bg-muted/50 p-2 rounded-lg -mx-2">
                                    <div className="flex items-center gap-4">
                                        <span className="text-muted-foreground font-mono w-4 text-sm">{index + 1}</span>
                                        <img
                                            src={getCoinImage(coin.symbol)}
                                            alt=""
                                            className="w-8 h-8 rounded-full"
                                            onError={(e: any) => {
                                                e.target.onerror = null;
                                                e.target.src = fallbackImage;
                                            }}
                                        />
                                        <div>
                                            <p className="font-semibold text-sm">{coin.name}</p>
                                            <p className="text-xs text-muted-foreground uppercase">{coin.symbol}</p>
                                        </div>
                                    </div>
                                    <Badge variant="default" className="bg-green-500 hover:bg-green-600 font-mono">
                                        +{coin.quotes.USD.percent_change_24h?.toFixed(2) ?? '0.00'}%
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Losers */}
                <Card>
                    <CardHeader className="border-b bg-muted/30">
                        <CardTitle className="flex items-center gap-2 text-destructive">
                            <TrendingDown className="w-5 h-5" />
                            Top 10 Losers (24h)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            {losers.map((coin, index) => (
                                <div key={coin.id} className="flex items-center justify-between group transition-colors hover:bg-muted/50 p-2 rounded-lg -mx-2">
                                    <div className="flex items-center gap-4">
                                        <span className="text-muted-foreground font-mono w-4 text-sm">{index + 1}</span>
                                        <img
                                            src={getCoinImage(coin.symbol)}
                                            alt=""
                                            className="w-8 h-8 rounded-full"
                                            onError={(e: any) => {
                                                e.target.onerror = null;
                                                e.target.src = fallbackImage;
                                            }}
                                        />
                                        <div>
                                            <p className="font-semibold text-sm">{coin.name}</p>
                                            <p className="text-xs text-muted-foreground uppercase">{coin.symbol}</p>
                                        </div>
                                    </div>
                                    <Badge variant="destructive" className="font-mono">
                                        {coin.quotes.USD.percent_change_24h?.toFixed(2) ?? '0.00'}%
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Trending Section */}
            <Card>
                <CardHeader className="bg-muted/30 border-b">
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-primary" />
                        Most Active Coins BY Volume (24h)
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {trending.map((coin, index) => (
                            <div key={coin.id} className="flex items-center gap-4 p-4 border rounded-xl bg-card hover:shadow-md transition-shadow">
                                <span className="text-xl font-bold text-primary/30 font-mono">{index + 1}</span>
                                <img
                                    src={getCoinImage(coin.symbol)}
                                    alt=""
                                    className="w-10 h-10 rounded-full"
                                    onError={(e: any) => {
                                        e.target.onerror = null;
                                        e.target.src = fallbackImage;
                                    }}
                                />
                                <div className="overflow-hidden">
                                    <p className="font-bold text-sm truncate">{coin.name}</p>
                                    <p className="text-xs text-muted-foreground uppercase font-semibold">{coin.symbol}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default TrendsPage;
