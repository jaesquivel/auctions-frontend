import { config } from '@/lib/config';
import { apiClient } from '@/lib/api-client';
import { mockExtractedAssets } from '@/mocks';
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

    if (config.useMock.rawAssets) {
      await new Promise((resolve) => setTimeout(resolve, 100));

      const startIndex = page * size;
      const content = mockExtractedAssets.slice(startIndex, startIndex + size);
      const totalElements = mockExtractedAssets.length;
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
    if (filters.rawEdictId) params.set('rawEdictId', filters.rawEdictId);
    if (filters.type) params.set('type', filters.type);
    if (filters.processed !== undefined) params.set('processed', filters.processed.toString());
    applyFilterParams(params, filters.filters);

    return apiClient.get<SpringPage<RawAsset>>(`/raw-assets?${params.toString()}`);
  },

  async getById(id: string): Promise<RawAsset | null> {
    if (config.useMock.rawAssets) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return mockExtractedAssets.find((a) => a.id === id) || null;
    }

    return apiClient.get<RawAsset>(`/raw-assets/${id}`);
  },

  async update(id: string, data: RawAssetUpdateRequest): Promise<RawAsset> {
    if (config.useMock.rawAssets) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const existing = mockExtractedAssets.find((a) => a.id === id);
      return { ...existing, ...data } as RawAsset;
    }

    return apiClient.put<RawAsset>(`/raw-assets/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    if (config.useMock.rawAssets) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return;
    }

    return apiClient.delete(`/raw-assets/${id}`);
  },
};
