import { config } from '@/lib/config';
import { apiClient } from '@/lib/api-client';
import { mockVehicles } from '@/mocks';
import type { VehicleSummary } from '@/types';
import type { PaginatedResponse } from './properties';

export interface VehicleFilters {
  page?: number;
  pageSize?: number;
  search?: string;
}

export const vehiclesService = {
  async getAll(filters: VehicleFilters = {}): Promise<PaginatedResponse<VehicleSummary>> {
    const { page = 1, pageSize = 20 } = filters;

    if (config.USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 100));

      const startIndex = (page - 1) * pageSize;
      const data = mockVehicles.slice(startIndex, startIndex + pageSize);

      return { data, total: mockVehicles.length, page, pageSize };
    }

    const params = new URLSearchParams();
    if (filters.page) params.set('page', filters.page.toString());
    if (filters.pageSize) params.set('pageSize', filters.pageSize.toString());
    if (filters.search) params.set('search', filters.search);

    const queryString = params.toString();
    return apiClient.get<PaginatedResponse<VehicleSummary>>(`/vehicles${queryString ? `?${queryString}` : ''}`);
  },

  async getById(id: string): Promise<VehicleSummary | null> {
    if (config.USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return mockVehicles.find((v) => v.id === id) || null;
    }

    return apiClient.get<VehicleSummary>(`/vehicles/${id}`);
  },

  async create(data: Partial<VehicleSummary>): Promise<VehicleSummary> {
    if (config.USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return { ...data, id: crypto.randomUUID() } as VehicleSummary;
    }

    return apiClient.post<VehicleSummary>('/vehicles', data);
  },

  async update(id: string, data: Partial<VehicleSummary>): Promise<VehicleSummary> {
    if (config.USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const existing = mockVehicles.find((v) => v.id === id);
      return { ...existing, ...data } as VehicleSummary;
    }

    return apiClient.put<VehicleSummary>(`/vehicles/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    if (config.USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return;
    }

    return apiClient.delete(`/vehicles/${id}`);
  },
};