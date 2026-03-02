import { config } from '@/lib/config';
import { apiClient } from '@/lib/api-client';
import { uuid } from '@/lib/utils';
import type { PropertyTag } from '@/types';

export const tagsService = {
  async getAll(): Promise<PropertyTag[]> {

    return apiClient.get<PropertyTag[]>('/properties-tags');
  },

  async getById(id: string): Promise<PropertyTag | null> {

    return apiClient.get<PropertyTag>(`/properties-tags/${id}`);
  },

  async create(data: Partial<PropertyTag>): Promise<PropertyTag> {

    return apiClient.post<PropertyTag>('/properties-tags', data);
  },

  async update(id: string, data: Partial<PropertyTag>): Promise<PropertyTag> {

    return apiClient.put<PropertyTag>(`/properties-tags/${id}`, data);
  },

  async delete(id: string): Promise<void> {

    return apiClient.delete(`/properties-tags/${id}`);
  },
};