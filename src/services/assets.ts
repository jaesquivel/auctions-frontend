import { config } from '@/lib/config';
import { apiClient } from '@/lib/api-client';
import { mockAssets } from '@/mocks';
import type { Asset } from '@/types';
import type { PaginatedResponse } from './properties';

export interface AssetFilters {
  page?: number;
  pageSize?: number;
  search?: string;
}

export const assetsService = {
  async getAll(filters: AssetFilters = {}): Promise<PaginatedResponse<Asset>> {
    const { page = 1, pageSize = 20 } = filters;

    if (config.USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 100));

      const startIndex = (page - 1) * pageSize;
      const data = mockAssets.slice(startIndex, startIndex + pageSize);

      return { data, total: mockAssets.length, page, pageSize };
    }

    const params = new URLSearchParams();
    if (filters.page) params.set('page', filters.page.toString());
    if (filters.pageSize) params.set('pageSize', filters.pageSize.toString());
    if (filters.search) params.set('search', filters.search);

    const queryString = params.toString();
    return apiClient.get<PaginatedResponse<Asset>>(`/assets${queryString ? `?${queryString}` : ''}`);
  },

  async getById(id: string): Promise<Asset | null> {
    if (config.USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return mockAssets.find((a) => a.id === id) || null;
    }

    return apiClient.get<Asset>(`/assets/${id}`);
  },

  async create(data: Partial<Asset>): Promise<Asset> {
    if (config.USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return { ...data, id: crypto.randomUUID() } as Asset;
    }

    return apiClient.post<Asset>('/assets', data);
  },

  async update(id: string, data: Partial<Asset>): Promise<Asset> {
    if (config.USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const existing = mockAssets.find((a) => a.id === id);
      return { ...existing, ...data } as Asset;
    }

    return apiClient.put<Asset>(`/assets/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    if (config.USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return;
    }

    return apiClient.delete(`/assets/${id}`);
  },
};