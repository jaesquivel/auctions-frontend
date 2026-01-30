import { config } from '@/lib/config';
import { apiClient } from '@/lib/api-client';
import { mockBulletins } from '@/mocks';
import type { Bulletin } from '@/types';
import type { PaginatedResponse } from './properties';

export interface BulletinFilters {
  page?: number;
  pageSize?: number;
  year?: number;
}

export const bulletinsService = {
  async getAll(filters: BulletinFilters = {}): Promise<PaginatedResponse<Bulletin>> {
    const { page = 1, pageSize = 20 } = filters;

    if (config.USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 100));

      const startIndex = (page - 1) * pageSize;
      const data = mockBulletins.slice(startIndex, startIndex + pageSize);

      return { data, total: mockBulletins.length, page, pageSize };
    }

    const params = new URLSearchParams();
    if (filters.page) params.set('page', filters.page.toString());
    if (filters.pageSize) params.set('pageSize', filters.pageSize.toString());
    if (filters.year) params.set('year', filters.year.toString());

    const queryString = params.toString();
    return apiClient.get<PaginatedResponse<Bulletin>>(`/bulletins${queryString ? `?${queryString}` : ''}`);
  },

  async getById(id: string): Promise<Bulletin | null> {
    if (config.USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return mockBulletins.find((b) => b.id === id) || null;
    }

    return apiClient.get<Bulletin>(`/bulletins/${id}`);
  },

  async create(data: Partial<Bulletin>): Promise<Bulletin> {
    if (config.USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() } as Bulletin;
    }

    return apiClient.post<Bulletin>('/bulletins', data);
  },

  async update(id: string, data: Partial<Bulletin>): Promise<Bulletin> {
    if (config.USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const existing = mockBulletins.find((b) => b.id === id);
      return { ...existing, ...data } as Bulletin;
    }

    return apiClient.put<Bulletin>(`/bulletins/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    if (config.USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return;
    }

    return apiClient.delete(`/bulletins/${id}`);
  },
};