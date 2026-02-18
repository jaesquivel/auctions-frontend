import { uuid } from '@/lib/utils';
import type { ColumnDef } from '../types';
import type { FilterCondition, FilterGroup, FilterState, FilterableColumnDef } from './filter-types';

export function createEmptyCondition(defaultField?: string): FilterCondition {
  return {
    id: uuid(),
    field: defaultField ?? '',
    operator: 'contains',
    value: '',
  };
}

export function createEmptyGroup(defaultField?: string): FilterGroup {
  return {
    id: uuid(),
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

/**
 * Serializes FilterState into URLSearchParams using the backend format:
 *   field[op]=value  +  match=all|any
 *
 * Boolean filters are sent as field[eq]=true/false.
 * Only the first group is used (simple mode). The group's joinOperator
 * maps to the `match` parameter (and → all, or → any).
 */
export function applyFilterParams(params: URLSearchParams, state: FilterState | undefined): void {
  if (!state) return;

  const conditions = state.groups.flatMap((g) => g.conditions);
  const active = conditions.filter((c) => c.field !== '');
  if (active.length === 0) return;

  // Use first group's joinOperator for the match param
  const match = state.groups[0]?.joinOperator === 'or' ? 'any' : 'all';
  params.set('match', match);

  for (const c of active) {
    if (c.operator === 'isTrue') {
      params.append(`${c.field}[eq]`, 'true');
    } else if (c.operator === 'isFalse') {
      params.append(`${c.field}[eq]`, 'false');
    } else if (c.operator === 'isEmpty') {
      params.append(`${c.field}[isEmpty]`, '');
    } else if (c.operator === 'isNotEmpty') {
      params.append(`${c.field}[isNotEmpty]`, '');
    } else {
      params.append(`${c.field}[${c.operator}]`, String(c.value));
    }
  }
}