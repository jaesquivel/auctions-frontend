import { config } from '@/lib/config';
import { apiClient } from '@/lib/api-client';
import { mockBulletins } from '@/mocks';
import type { Bulletin, SpringPage } from '@/types';
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

    if (config.useMock.bulletins) {
      await new Promise((resolve) => setTimeout(resolve, 100));

      const startIndex = page * size;
      const content = mockBulletins.slice(startIndex, startIndex + size);
      const totalElements = mockBulletins.length;
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
    if (filters.year) params.set('year', filters.year.toString());
    if (filters.filters) params.set('filters', JSON.stringify(filters.filters));

    return apiClient.get<SpringPage<Bulletin>>(`/bulletins?${params.toString()}`);
  },

  async getById(id: string): Promise<Bulletin | null> {
    if (config.useMock.bulletins) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return mockBulletins.find((b) => b.id === id) || null;
    }

    return apiClient.get<Bulletin>(`/bulletins/${id}`);
  },

  async create(data: Partial<Bulletin>): Promise<Bulletin> {
    if (config.useMock.bulletins) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() } as Bulletin;
    }

    return apiClient.post<Bulletin>('/bulletins', data);
  },

  async update(id: string, data: Partial<Bulletin>): Promise<Bulletin> {
    if (config.useMock.bulletins) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const existing = mockBulletins.find((b) => b.id === id);
      return { ...existing, ...data } as Bulletin;
    }

    return apiClient.put<Bulletin>(`/bulletins/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    if (config.useMock.bulletins) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return;
    }

    return apiClient.delete(`/bulletins/${id}`);
  },
};