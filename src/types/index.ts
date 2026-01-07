export type Coin = {
    id: string;
    name: string;
    symbol: string;
    image: string;
    current_price: number;
    price_change_percentage_24h: number;
    market_cap: number;
    total_volume: number;
};

export type FetchCoinsParams = {
    pageIndex: number;
    pageSize: number;
    sorting?: { id: string; desc: boolean }[];
    globalFilter?: string;
};

export type FetchCoinsResponse = {
    data: Coin[];
    pageCount: number;
    total: number;
};

export interface CoinDetails {
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
