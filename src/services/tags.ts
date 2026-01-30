import { config } from '@/lib/config';
import { apiClient } from '@/lib/api-client';
import { mockTags } from '@/mocks';
import type { PropertyTag } from '@/types';
import type { PaginatedResponse } from './properties';

export interface TagFilters {
  page?: number;
  pageSize?: number;
  search?: string;
}

export const tagsService = {
  async getAll(filters: TagFilters = {}): Promise<PaginatedResponse<PropertyTag>> {
    const { page = 1, pageSize = 20 } = filters;

    if (config.USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 100));

      const startIndex = (page - 1) * pageSize;
      const data = mockTags.slice(startIndex, startIndex + pageSize);

      return { data, total: mockTags.length, page, pageSize };
    }

    const params = new URLSearchParams();
    if (filters.page) params.set('page', filters.page.toString());
    if (filters.pageSize) params.set('pageSize', filters.pageSize.toString());
    if (filters.search) params.set('search', filters.search);

    const queryString = params.toString();
    return apiClient.get<PaginatedResponse<PropertyTag>>(`/tags${queryString ? `?${queryString}` : ''}`);
  },

  async getById(id: string): Promise<PropertyTag | null> {
    if (config.USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return mockTags.find((t) => t.id === id) || null;
    }

    return apiClient.get<PropertyTag>(`/tags/${id}`);
  },

  async create(data: Partial<PropertyTag>): Promise<PropertyTag> {
    if (config.USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() } as PropertyTag;
    }

    return apiClient.post<PropertyTag>('/tags', data);
  },

  async update(id: string, data: Partial<PropertyTag>): Promise<PropertyTag> {
    if (config.USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const existing = mockTags.find((t) => t.id === id);
      return { ...existing, ...data } as PropertyTag;
    }

    return apiClient.put<PropertyTag>(`/tags/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    if (config.USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return;
    }

    return apiClient.delete(`/tags/${id}`);
  },
};