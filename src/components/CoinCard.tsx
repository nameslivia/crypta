import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

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

interface CoinCardProps {
    coin: Coin;
}

const CoinCard = ({ coin }: CoinCardProps) => {
    const isPositive = coin.price_change_percentage_24h >= 0;

    return (
        <Link to={`/coin/${coin.id}`} className="block transition-transform hover:scale-105">
            <Card className="h-full">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img
                                src={coin.image}
                                alt={coin.name}
                                className="w-10 h-10 rounded-full"
                            />
                            <div>
                                <CardTitle className="text-lg">{coin.name}</CardTitle>
                                <p className="text-sm text-muted-foreground uppercase">
                                    {coin.symbol}
                                </p>
                            </div>
                        </div>
                        <Badge variant={isPositive ? "default" : "destructive"} className="gap-1">
                            {isPositive ? (
                                <TrendingUp className="w-3 h-3" />
                            ) : (
                                <TrendingDown className="w-3 h-3" />
                            )}
                            {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Price</span>
                        <span className="font-semibold">
                            ${coin.current_price.toLocaleString()}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Market Cap</span>
                        <span className="text-sm">
                            ${(coin.market_cap / 1e9).toFixed(2)}B
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Volume</span>
                        <span className="text-sm">
                            ${(coin.total_volume / 1e6).toFixed(2)}M
                        </span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
};

export default CoinCard;
