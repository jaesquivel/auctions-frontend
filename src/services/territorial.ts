import { config } from '@/lib/config';
import { apiClient } from '@/lib/api-client';
import { uuid } from '@/lib/utils';
import { mockTdProvinces, mockTdCantons, mockTdDistricts } from '@/mocks';
import type { TdProvince, TdCanton, TdDistrict } from '@/types';

export const territorialService = {
  // TdProvinces
  async getTdProvinces(): Promise<TdProvince[]> {
    if (config.useMock.territorial) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return mockTdProvinces;
    }

    return apiClient.get<TdProvince[]>('/td-provinces');
  },

  async getTdProvinceById(id: string): Promise<TdProvince | null> {
    if (config.useMock.territorial) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return mockTdProvinces.find((p) => p.id === id) || null;
    }

    return apiClient.get<TdProvince>(`/td-provinces/${id}`);
  },

  async createTdProvince(data: Partial<TdProvince>): Promise<TdProvince> {
    if (config.useMock.territorial) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return { ...data, id: uuid() } as TdProvince;
    }

    return apiClient.post<TdProvince>('/td-provinces', data);
  },

  async updateTdProvince(id: string, data: Partial<TdProvince>): Promise<TdProvince> {
    if (config.useMock.territorial) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const existing = mockTdProvinces.find((p) => p.id === id);
      return { ...existing, ...data } as TdProvince;
    }

    return apiClient.put<TdProvince>(`/td-provinces/${id}`, data);
  },

  async deleteTdProvince(id: string): Promise<void> {
    if (config.useMock.territorial) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return;
    }

    return apiClient.delete(`/td-provinces/${id}`);
  },

  // TdCantons
  async getTdCantons(tdProvinceId?: string): Promise<TdCanton[]> {
    if (config.useMock.territorial) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      if (tdProvinceId) {
        return mockTdCantons.filter((c) => c.tdProvinceId === tdProvinceId);
      }
      return mockTdCantons;
    }

    const endpoint = tdProvinceId ? `/td-provinces/${tdProvinceId}/td-cantons` : '/td-cantons';
    return apiClient.get<TdCanton[]>(endpoint);
  },

  async getTdCantonById(id: string): Promise<TdCanton | null> {
    if (config.useMock.territorial) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return mockTdCantons.find((c) => c.id === id) || null;
    }

    return apiClient.get<TdCanton>(`/td-cantons/${id}`);
  },

  async createTdCanton(data: Partial<TdCanton>): Promise<TdCanton> {
    if (config.useMock.territorial) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return { ...data, id: uuid() } as TdCanton;
    }

    return apiClient.post<TdCanton>('/td-cantons', data);
  },

  async updateTdCanton(id: string, data: Partial<TdCanton>): Promise<TdCanton> {
    if (config.useMock.territorial) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const existing = mockTdCantons.find((c) => c.id === id);
      return { ...existing, ...data } as TdCanton;
    }

    return apiClient.put<TdCanton>(`/td-cantons/${id}`, data);
  },

  async deleteTdCanton(id: string): Promise<void> {
    if (config.useMock.territorial) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return;
    }

    return apiClient.delete(`/td-cantons/${id}`);
  },

  // TdDistricts
  async getTdDistricts(tdCantonId?: string): Promise<TdDistrict[]> {
    if (config.useMock.territorial) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      if (tdCantonId) {
        return mockTdDistricts.filter((d) => d.tdCantonId === tdCantonId);
      }
      return mockTdDistricts;
    }

    const endpoint = tdCantonId ? `/td-cantons/${tdCantonId}/td-districts` : '/td-districts';
    return apiClient.get<TdDistrict[]>(endpoint);
  },

  async getTdDistrictById(id: string): Promise<TdDistrict | null> {
    if (config.useMock.territorial) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return mockTdDistricts.find((d) => d.id === id) || null;
    }

    return apiClient.get<TdDistrict>(`/td-districts/${id}`);
  },

  async createTdDistrict(data: Partial<TdDistrict>): Promise<TdDistrict> {
    if (config.useMock.territorial) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return { ...data, id: uuid() } as TdDistrict;
    }

    return apiClient.post<TdDistrict>('/td-districts', data);
  },

  async updateTdDistrict(id: string, data: Partial<TdDistrict>): Promise<TdDistrict> {
    if (config.useMock.territorial) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const existing = mockTdDistricts.find((d) => d.id === id);
      return { ...existing, ...data } as TdDistrict;
    }

    return apiClient.put<TdDistrict>(`/td-districts/${id}`, data);
  },

  async deleteTdDistrict(id: string): Promise<void> {
    if (config.useMock.territorial) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return;
    }

    return apiClient.delete(`/td-districts/${id}`);
  },
};