import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Spinner from '../Spinner';
import CoinChart from '../CoinChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink, Globe } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const API_URL = import.meta.env.VITE_COIN_API_URL;

interface CoinDetails {
    id: string;
    name: string;
    symbol: string;
    image: { large: string };
    description: { en: string };
    market_cap_rank: number;
    market_data: {
        current_price: { usd: number };
        market_cap: { usd: number };
        high_24h: { usd: number };
        low_24h: { usd: number };
        price_change_24h: number;
        price_change_percentage_24h: number;
        circulating_supply: number;
        total_supply: number | null;
        ath: { usd: number };
        ath_date: { usd: string };
        atl: { usd: number };
        atl_date: { usd: string };
    };
    links: {
        homepage: string[];
        blockchain_site: string[];
    };
    categories: string[];
    last_updated: string;
}

const CoinDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const [coin, setCoin] = useState<CoinDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCoin = async () => {
            try {
                const res = await fetch(`${API_URL}/${id}`);
                if (!res.ok) throw new Error('Failed to fetch coin data');
                const data = await res.json();
                setCoin(data);
            } catch (err: any) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCoin();
    }, [id]);

    if (loading) return <Spinner size="lg" className="h-[80vh]" />;

    if (error) {
        return (
            <div className="container mx-auto px-4 py-12">
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
                <Link to="/" className="mt-4 block">
                    <Button variant="outline" className="gap-2">
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Button>
                </Link>
            </div>
        );
    }

    if (!coin) return null;

    return (
        <div className="container mx-auto px-4 py-8">
            <Link to="/" className="inline-block mb-6">
                <Button variant="ghost" className="gap-2 -ml-4">
                    <ArrowLeft className="w-4 h-4" /> Back to Market
                </Button>
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left: Basic Info & Chart */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                        <img
                            src={coin.image.large}
                            alt={coin.name}
                            className="w-24 h-24 rounded-full border-4 border-muted p-1"
                        />
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-4xl font-extrabold tracking-tight">
                                    {coin.name}
                                </h1>
                                <Badge variant="outline" className="text-lg uppercase">
                                    {coin.symbol}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-4 mt-2">
                                <Badge className="font-bold">Rank #{coin.market_cap_rank}</Badge>
                                <span className="text-3xl font-bold">
                                    ${coin.market_data.current_price.usd.toLocaleString()}
                                </span>
                                <Badge variant={coin.market_data.price_change_percentage_24h >= 0 ? "default" : "destructive"}>
                                    {coin.market_data.price_change_percentage_24h >= 0 ? '+' : ''}
                                    {coin.market_data.price_change_percentage_24h.toFixed(2)}%
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>About {coin.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground leading-relaxed">
                                {coin.description.en.split('. ')[0] + '.'}
                            </p>
                        </CardContent>
                    </Card>

                    <CoinChart coinId={coin.id} />

                    <div className="flex flex-wrap gap-4">
                        {coin.links.homepage[0] && (
                            <a href={coin.links.homepage[0]} target="_blank" rel="noopener noreferrer">
                                <Button variant="secondary" className="gap-2">
                                    <Globe className="w-4 h-4" /> Official Website <ExternalLink className="w-3 h-3" />
                                </Button>
                            </a>
                        )}
                        {coin.links.blockchain_site[0] && (
                            <a href={coin.links.blockchain_site[0]} target="_blank" rel="noopener noreferrer">
                                <Button variant="secondary" className="gap-2">
                                    Block Explorer <ExternalLink className="w-3 h-3" />
                                </Button>
                            </a>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                        {coin.categories.map(cat => (
                            <Badge key={cat} variant="outline" className="text-[10px]">{cat}</Badge>
                        ))}
                    </div>
                </div>

                {/* Right: Statistics Card */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-24">
                        <CardHeader className="bg-muted/30 border-b">
                            <CardTitle className="text-lg">Market Statistics</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y">
                                <StatRow label="Market Cap" value={`$${coin.market_data.market_cap.usd.toLocaleString()}`} />
                                <StatRow label="24h High" value={`$${coin.market_data.high_24h.usd.toLocaleString()}`} isSuccess />
                                <StatRow label="24h Low" value={`$${coin.market_data.low_24h.usd.toLocaleString()}`} isError />
                                <StatRow label="Circulating Supply" value={coin.market_data.circulating_supply.toLocaleString()} />
                                <StatRow label="Total Supply" value={coin.market_data.total_supply?.toLocaleString() || 'N/A'} />
                                <StatRow
                                    label="All-Time High"
                                    value={`$${coin.market_data.ath.usd.toLocaleString()}`}
                                    subtext={`on ${new Date(coin.market_data.ath_date.usd).toLocaleDateString()}`}
                                />
                                <StatRow
                                    label="All-Time Low"
                                    value={`$${coin.market_data.atl.usd.toLocaleString()}`}
                                    subtext={`on ${new Date(coin.market_data.atl_date.usd).toLocaleDateString()}`}
                                />
                                <div className="p-4 text-xs text-muted-foreground text-center italic">
                                    Last Updated: {new Date(coin.last_updated).toLocaleString()}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const StatRow = ({ label, value, subtext, isSuccess, isError }: any) => (
    <div className="p-4 flex flex-col">
        <span className="text-xs text-muted-foreground uppercase font-semibold">{label}</span>
        <div className="flex justify-between items-baseline mt-1">
            <span className={`font-bold ${isSuccess ? 'text-green-500' : isError ? 'text-red-500' : ''}`}>
                {value}
            </span>
            {subtext && <span className="text-[10px] text-muted-foreground">{subtext}</span>}
        </div>
    </div>
);

export default CoinDetailsPage;
