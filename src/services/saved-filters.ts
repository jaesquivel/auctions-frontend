import { apiClient } from '@/lib/api-client';
import type { FilterState } from '@/components/data-grid';

export interface SavedFilterItem {
  id: string;
  name: string;
  state: FilterState;
  createdAt: string;
  updatedAt: string;
}

export const savedFiltersService = {
  async getAll(): Promise<SavedFilterItem[]> {
    return apiClient.get<SavedFilterItem[]>('/saved_filters');
  },

  async create(name: string, state: FilterState): Promise<SavedFilterItem> {
    return apiClient.post<SavedFilterItem>('/saved_filters', { name, state });
  },

  async rename(id: string, name: string): Promise<SavedFilterItem> {
    return apiClient.put<SavedFilterItem>(`/saved_filters/${id}`, { name });
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/saved_filters/${id}`);
  },
};
