import { useQuery } from '@tanstack/react-query';
import type { Coin } from '@/types';

const fetchMarketData = async (limit: number): Promise<Coin[]> => {
    const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`
    );
    if (!res.ok) throw new Error('Failed to fetch market data');
    return res.json();
};

export function useMarketData(limit: number = 100) {
    return useQuery({
        queryKey: ['market-data', limit],
        queryFn: () => fetchMarketData(limit),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}
