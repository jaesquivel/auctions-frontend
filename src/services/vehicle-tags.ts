import { apiClient } from '@/lib/api-client';
import type { VehicleTag } from '@/types';

export const vehicleTagsService = {
  async getAll(): Promise<VehicleTag[]> {
    return apiClient.get<VehicleTag[]>('/vehicles-tags');
  },

  async getById(id: string): Promise<VehicleTag | null> {
    return apiClient.get<VehicleTag>(`/vehicles-tags/${id}`);
  },

  async create(data: Partial<VehicleTag>): Promise<VehicleTag> {
    return apiClient.post<VehicleTag>('/vehicles-tags', data);
  },

  async update(id: string, data: Partial<VehicleTag>): Promise<VehicleTag> {
    return apiClient.put<VehicleTag>(`/vehicles-tags/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/vehicles-tags/${id}`);
  },
};
