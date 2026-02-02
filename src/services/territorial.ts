import { config } from '@/lib/config';
import { apiClient } from '@/lib/api-client';
import { mockProvinces, mockCantons, mockDistricts } from '@/mocks';
import type { Province, Canton, District } from '@/types';

export const territorialService = {
  // Provinces
  async getProvinces(): Promise<Province[]> {
    if (config.useMock.territorial) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return mockProvinces;
    }

    return apiClient.get<Province[]>('/provinces');
  },

  async getProvinceById(id: string): Promise<Province | null> {
    if (config.useMock.territorial) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return mockProvinces.find((p) => p.id === id) || null;
    }

    return apiClient.get<Province>(`/provinces/${id}`);
  },

  async createProvince(data: Partial<Province>): Promise<Province> {
    if (config.useMock.territorial) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return { ...data, id: crypto.randomUUID() } as Province;
    }

    return apiClient.post<Province>('/provinces', data);
  },

  async updateProvince(id: string, data: Partial<Province>): Promise<Province> {
    if (config.useMock.territorial) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const existing = mockProvinces.find((p) => p.id === id);
      return { ...existing, ...data } as Province;
    }

    return apiClient.put<Province>(`/provinces/${id}`, data);
  },

  async deleteProvince(id: string): Promise<void> {
    if (config.useMock.territorial) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return;
    }

    return apiClient.delete(`/provinces/${id}`);
  },

  // Cantons
  async getCantons(provinceId?: string): Promise<Canton[]> {
    if (config.useMock.territorial) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      if (provinceId) {
        return mockCantons.filter((c) => c.provinceId === provinceId);
      }
      return mockCantons;
    }

    const endpoint = provinceId ? `/provinces/${provinceId}/cantons` : '/cantons';
    return apiClient.get<Canton[]>(endpoint);
  },

  async getCantonById(id: string): Promise<Canton | null> {
    if (config.useMock.territorial) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return mockCantons.find((c) => c.id === id) || null;
    }

    return apiClient.get<Canton>(`/cantons/${id}`);
  },

  async createCanton(data: Partial<Canton>): Promise<Canton> {
    if (config.useMock.territorial) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return { ...data, id: crypto.randomUUID() } as Canton;
    }

    return apiClient.post<Canton>('/cantons', data);
  },

  async updateCanton(id: string, data: Partial<Canton>): Promise<Canton> {
    if (config.useMock.territorial) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const existing = mockCantons.find((c) => c.id === id);
      return { ...existing, ...data } as Canton;
    }

    return apiClient.put<Canton>(`/cantons/${id}`, data);
  },

  async deleteCanton(id: string): Promise<void> {
    if (config.useMock.territorial) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return;
    }

    return apiClient.delete(`/cantons/${id}`);
  },

  // Districts
  async getDistricts(cantonId?: string): Promise<District[]> {
    if (config.useMock.territorial) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      if (cantonId) {
        return mockDistricts.filter((d) => d.cantonId === cantonId);
      }
      return mockDistricts;
    }

    const endpoint = cantonId ? `/cantons/${cantonId}/districts` : '/districts';
    return apiClient.get<District[]>(endpoint);
  },

  async getDistrictById(id: string): Promise<District | null> {
    if (config.useMock.territorial) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return mockDistricts.find((d) => d.id === id) || null;
    }

    return apiClient.get<District>(`/districts/${id}`);
  },

  async createDistrict(data: Partial<District>): Promise<District> {
    if (config.useMock.territorial) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return { ...data, id: crypto.randomUUID() } as District;
    }

    return apiClient.post<District>('/districts', data);
  },

  async updateDistrict(id: string, data: Partial<District>): Promise<District> {
    if (config.useMock.territorial) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const existing = mockDistricts.find((d) => d.id === id);
      return { ...existing, ...data } as District;
    }

    return apiClient.put<District>(`/districts/${id}`, data);
  },

  async deleteDistrict(id: string): Promise<void> {
    if (config.useMock.territorial) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return;
    }

    return apiClient.delete(`/districts/${id}`);
  },
};