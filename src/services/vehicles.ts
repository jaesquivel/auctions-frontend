import { config } from '@/lib/config';
import { apiClient } from '@/lib/api-client';
import { mockVehicles } from '@/mocks';
import type { VehicleSummary, SpringPage } from '@/types';
import { applyFilterParams } from '@/components/data-grid';
import type { FilterState } from '@/components/data-grid';

export interface VehicleFilters {
  page?: number;  // 0-indexed
  size?: number;
  sort?: string[];
  search?: string;
  filters?: FilterState;
}

export const vehiclesService = {
  async getAll(filters: VehicleFilters = {}): Promise<SpringPage<VehicleSummary>> {
    const { page = 0, size = 20 } = filters;

    if (config.useMock.vehicles) {
      await new Promise((resolve) => setTimeout(resolve, 100));

      const startIndex = page * size;
      const content = mockVehicles.slice(startIndex, startIndex + size);
      const totalElements = mockVehicles.length;
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
    applyFilterParams(params, filters.filters);

    return apiClient.get<SpringPage<VehicleSummary>>(`/vehicles?${params.toString()}`);
  },

  async getById(id: string): Promise<VehicleSummary | null> {
    if (config.useMock.vehicles) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return mockVehicles.find((v) => v.id === id) || null;
    }

    return apiClient.get<VehicleSummary>(`/vehicles/${id}`);
  },

  async create(data: Partial<VehicleSummary>): Promise<VehicleSummary> {
    if (config.useMock.vehicles) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return { ...data, id: crypto.randomUUID() } as VehicleSummary;
    }

    return apiClient.post<VehicleSummary>('/vehicles', data);
  },

  async update(id: string, data: Partial<VehicleSummary>): Promise<VehicleSummary> {
    if (config.useMock.vehicles) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const existing = mockVehicles.find((v) => v.id === id);
      return { ...existing, ...data } as VehicleSummary;
    }

    return apiClient.put<VehicleSummary>(`/vehicles/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    if (config.useMock.vehicles) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return;
    }

    return apiClient.delete(`/vehicles/${id}`);
  },
};