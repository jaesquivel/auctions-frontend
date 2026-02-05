import { config } from '@/lib/config';
import { apiClient } from '@/lib/api-client';
import { mockExtractedEdicts } from '@/mocks';
import type { EdictRaw, EdictRawCreateRequest, EdictRawUpdateRequest, SpringPage } from '@/types';

export interface EdictRawFilters {
  page?: number;  // 0-indexed
  size?: number;
  sort?: string;
  bulletinId?: string;
  processed?: boolean;
}

export const edictsRawService = {
  async getAll(filters: EdictRawFilters = {}): Promise<SpringPage<EdictRaw>> {
    const { page = 0, size = 20 } = filters;

    if (config.useMock.edictsRaw) {
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
    if (filters.sort) params.set('sort', filters.sort);
    if (filters.bulletinId) params.set('bulletinId', filters.bulletinId);
    if (filters.processed !== undefined) params.set('processed', filters.processed.toString());

    return apiClient.get<SpringPage<EdictRaw>>(`/edicts-raw?${params.toString()}`);
  },

  async getById(id: string): Promise<EdictRaw | null> {
    if (config.useMock.edictsRaw) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return mockExtractedEdicts.find((e) => e.id === id) || null;
    }

    return apiClient.get<EdictRaw>(`/edicts-raw/${id}`);
  },

  async create(data: EdictRawCreateRequest): Promise<EdictRaw> {
    if (config.useMock.edictsRaw) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() } as unknown as EdictRaw;
    }

    return apiClient.post<EdictRaw>('/edicts-raw', data);
  },

  async update(id: string, data: EdictRawUpdateRequest): Promise<EdictRaw> {
    if (config.useMock.edictsRaw) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const existing = mockExtractedEdicts.find((e) => e.id === id);
      return { ...existing, ...data } as EdictRaw;
    }

    return apiClient.put<EdictRaw>(`/edicts-raw/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    if (config.useMock.edictsRaw) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return;
    }

    return apiClient.delete(`/edicts-raw/${id}`);
  },
};
