import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchCoinsServer } from '@/lib/mock-api';
import { type SortingState } from '@tanstack/react-table';

interface UseCoinsParams {
    pageIndex: number;
    pageSize: number;
    sorting: SortingState;
    globalFilter: string;
}

export function useCoins({ pageIndex, pageSize, sorting, globalFilter }: UseCoinsParams) {
    return useQuery({
        queryKey: ['coins', pageIndex, pageSize, sorting, globalFilter],
        queryFn: () => fetchCoinsServer({
            pageIndex,
            pageSize,
            sorting,
            globalFilter,
        }),
        placeholderData: keepPreviousData,
    });
}
