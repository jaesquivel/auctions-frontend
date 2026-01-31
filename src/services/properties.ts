import { config } from '@/lib/config';
import { apiClient } from '@/lib/api-client';
import { mockProperties } from '@/mocks';
import type { PropertySummary } from '@/types';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface PropertyFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  tags?: string[];
}

export const propertiesService = {
  async getAll(filters: PropertyFilters = {}): Promise<PaginatedResponse<PropertySummary>> {
    const { page = 1, pageSize = 20 } = filters;

    if (config.useMock.properties) {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 100));

      const startIndex = (page - 1) * pageSize;
      const data = mockProperties.slice(startIndex, startIndex + pageSize);

      return {
        data,
        total: mockProperties.length,
        page,
        pageSize,
      };
    }

    const params = new URLSearchParams();
    if (filters.page) params.set('page', filters.page.toString());
    if (filters.pageSize) params.set('pageSize', filters.pageSize.toString());
    if (filters.search) params.set('search', filters.search);
    if (filters.tags?.length) params.set('tags', filters.tags.join(','));

    const queryString = params.toString();
    const endpoint = `/properties${queryString ? `?${queryString}` : ''}`;

    return apiClient.get<PaginatedResponse<PropertySummary>>(endpoint);
  },

  async getById(id: string): Promise<PropertySummary | null> {
    if (config.useMock.properties) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return mockProperties.find((p) => p.id === id) || null;
    }

    return apiClient.get<PropertySummary>(`/properties/${id}`);
  },

  async create(data: Partial<PropertySummary>): Promise<PropertySummary> {
    if (config.useMock.properties) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const newProperty = { ...data, id: crypto.randomUUID() } as PropertySummary;
      return newProperty;
    }

    return apiClient.post<PropertySummary>('/properties', data);
  },

  async update(id: string, data: Partial<PropertySummary>): Promise<PropertySummary> {
    if (config.useMock.properties) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const existing = mockProperties.find((p) => p.id === id);
      return { ...existing, ...data } as PropertySummary;
    }

    return apiClient.put<PropertySummary>(`/properties/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    if (config.useMock.properties) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return;
    }

    return apiClient.delete(`/properties/${id}`);
  },
};