import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useState, useMemo, useEffect } from 'react';
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
  
  // 從 localStorage 初始化
  const [selectedCoinIds, setSelectedCoinIds] = useState<Set<string>>(() => {
    const stored = localStorage.getItem('selectedCoins');
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });
  
  // 存到 localStorage
  useEffect(() => {
    localStorage.setItem('selectedCoins', JSON.stringify(Array.from(selectedCoinIds)));
  }, [selectedCoinIds]);
  
  const [rowSelection, setRowSelection] = useState({});
  
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
  
  // 數據加載後，恢復勾選狀態
  useEffect(() => {
    if (dataQuery.data?.data) {
      const newRowSelection: Record<string, boolean> = {};
      // 因為用了 getRowId，key 就是 coin.id
      selectedCoinIds.forEach((id) => {
        newRowSelection[id] = true;
      });
      setRowSelection(newRowSelection);
    }
  }, [dataQuery.data?.data, selectedCoinIds]);
  const table = useReactTable({
    data: dataQuery.data?.data ?? defaultData,
    columns,
    rowCount: dataQuery.data?.total,
    enableRowSelection: true,
    getRowId: (row) => row.id,
    onRowSelectionChange: (updater) => {
      setRowSelection((old) => {
        const newSelection = typeof updater === 'function' ? updater(old) : updater;
        
        // Object.keys(newSelection) 就是所有選中的 coin.id
        setSelectedCoinIds(new Set(Object.keys(newSelection)));
        
        return newSelection;
      });
    },
    state: {
      pagination,
      sorting,
      globalFilter,
      rowSelection,
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