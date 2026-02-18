import { config } from '@/lib/config';
import { apiClient } from '@/lib/api-client';
import { uuid } from '@/lib/utils';
import { mockTags } from '@/mocks';
import type { PropertyTag } from '@/types';

export const tagsService = {
  async getAll(): Promise<PropertyTag[]> {
    if (config.useMock.tags) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return mockTags;
    }

    return apiClient.get<PropertyTag[]>('/properties-tags');
  },

  async getById(id: string): Promise<PropertyTag | null> {
    if (config.useMock.tags) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return mockTags.find((t) => t.id === id) || null;
    }

    return apiClient.get<PropertyTag>(`/properties-tags/${id}`);
  },

  async create(data: Partial<PropertyTag>): Promise<PropertyTag> {
    if (config.useMock.tags) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return { ...data, id: uuid(), createdAt: new Date().toISOString() } as PropertyTag;
    }

    return apiClient.post<PropertyTag>('/properties-tags', data);
  },

  async update(id: string, data: Partial<PropertyTag>): Promise<PropertyTag> {
    if (config.useMock.tags) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const existing = mockTags.find((t) => t.id === id);
      return { ...existing, ...data } as PropertyTag;
    }

    return apiClient.put<PropertyTag>(`/properties-tags/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    if (config.useMock.tags) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return;
    }

    return apiClient.delete(`/properties-tags/${id}`);
  },
};