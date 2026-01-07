import { useQuery } from '@tanstack/react-query';
import type { CoinDetails } from '@/types';

const API_URL = import.meta.env.VITE_COIN_API_URL || 'https://api.coingecko.com/api/v3/coins';

const fetchCoinDetails = async (id: string): Promise<CoinDetails> => {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error('Failed to fetch coin data');
    return res.json();
};

export function useCoinDetails(id: string | undefined) {
    return useQuery({
        queryKey: ['coin-details', id],
        queryFn: () => fetchCoinDetails(id!),
        enabled: !!id,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}
