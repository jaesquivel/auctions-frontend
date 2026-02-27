import { config } from '@/lib/config';
import { apiClient } from '@/lib/api-client';
import { uuid } from '@/lib/utils';
import type { Asset, AssetListItem, AssetCreateRequest, AssetUpdateRequest, SpringPage } from '@/types';
import { applyFilterParams } from '@/components/data-grid';
import type { FilterState } from '@/components/data-grid';

export interface AssetFilters {
  page?: number;  // 0-indexed
  size?: number;
  sort?: string[];
  search?: string;
  filters?: FilterState;
}

export const assetsService = {
  async getAll(filters: AssetFilters = {}): Promise<SpringPage<AssetListItem>> {
    const { page = 0, size = 20 } = filters;

    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('size', size.toString());
    filters.sort?.forEach((s) => params.append('sort', s));
    if (filters.search) params.set('search', filters.search);
    applyFilterParams(params, filters.filters);

    return apiClient.get<SpringPage<AssetListItem>>(`/assets?${params.toString()}`);
  },

  async getById(id: string): Promise<Asset | null> {

    return apiClient.get<Asset>(`/assets/${id}`);
  },

  async create(data: AssetCreateRequest): Promise<Asset> {

    return apiClient.post<Asset>('/assets', data);
  },

  async update(id: string, data: AssetUpdateRequest): Promise<Asset> {

    return apiClient.put<Asset>(`/assets/${id}`, data);
  },

  async delete(id: string): Promise<void> {

    return apiClient.delete(`/assets/${id}`);
  },
};