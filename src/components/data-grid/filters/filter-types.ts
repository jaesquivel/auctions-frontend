export type ColumnFilterType = 'text' | 'number' | 'boolean' | 'date';

export type FilterOperator =
  // text
  | 'contains' | 'equals' | 'notEquals' | 'startsWith' | 'endsWith' | 'isEmpty' | 'isNotEmpty'
  // number
  | 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'between'
  // boolean
  | 'isTrue' | 'isFalse'
  // date
  | 'dateEquals' | 'before' | 'after' | 'dateBetween';

export const NO_VALUE_OPERATORS: FilterOperator[] = ['isEmpty', 'isNotEmpty', 'isTrue', 'isFalse'];

export const RANGE_OPERATORS: FilterOperator[] = ['between', 'dateBetween'];

export const OPERATORS_BY_TYPE: Record<ColumnFilterType, FilterOperator[]> = {
  text: ['contains', 'equals', 'notEquals', 'startsWith', 'endsWith', 'isEmpty', 'isNotEmpty'],
  number: ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'between'],
  boolean: ['isTrue', 'isFalse'],
  date: ['dateEquals', 'before', 'after', 'dateBetween'],
};

export interface FilterCondition {
  id: string;
  field: string;
  operator: FilterOperator;
  value: string | number | boolean;
  valueTo?: string | number;
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

export interface FilterableColumnDef {
  id: string;
  header: string;
  filterType: ColumnFilterType;
}