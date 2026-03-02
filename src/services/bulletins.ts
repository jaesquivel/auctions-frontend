import { config } from '@/lib/config';
import { apiClient } from '@/lib/api-client';
import { uuid } from '@/lib/utils';
import type { Bulletin, SpringPage } from '@/types';
import { applyFilterParams } from '@/components/data-grid';
import type { FilterState } from '@/components/data-grid';

export interface BulletinFilters {
  page?: number;  // 0-indexed
  size?: number;
  sort?: string[];
  year?: number;
  filters?: FilterState;
}

export const bulletinsService = {
  async getAll(filters: BulletinFilters = {}): Promise<SpringPage<Bulletin>> {
    const { page = 0, size = 20 } = filters;

    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('size', size.toString());
    filters.sort?.forEach((s) => params.append('sort', s));
    if (filters.year) params.set('year', filters.year.toString());
    applyFilterParams(params, filters.filters);

    return apiClient.get<SpringPage<Bulletin>>(`/bulletins?${params.toString()}`);
  },

  async getById(id: string): Promise<Bulletin | null> {

    return apiClient.get<Bulletin>(`/bulletins/${id}`);
  },

  async create(data: Partial<Bulletin>): Promise<Bulletin> {

    return apiClient.post<Bulletin>('/bulletins', data);
  },

  async update(id: string, data: Partial<Bulletin>): Promise<Bulletin> {

    return apiClient.put<Bulletin>(`/bulletins/${id}`, data);
  },

  async delete(id: string): Promise<void> {

    return apiClient.delete(`/bulletins/${id}`);
  },
};