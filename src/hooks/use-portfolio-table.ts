import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type SortingState,
  type PaginationState,
  type ColumnDef,
} from '@tanstack/react-table';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { selectTransactions } from '@/store/portfolio-slice';

// Transaction type (matches portfolio-slice)
export interface Transaction {
  id: string;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  coinImage: string;
  amount: number;
  purchasePrice: number;
  purchaseDate: string;
  totalCost: number;
}

// URL 參數的 parsers（加上 portfolio_ 前綴避免與其他頁面衝突）
const portfolioSearchParams = {
  pf_search: parseAsString.withDefault(''),
  pf_page: parseAsInteger.withDefault(1),
  pf_pageSize: parseAsInteger.withDefault(6),
  pf_sort: parseAsString.withDefault(''),
};

export function usePortfolioTable(columns: ColumnDef<Transaction>[]) {
  // 從 Redux 取得 portfolio 資料
  const transactions = useSelector(selectTransactions);

  // 使用 nuqs 進行 URL 狀態管理
  const [urlParams, setUrlParams] = useQueryStates(portfolioSearchParams, {
    shallow: true,
    clearOnDefault: true,
  });

  // 將 URL 的 page (1-based) 轉換為 pageIndex (0-based)
  const pagination: PaginationState = useMemo(
    () => ({
      pageIndex: urlParams.pf_page - 1,
      pageSize: urlParams.pf_pageSize,
    }),
    [urlParams.pf_page, urlParams.pf_pageSize]
  );

  // 將 URL 的 sort 字符串解析為 SortingState
  const sorting: SortingState = useMemo(() => {
    if (!urlParams.pf_sort) return [];

    const [id, direction] = urlParams.pf_sort.split(':');
    if (!id) return [];

    return [
      {
        id,
        desc: direction === 'desc',
      },
    ];
  }, [urlParams.pf_sort]);

  const table = useReactTable({
    data: transactions,
    columns,
    getRowId: (row) => row.id,
    state: {
      pagination,
      sorting,
      globalFilter: urlParams.pf_search,
    },
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === 'function' ? updater(pagination) : updater;

      setUrlParams({
        pf_page: newPagination.pageIndex + 1,
        pf_pageSize: newPagination.pageSize,
      });
    },
    onSortingChange: (updater) => {
      const newSorting = typeof updater === 'function' ? updater(sorting) : updater;

      if (newSorting.length === 0) {
        setUrlParams({ pf_sort: '' });
      } else {
        const { id, desc } = newSorting[0];
        setUrlParams({ pf_sort: `${id}:${desc ? 'desc' : 'asc'}`, pf_page: 1 });
      }
    },
    onGlobalFilterChange: (value) => {
      setUrlParams({ pf_search: value, pf_page: 1 });
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return {
    table,
    transactions,
    globalFilter: urlParams.pf_search,
    setGlobalFilter: (value: string) => setUrlParams({ pf_search: value, pf_page: 1 }),
  };
}

