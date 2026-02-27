import { config } from '@/lib/config';
import { apiClient } from '@/lib/api-client';
import { uuid } from '@/lib/utils';
import type { Edict, EdictListItem, EdictCreateRequest, EdictUpdateRequest, SpringPage } from '@/types';
import { applyFilterParams } from '@/components/data-grid';
import type { FilterState } from '@/components/data-grid';

export interface EdictFilters {
  page?: number;  // 0-indexed
  size?: number;
  sort?: string[];
  search?: string;
  filters?: FilterState;
}

export const edictsService = {
  async getAll(filters: EdictFilters = {}): Promise<SpringPage<EdictListItem>> {
    const { page = 0, size = 20 } = filters;

    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('size', size.toString());
    filters.sort?.forEach((s) => params.append('sort', s));
    if (filters.search) params.set('search', filters.search);
    applyFilterParams(params, filters.filters);

    return apiClient.get<SpringPage<EdictListItem>>(`/edicts?${params.toString()}`);
  },

  async getById(id: string): Promise<Edict | null> {

    return apiClient.get<Edict>(`/edicts/${id}`);
  },

  async create(data: EdictCreateRequest): Promise<Edict> {

    return apiClient.post<Edict>('/edicts', data);
  },

  async update(id: string, data: EdictUpdateRequest): Promise<Edict> {

    return apiClient.put<Edict>(`/edicts/${id}`, data);
  },

  async delete(id: string): Promise<void> {

    return apiClient.delete(`/edicts/${id}`);
  },
};