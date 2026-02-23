export type ColumnFilterType = 'text' | 'number' | 'boolean' | 'date' | 'datetime' | 'tagId';

// Operators aligned with the backend API: field[op]=value
export type FilterOperator =
  // text
  | 'contains' | 'doesNotContain' | 'eq' | 'ne' | 'startsWith' | 'endsWith' | 'isEmpty' | 'isNotEmpty'
  // number & date (shared)
  | 'gt' | 'gte' | 'lt' | 'lte'
  // boolean
  | 'isTrue' | 'isFalse'
  // tagId
  | 'anyOf' | 'allOf' | 'noneOf' | 'exactly';

export const NO_VALUE_OPERATORS: FilterOperator[] = ['isEmpty', 'isNotEmpty', 'isTrue', 'isFalse'];

export const OPERATORS_BY_TYPE: Record<ColumnFilterType, FilterOperator[]> = {
  text: ['contains', 'doesNotContain', 'eq', 'ne', 'startsWith', 'endsWith', 'isEmpty', 'isNotEmpty'],
  number: ['eq', 'ne', 'gt', 'gte', 'lt', 'lte'],
  boolean: ['isTrue', 'isFalse'],
  date: ['eq', 'ne', 'gt', 'gte', 'lt', 'lte'],
  datetime: ['eq', 'ne', 'gt', 'gte', 'lt', 'lte'],
  tagId: ['anyOf', 'allOf', 'noneOf', 'exactly'],
};

export interface FilterCondition {
  id: string;
  field: string;
  operator: FilterOperator;
  value: string | number | boolean;
}

export interface FilterGroup {
  id: string;
  conditions: FilterCondition[];
  joinOperator: 'and' | 'or';
}

export interface FilterState {
  groups: FilterGroup[];
  joinOperator: 'and' | 'or';
}

export interface TagOption {
  id: string;
  name: string;
  color: string;
}

export interface FilterableColumnDef {
  id: string;
  header: string;
  filterType: ColumnFilterType;
  tagOptions?: TagOption[];
}