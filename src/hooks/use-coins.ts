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
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';

// URL 參數的 parsers
const searchParams = {
  // search keyword
  search: parseAsString.withDefault(''),
  // pagination
  page: parseAsInteger.withDefault(1),
  pageSize: parseAsInteger.withDefault(10),
  sort: parseAsString.withDefault(''),
}

export function useCoins(columns: ColumnDef<Coin>[]) {
  // 使用 nuqs 進行 URL 狀態管理
  const [ urlParams, setUrlParams ] = useQueryStates(searchParams, {
    // 不會觸發頁面重新加載
    shallow: true,
    // 當值為默認參數時，不顯示在 URL 中
    clearOnDefault: true,
  });

  // 將 URL 的 page (1-based) 轉換為 pageIndex (0-based)
  const pagination: PaginationState = useMemo(() => ({
    pageIndex: urlParams.page - 1,
    pageSize: urlParams.pageSize,
  }), [urlParams.page, urlParams.pageSize]);

  // 將 URL 的 sort 字符串解析為 SortingState
  const sorting: SortingState = useMemo(() => {
    if (!urlParams.sort) return [];
    
    const [id, direction] = urlParams.sort.split(':');
    if (!id) return [];
    
    return [{
      id,
      desc: direction === 'desc',
    }];
  }, [urlParams.sort]);
  
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
    queryKey: ['coins', pagination, sorting, urlParams.search],
    queryFn: () => fetchCoinsServer({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      sorting,
      globalFilter: urlParams.search,
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
      globalFilter: urlParams.search,
      rowSelection,
    },

    onPaginationChange: (updater) => {
      const newPagination = typeof updater === 'function' 
      ? updater(pagination) 
      : updater;

      setUrlParams({
        page: newPagination.pageIndex + 1,
        pageSize: newPagination.pageSize,
      })
    },

    onSortingChange: (updater) => {
      const newSorting = typeof updater === 'function' 
      ? updater(sorting) 
      : updater;

      if(newSorting.length === 0) {
        setUrlParams({ sort: '' });
      }else {
        const { id, desc } = newSorting[0];
        setUrlParams({ sort: `${id}:${desc ? 'desc' : 'asc'}`, page: 1 }); // 排序時回到第 1 頁
      }
    },

    onGlobalFilterChange: (value) => {
      setUrlParams({ search: value, page: 1 });
    },
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });
  
  return {
    table,
    dataQuery,
    globalFilter: urlParams.search,
    setGlobalFilter: (value: string) => setUrlParams({ search: value, page: 1 }),
  };
}