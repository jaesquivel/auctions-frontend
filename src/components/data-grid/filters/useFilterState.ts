'use client';

import { useState, useCallback } from 'react';
import type { FilterCondition, FilterGroup, FilterState } from './filter-types';
import { createEmptyCondition, createEmptyGroup, hasActiveFilters as checkActive, countActiveFilters as countActive } from './filter-utils';

export function useFilterState(initialState?: FilterState) {
  const [state, setState] = useState<FilterState>(
    initialState ?? { groups: [createEmptyGroup()], joinOperator: 'and' }
  );

  const setJoinOperator = useCallback((joinOperator: 'and' | 'or') => {
    setState((prev) => ({ ...prev, joinOperator }));
  }, []);

  const addGroup = useCallback((defaultField?: string) => {
    setState((prev) => ({
      ...prev,
      groups: [...prev.groups, createEmptyGroup(defaultField)],
    }));
  }, []);

  const removeGroup = useCallback((groupId: string) => {
    setState((prev) => {
      const groups = prev.groups.filter((g) => g.id !== groupId);
      if (groups.length === 0) {
        groups.push(createEmptyGroup());
      }
      return { ...prev, groups };
    });
  }, []);

  const updateGroup = useCallback((groupId: string, updated: FilterGroup) => {
    setState((prev) => ({
      ...prev,
      groups: prev.groups.map((g) => (g.id === groupId ? updated : g)),
    }));
  }, []);

  const addCondition = useCallback((groupId: string, defaultField?: string) => {
    setState((prev) => ({
      ...prev,
      groups: prev.groups.map((g) =>
        g.id === groupId
          ? { ...g, conditions: [...g.conditions, createEmptyCondition(defaultField)] }
          : g
      ),
    }));
  }, []);

  const removeCondition = useCallback((groupId: string, conditionId: string) => {
    setState((prev) => ({
      ...prev,
      groups: prev.groups.map((g) => {
        if (g.id !== groupId) return g;
        const conditions = g.conditions.filter((c) => c.id !== conditionId);
        if (conditions.length === 0) {
          conditions.push(createEmptyCondition());
        }
        return { ...g, conditions };
      }),
    }));
  }, []);

  const updateCondition = useCallback((groupId: string, conditionId: string, updated: FilterCondition) => {
    setState((prev) => ({
      ...prev,
      groups: prev.groups.map((g) =>
        g.id === groupId
          ? { ...g, conditions: g.conditions.map((c) => (c.id === conditionId ? updated : c)) }
          : g
      ),
    }));
  }, []);

  const clearAll = useCallback(() => {
    setState({ groups: [createEmptyGroup()], joinOperator: 'and' });
  }, []);

  const reset = useCallback((newState?: FilterState) => {
    if (!newState || newState.groups.length === 0) {
      setState({ groups: [createEmptyGroup()], joinOperator: newState?.joinOperator ?? 'and' });
    } else {
      setState(newState);
    }
  }, []);

  return {
    state,
    setJoinOperator,
    addGroup,
    removeGroup,
    updateGroup,
    addCondition,
    removeCondition,
    updateCondition,
    clearAll,
    reset,
    hasActiveFilters: checkActive(state),
    activeFilterCount: countActive(state),
  };
}