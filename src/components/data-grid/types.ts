import type { ReactNode } from 'react';

export interface ColumnDef<T> {
  id: string;
  header: string;
  accessorKey?: keyof T;
  accessorFn?: (row: T) => ReactNode;
  width?: number; // Fixed width in pixels
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

export type SortDirection = 'asc' | 'desc';

export interface SortState {
  columnId: string;
  direction: SortDirection;
}

export const PAGE_SIZE_OPTIONS = [10, 20, 30, 50, 100] as const;

export interface DataGridProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  keyField: keyof T;
  loading?: boolean;
  pagination?: PaginationState;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onRowSelect?: (row: T) => void;
  selectedRow?: T | null;
  actions?: (row: T) => ReactNode;
  onFilter?: () => void;
  onEditFilters?: () => void;
  onDownload?: () => void;
  onReload?: () => void;
  sort?: SortState[];
  onSort?: (sort: SortState[]) => void;
}