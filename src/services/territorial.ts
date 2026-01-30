import { config } from '@/lib/config';
import { apiClient } from '@/lib/api-client';
import { mockProvinces, mockCantons, mockDistricts } from '@/mocks';
import type { GeoProvince, GeoCanton, GeoDistrict } from '@/types';

export const territorialService = {
  // Provinces
  async getProvinces(): Promise<GeoProvince[]> {
    if (config.USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return mockProvinces;
    }

    return apiClient.get<GeoProvince[]>('/geo/provinces');
  },

  async getProvinceById(id: string): Promise<GeoProvince | null> {
    if (config.USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return mockProvinces.find((p) => p.id === id) || null;
    }

    return apiClient.get<GeoProvince>(`/geo/provinces/${id}`);
  },

  async createProvince(data: Partial<GeoProvince>): Promise<GeoProvince> {
    if (config.USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return { ...data, id: crypto.randomUUID() } as GeoProvince;
    }

    return apiClient.post<GeoProvince>('/geo/provinces', data);
  },

  async updateProvince(id: string, data: Partial<GeoProvince>): Promise<GeoProvince> {
    if (config.USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const existing = mockProvinces.find((p) => p.id === id);
      return { ...existing, ...data } as GeoProvince;
    }

    return apiClient.put<GeoProvince>(`/geo/provinces/${id}`, data);
  },

  async deleteProvince(id: string): Promise<void> {
    if (config.USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return;
    }

    return apiClient.delete(`/geo/provinces/${id}`);
  },

  // Cantons
  async getCantons(provinceId?: string): Promise<GeoCanton[]> {
    if (config.USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      if (provinceId) {
        return mockCantons.filter((c) => c.provinceId === provinceId);
      }
      return mockCantons;
    }

    const endpoint = provinceId ? `/geo/provinces/${provinceId}/cantons` : '/geo/cantons';
    return apiClient.get<GeoCanton[]>(endpoint);
  },

  async getCantonById(id: string): Promise<GeoCanton | null> {
    if (config.USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return mockCantons.find((c) => c.id === id) || null;
    }

    return apiClient.get<GeoCanton>(`/geo/cantons/${id}`);
  },

  async createCanton(data: Partial<GeoCanton>): Promise<GeoCanton> {
    if (config.USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return { ...data, id: crypto.randomUUID() } as GeoCanton;
    }

    return apiClient.post<GeoCanton>('/geo/cantons', data);
  },

  async updateCanton(id: string, data: Partial<GeoCanton>): Promise<GeoCanton> {
    if (config.USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const existing = mockCantons.find((c) => c.id === id);
      return { ...existing, ...data } as GeoCanton;
    }

    return apiClient.put<GeoCanton>(`/geo/cantons/${id}`, data);
  },

  async deleteCanton(id: string): Promise<void> {
    if (config.USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return;
    }

    return apiClient.delete(`/geo/cantons/${id}`);
  },

  // Districts
  async getDistricts(cantonId?: string): Promise<GeoDistrict[]> {
    if (config.USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      if (cantonId) {
        return mockDistricts.filter((d) => d.cantonId === cantonId);
      }
      return mockDistricts;
    }

    const endpoint = cantonId ? `/geo/cantons/${cantonId}/districts` : '/geo/districts';
    return apiClient.get<GeoDistrict[]>(endpoint);
  },

  async getDistrictById(id: string): Promise<GeoDistrict | null> {
    if (config.USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return mockDistricts.find((d) => d.id === id) || null;
    }

    return apiClient.get<GeoDistrict>(`/geo/districts/${id}`);
  },

  async createDistrict(data: Partial<GeoDistrict>): Promise<GeoDistrict> {
    if (config.USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return { ...data, id: crypto.randomUUID() } as GeoDistrict;
    }

    return apiClient.post<GeoDistrict>('/geo/districts', data);
  },

  async updateDistrict(id: string, data: Partial<GeoDistrict>): Promise<GeoDistrict> {
    if (config.USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const existing = mockDistricts.find((d) => d.id === id);
      return { ...existing, ...data } as GeoDistrict;
    }

    return apiClient.put<GeoDistrict>(`/geo/districts/${id}`, data);
  },

  async deleteDistrict(id: string): Promise<void> {
    if (config.USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return;
    }

    return apiClient.delete(`/geo/districts/${id}`);
  },
};