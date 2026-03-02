import { config } from '@/lib/config';
import { apiClient } from '@/lib/api-client';
import { uuid } from '@/lib/utils';
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

    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('size', size.toString());
    filters.sort?.forEach((s) => params.append('sort', s));
    if (filters.search) params.set('search', filters.search);
    applyFilterParams(params, filters.filters);

    return apiClient.get<SpringPage<VehicleSummary>>(`/vehicles?${params.toString()}`);
  },

  async getById(id: string): Promise<VehicleSummary | null> {

    return apiClient.get<VehicleSummary>(`/vehicles/${id}`);
  },

  async create(data: Partial<VehicleSummary>): Promise<VehicleSummary> {

    return apiClient.post<VehicleSummary>('/vehicles', data);
  },

  async update(id: string, data: Partial<VehicleSummary>): Promise<VehicleSummary> {

    return apiClient.put<VehicleSummary>(`/vehicles/${id}`, data);
  },

  async delete(id: string): Promise<void> {

    return apiClient.delete(`/vehicles/${id}`);
  },
};