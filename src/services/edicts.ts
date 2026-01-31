import { config } from '@/lib/config';
import { apiClient } from '@/lib/api-client';
import { mockEdicts } from '@/mocks';
import type { Edict } from '@/types';
import type { PaginatedResponse } from './properties';

export interface EdictFilters {
  page?: number;
  pageSize?: number;
  search?: string;
}

export const edictsService = {
  async getAll(filters: EdictFilters = {}): Promise<PaginatedResponse<Edict>> {
    const { page = 1, pageSize = 20 } = filters;

    if (config.useMock.edicts) {
      await new Promise((resolve) => setTimeout(resolve, 100));

      const startIndex = (page - 1) * pageSize;
      const data = mockEdicts.slice(startIndex, startIndex + pageSize);

      return { data, total: mockEdicts.length, page, pageSize };
    }

    const params = new URLSearchParams();
    if (filters.page) params.set('page', filters.page.toString());
    if (filters.pageSize) params.set('pageSize', filters.pageSize.toString());
    if (filters.search) params.set('search', filters.search);

    const queryString = params.toString();
    return apiClient.get<PaginatedResponse<Edict>>(`/edicts${queryString ? `?${queryString}` : ''}`);
  },

  async getById(id: string): Promise<Edict | null> {
    if (config.useMock.edicts) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return mockEdicts.find((e) => e.id === id) || null;
    }

    return apiClient.get<Edict>(`/edicts/${id}`);
  },

  async create(data: Partial<Edict>): Promise<Edict> {
    if (config.useMock.edicts) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return { ...data, id: crypto.randomUUID() } as Edict;
    }

    return apiClient.post<Edict>('/edicts', data);
  },

  async update(id: string, data: Partial<Edict>): Promise<Edict> {
    if (config.useMock.edicts) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const existing = mockEdicts.find((e) => e.id === id);
      return { ...existing, ...data } as Edict;
    }

    return apiClient.put<Edict>(`/edicts/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    if (config.useMock.edicts) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return;
    }

    return apiClient.delete(`/edicts/${id}`);
  },
};