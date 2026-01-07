import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { 
  useReactTable, 
  getCoreRowModel,
  type SortingState,
  type PaginationState,
  type ColumnDef 
} from '@tanstack/react-table';
import { fetchCoinsServer } from '@/lib/mock-api';
import { type Coin } from '@/types';

export function useCoins(columns: ColumnDef<Coin>[]) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  
  const [globalFilter, setGlobalFilter] = useState('');

  const dataQuery = useQuery({
    queryKey: ['coins', pagination, sorting, globalFilter],
    queryFn: () => fetchCoinsServer({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      sorting,
      globalFilter,
    }),
    placeholderData: keepPreviousData,
  });

  const defaultData = useMemo(() => [], []);

  const table = useReactTable({
    data: dataQuery.data?.data ?? defaultData,
    columns,
    rowCount: dataQuery.data?.total,
    state: {
      pagination,
      sorting,
      globalFilter,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  return {
    table,
    dataQuery,
    globalFilter,
    setGlobalFilter,
  };
}