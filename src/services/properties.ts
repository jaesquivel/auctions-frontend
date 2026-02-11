import { config } from '@/lib/config';
import { apiClient } from '@/lib/api-client';
import { mockProperties } from '@/mocks';
import type { Property, PropertyListItem, PropertyCreateRequest, PropertyUpdateRequest, SpringPage } from '@/types';
import { applyFilterParams } from '@/components/data-grid';
import type { FilterState } from '@/components/data-grid';

export interface PropertyFilters {
  page?: number;  // 0-indexed
  size?: number;
  sort?: string[];
  search?: string;
  tags?: string[];
  filters?: FilterState;
}

export const propertiesService = {
  async getAll(filters: PropertyFilters = {}): Promise<SpringPage<PropertyListItem>> {
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
    filters.sort?.forEach((s) => params.append('sort', s));
    if (filters.search) params.set('search', filters.search);
    if (filters.tags?.length) params.set('tags', filters.tags.join(','));
    applyFilterParams(params, filters.filters);

    return apiClient.get<SpringPage<PropertyListItem>>(`/properties?${params.toString()}`);
  },

  async getById(id: string): Promise<Property | null> {
    if (config.useMock.properties) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return null;
    }

    return apiClient.get<Property>(`/properties/${id}`);
  },

  async create(data: PropertyCreateRequest): Promise<Property> {
    if (config.useMock.properties) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return { ...data, id: crypto.randomUUID() } as unknown as Property;
    }

    return apiClient.post<Property>('/properties', data);
  },

  async update(id: string, data: PropertyUpdateRequest): Promise<Property> {
    if (config.useMock.properties) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return { id, ...data } as unknown as Property;
    }

    return apiClient.put<Property>(`/properties/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    if (config.useMock.properties) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return;
    }

    return apiClient.delete(`/properties/${id}`);
  },
};