// Common types used across the application

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
}

export type Currency = 'CRC' | 'USD' | 'EUR';

export interface DateRange {
  start: string;
  end: string;
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterConfig {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in';
  value: string | number | boolean | string[] | number[];
}