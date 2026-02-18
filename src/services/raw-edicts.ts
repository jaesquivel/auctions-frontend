import { config } from '@/lib/config';
import { apiClient } from '@/lib/api-client';
import { uuid } from '@/lib/utils';
import { mockExtractedEdicts } from '@/mocks';
import type { RawEdict, RawEdictCreateRequest, RawEdictUpdateRequest, SpringPage } from '@/types';
import { applyFilterParams } from '@/components/data-grid';
import type { FilterState } from '@/components/data-grid';

export interface RawEdictFilters {
  page?: number;  // 0-indexed
  size?: number;
  sort?: string[];
  bulletinId?: string;
  processed?: boolean;
  filters?: FilterState;
}

export const rawEdictsService = {
  async getAll(filters: RawEdictFilters = {}): Promise<SpringPage<RawEdict>> {
    const { page = 0, size = 20 } = filters;

    if (config.useMock.rawEdicts) {
      await new Promise((resolve) => setTimeout(resolve, 100));

      const startIndex = page * size;
      const content = mockExtractedEdicts.slice(startIndex, startIndex + size);
      const totalElements = mockExtractedEdicts.length;
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
    if (filters.bulletinId) params.set('bulletinId', filters.bulletinId);
    if (filters.processed !== undefined) params.set('processed', filters.processed.toString());
    applyFilterParams(params, filters.filters);

    return apiClient.get<SpringPage<RawEdict>>(`/raw-edicts?${params.toString()}`);
  },

  async getById(id: string): Promise<RawEdict | null> {
    if (config.useMock.rawEdicts) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return mockExtractedEdicts.find((e) => e.id === id) || null;
    }

    return apiClient.get<RawEdict>(`/raw-edicts/${id}`);
  },

  async create(data: RawEdictCreateRequest): Promise<RawEdict> {
    if (config.useMock.rawEdicts) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return { ...data, id: uuid(), createdAt: new Date().toISOString() } as unknown as RawEdict;
    }

    return apiClient.post<RawEdict>('/raw-edicts', data);
  },

  async update(id: string, data: RawEdictUpdateRequest): Promise<RawEdict> {
    if (config.useMock.rawEdicts) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const existing = mockExtractedEdicts.find((e) => e.id === id);
      return { ...existing, ...data } as RawEdict;
    }

    return apiClient.put<RawEdict>(`/raw-edicts/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    if (config.useMock.rawEdicts) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return;
    }

    return apiClient.delete(`/raw-edicts/${id}`);
  },
};
