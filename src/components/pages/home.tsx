import CoinCard from '../CoinCard';
import LimitSelector from '../LimitSelector';
import FilterInput from '../FilterInput';
import SortSelector from '../SortSelector';
import Spinner from '../Spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface Coin {
    id: string;
    name: string;
    symbol: string;
    image: string;
    current_price: number;
    price_change_percentage_24h: number;
    market_cap: number;
    total_volume: number;
}

interface HomePageProps {
    coins: Coin[];
    filter: string;
    setFilter: (filter: string) => void;
    limit: number;
    setLimit: (limit: number) => void;
    sortBy: string;
    setSortBy: (sortBy: string) => void;
    loading: boolean;
    error: string | null;
}

const HomePage = ({
    coins,
    filter,
    setFilter,
    limit,
    setLimit,
    sortBy,
    setSortBy,
    loading,
    error,
}: HomePageProps) => {
    const filteredCoins = coins
        .filter((coin) => {
            return (
                coin.name.toLowerCase().includes(filter.toLowerCase()) ||
                coin.symbol.toLowerCase().includes(filter.toLowerCase())
            );
        })
        .slice()
        .sort((a, b) => {
            switch (sortBy) {
                case 'market_cap_desc':
                    return b.market_cap - a.market_cap;
                case 'market_cap_asc':
                    return a.market_cap - b.market_cap;
                case 'price_desc':
                    return b.current_price - a.current_price;
                case 'price_asc':
                    return a.current_price - b.current_price;
                case 'change_desc':
                    return b.price_change_percentage_24h - a.price_change_percentage_24h;
                case 'change_asc':
                    return a.price_change_percentage_24h - b.price_change_percentage_24h;
                default:
                    return 0;
            }
        });

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight mb-2">
                        🚀 Market Overview
                    </h1>
                    <p className="text-muted-foreground">
                        Track the latest prices and trends across the crypto market.
                    </p>
                </div>
            </div>

            {error && (
                <Alert variant="destructive" className="mb-8">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="flex flex-col md:flex-row items-center gap-4 mb-8 bg-card p-4 rounded-xl border shadow-sm">
                <FilterInput filter={filter} onFilterChange={setFilter} />
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <LimitSelector limit={limit} onLimitChange={setLimit} />
                    <SortSelector sortBy={sortBy} onSortChange={setSortBy} />
                </div>
            </div>

            {loading ? (
                <Spinner size="lg" />
            ) : (
                <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCoins.length > 0 ? (
                        filteredCoins.map((coin) => (
                            <CoinCard key={coin.id} coin={coin} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 bg-muted/20 rounded-xl border-2 border-dashed">
                            <p className="text-muted-foreground text-lg">No matching coins found.</p>
                        </div>
                    )}
                </main>
            )}
        </div>
    );
};

export default HomePage;
