import { apiClient } from '@/lib/api-client';
import type { Vehicle, VehicleListItem, VehicleUpdateRequest, SpringPage } from '@/types';
import { buildSearchRequest } from '@/components/data-grid';
import type { FilterState } from '@/components/data-grid';

export interface VehicleFilters {
  page?: number;  // 0-indexed
  size?: number;
  sort?: string[];
  filters?: FilterState;
}

export const vehiclesService = {
  async getAll(filters: VehicleFilters = {}): Promise<SpringPage<VehicleListItem>> {
    const { page = 0, size = 20 } = filters;

    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('size', size.toString());
    filters.sort?.forEach((s) => params.append('sort', s));

    const body = buildSearchRequest(filters.filters);
    return apiClient.post<SpringPage<VehicleListItem>>(`/vehicles/search?${params.toString()}`, body);
  },

  async getById(id: string): Promise<Vehicle | null> {
    return apiClient.get<Vehicle>(`/vehicles/${id}`);
  },

  async update(id: string, data: VehicleUpdateRequest): Promise<Vehicle> {
    return apiClient.put<Vehicle>(`/vehicles/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/vehicles/${id}`);
  },
};
