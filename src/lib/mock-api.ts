
import type { Coin, FetchCoinsParams, FetchCoinsResponse } from '@/types';

// Mock data cache
let cachedCoins: Coin[] = [];

async function getCoins(): Promise<Coin[]> {
    if (cachedCoins.length > 0) return cachedCoins;

    try {
        const res = await fetch(
            'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false'
        );
        if (!res.ok) throw new Error('Failed to fetch initial mock data');
        cachedCoins = await res.json();
        return cachedCoins;
    } catch (error) {
        console.error("Mock API Error:", error);
        return [];
    }
}

export async function fetchCoinsServer(params: FetchCoinsParams): Promise<FetchCoinsResponse> {
    // Simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 500));

    let data = await getCoins();

    // 1. Filtering
    if (params.globalFilter) {
        const lowerFilter = params.globalFilter.toLowerCase();
        data = data.filter(
            (coin) =>
                coin.name.toLowerCase().includes(lowerFilter) ||
                coin.symbol.toLowerCase().includes(lowerFilter)
        );
    }

    // 2. Sorting
    if (params.sorting && params.sorting.length > 0) {
        const { id, desc } = params.sorting[0];
        data.sort((a, b) => {
            const aValue = (a as any)[id];
            const bValue = (b as any)[id];

            if (aValue < bValue) return desc ? 1 : -1;
            if (aValue > bValue) return desc ? -1 : 1;
            return 0;
        });
    }

    // 3. Pagination
    const start = params.pageIndex * params.pageSize;
    const end = start + params.pageSize;
    const pageData = data.slice(start, end);

    return {
        data: pageData,
        pageCount: Math.ceil(data.length / params.pageSize),
        total: data.length,
    };
}
