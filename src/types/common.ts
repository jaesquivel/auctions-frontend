// Common types used across the application

/**
 * Spring Boot Page response format
 */
export interface SpringPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
  numberOfElements: number;
}

/**
 * Spring Boot pagination query parameters
 */
export interface SpringPageParams {
  page?: number;  // 0-indexed
  size?: number;
  sort?: string;  // e.g., "name,asc" or "createdAt,desc"
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