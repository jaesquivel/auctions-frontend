import { config } from '@/lib/config';
import { apiClient } from '@/lib/api-client';
import { mockProperties } from '@/mocks';
import type { PropertySummary, SpringPage } from '@/types';

export interface PropertyFilters {
  page?: number;  // 0-indexed
  size?: number;
  sort?: string;
  search?: string;
  tags?: string[];
}

export const propertiesService = {
  async getAll(filters: PropertyFilters = {}): Promise<SpringPage<PropertySummary>> {
    const { page = 0, size = 20 } = filters;

    if (config.useMock.properties) {
      await new Promise((resolve) => setTimeout(resolve, 100));

      const startIndex = page * size;
      const content = mockProperties.slice(startIndex, startIndex + size);
      const totalElements = mockProperties.length;
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
    if (filters.search) params.set('search', filters.search);
    if (filters.tags?.length) params.set('tags', filters.tags.join(','));

    return apiClient.get<SpringPage<PropertySummary>>(`/properties?${params.toString()}`);
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