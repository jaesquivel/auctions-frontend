import { config } from '@/lib/config';
import { apiClient } from '@/lib/api-client';
import { uuid } from '@/lib/utils';
import type { Property, PropertyListItem, PropertyCreateRequest, PropertyUpdateRequest, SpringPage, PropertyImage } from '@/types';
import { buildSearchRequest } from '@/components/data-grid';
import type { FilterState } from '@/components/data-grid';

export interface PropertyFilters {
  page?: number;  // 0-indexed
  size?: number;
  sort?: string[];
  filters?: FilterState;
}

export const propertiesService = {
  async getAll(filters: PropertyFilters = {}): Promise<SpringPage<PropertyListItem>> {
    const { page = 0, size = 20 } = filters;

    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('size', size.toString());
    filters.sort?.forEach((s) => params.append('sort', s));

    const body = buildSearchRequest(filters.filters);
    return apiClient.post<SpringPage<PropertyListItem>>(`/properties/search?${params.toString()}`, body);
  },

  async getById(id: string): Promise<Property | null> {

    return apiClient.get<Property>(`/properties/${id}`);
  },

  async create(data: PropertyCreateRequest): Promise<Property> {

    return apiClient.post<Property>('/properties', data);
  },

  async update(id: string, data: PropertyUpdateRequest): Promise<Property> {

    return apiClient.put<Property>(`/properties/${id}`, data);
  },

  async delete(id: string): Promise<void> {

    return apiClient.delete(`/properties/${id}`);
  },

  async uploadImage(propertyId: string, file: File): Promise<PropertyImage> {

    const formData = new FormData();
    formData.append('file', file);
    return apiClient.postFile<PropertyImage>(`/properties/${propertyId}/images`, formData);
  },

  async getImageUrl(propertyId: string, imageId: string): Promise<string> {

    return apiClient.getBlob(`/properties/${propertyId}/images/${imageId}`);
  },

  async deleteImage(propertyId: string, imageId: string): Promise<void> {

    return apiClient.delete(`/properties/${propertyId}/images/${imageId}`);
  },
};