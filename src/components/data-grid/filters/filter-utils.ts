import type { ColumnDef } from '../types';
import type { FilterCondition, FilterGroup, FilterState, FilterableColumnDef } from './filter-types';

export function createEmptyCondition(defaultField?: string): FilterCondition {
  return {
    id: crypto.randomUUID(),
    field: defaultField ?? '',
    operator: 'contains',
    value: '',
  };
}

export function createEmptyGroup(defaultField?: string): FilterGroup {
  return {
    id: crypto.randomUUID(),
    conditions: [createEmptyCondition(defaultField)],
    joinOperator: 'and',
  };
}

export function createEmptyFilterState(defaultField?: string): FilterState {
  return {
    groups: [createEmptyGroup(defaultField)],
    joinOperator: 'and',
  };
}

export function hasActiveFilters(state: FilterState | undefined): boolean {
  if (!state) return false;
  return state.groups.some((g) =>
    g.conditions.some((c) => c.field !== '')
  );
}

export function countActiveFilters(state: FilterState | undefined): number {
  if (!state) return 0;
  return state.groups.reduce(
    (total, g) => total + g.conditions.filter((c) => c.field !== '').length,
    0
  );
}

export function getFilterableColumns<T>(columns: ColumnDef<T>[]): FilterableColumnDef[] {
  return columns
    .filter((c) => c.filterable)
    .map((c) => ({
      id: c.id,
      header: c.header,
      filterType: c.filterType ?? 'text',
    }));
}