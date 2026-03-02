import { useState, useEffect, useCallback } from 'react';
import { savedFiltersService, type SavedFilterItem } from '@/services/saved-filters';
import type { FilterState } from './filter-types';

export type SavedFilter = SavedFilterItem;

export function useSavedFilters(enabled: boolean) {
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    savedFiltersService.getAll().then(setSavedFilters).catch(console.error);
  }, [enabled]);

  const save = useCallback(async (name: string, state: FilterState) => {
    const created = await savedFiltersService.create(name, state);
    setSavedFilters((prev) => [...prev, created]);
    setActiveId(created.id);
  }, []);

  const rename = useCallback(async (id: string, newName: string) => {
    const updated = await savedFiltersService.rename(id, newName);
    setSavedFilters((prev) => prev.map((f) => (f.id === id ? updated : f)));
  }, []);

  const remove = useCallback(async (id: string) => {
    await savedFiltersService.delete(id);
    setSavedFilters((prev) => prev.filter((f) => f.id !== id));
    setActiveId((prev) => (prev === id ? null : prev));
  }, []);

  return { savedFilters, activeId, setActiveId, save, rename, remove };
}
