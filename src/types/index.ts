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
