import { config } from '@/lib/config';
import { apiClient } from '@/lib/api-client';
import { mockAssets } from '@/mocks';
import type { Asset, SpringPage } from '@/types';
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
  async getAll(filters: AssetFilters = {}): Promise<SpringPage<Asset>> {
    const { page = 0, size = 20 } = filters;

    if (config.useMock.assets) {
      await new Promise((resolve) => setTimeout(resolve, 100));

      const startIndex = page * size;
      const content = mockAssets.slice(startIndex, startIndex + size);
      const totalElements = mockAssets.length;
      const totalPages = Math.ceil(totalElements / size);

      return {
        content,
        totalElements,
        totalPages,
        size,
        number: page,
        first: page === 0,
        last: page >= totalPages - 1,
        empty: content.length === 0,
        numberOfElements: content.length,
      };
    }

    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('size', size.toString());
    filters.sort?.forEach((s) => params.append('sort', s));
    if (filters.search) params.set('search', filters.search);
    applyFilterParams(params, filters.filters);

    return apiClient.get<SpringPage<Asset>>(`/assets?${params.toString()}`);
  },

  async getById(id: string): Promise<Asset | null> {
    if (config.useMock.assets) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return mockAssets.find((a) => a.id === id) || null;
    }

    return apiClient.get<Asset>(`/assets/${id}`);
  },

  async create(data: Partial<Asset>): Promise<Asset> {
    if (config.useMock.assets) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return { ...data, id: crypto.randomUUID() } as Asset;
    }

    return apiClient.post<Asset>('/assets', data);
  },

  async update(id: string, data: Partial<Asset>): Promise<Asset> {
    if (config.useMock.assets) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const existing = mockAssets.find((a) => a.id === id);
      return { ...existing, ...data } as Asset;
    }

    return apiClient.put<Asset>(`/assets/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    if (config.useMock.assets) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return;
    }

    return apiClient.delete(`/assets/${id}`);
  },
};