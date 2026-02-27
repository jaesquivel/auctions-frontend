import { config } from '@/lib/config';
import { apiClient } from '@/lib/api-client';
import type { RawAsset, RawAssetUpdateRequest, SpringPage } from '@/types';
import { applyFilterParams } from '@/components/data-grid';
import type { FilterState } from '@/components/data-grid';

export interface RawAssetFilters {
  page?: number;  // 0-indexed
  size?: number;
  sort?: string[];
  rawEdictId?: string;
  type?: string;
  processed?: boolean;
  filters?: FilterState;
}

export const rawAssetsService = {
  async getAll(filters: RawAssetFilters = {}): Promise<SpringPage<RawAsset>> {
    const { page = 0, size = 20 } = filters;

    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('size', size.toString());
    filters.sort?.forEach((s) => params.append('sort', s));
    if (filters.rawEdictId) params.set('rawEdictId', filters.rawEdictId);
    if (filters.type) params.set('type', filters.type);
    if (filters.processed !== undefined) params.set('processed', filters.processed.toString());
    applyFilterParams(params, filters.filters);

    return apiClient.get<SpringPage<RawAsset>>(`/raw-assets?${params.toString()}`);
  },

  async getById(id: string): Promise<RawAsset | null> {

    return apiClient.get<RawAsset>(`/raw-assets/${id}`);
  },

  async update(id: string, data: RawAssetUpdateRequest): Promise<RawAsset> {

    return apiClient.put<RawAsset>(`/raw-assets/${id}`, data);
  },

  async delete(id: string): Promise<void> {

    return apiClient.delete(`/raw-assets/${id}`);
  },
};
