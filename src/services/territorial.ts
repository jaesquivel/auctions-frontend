import { config } from '@/lib/config';
import { apiClient } from '@/lib/api-client';
import { uuid } from '@/lib/utils';
import type { TdProvince, TdCanton, TdDistrict } from '@/types';

export const territorialService = {
  // TdProvinces
  async getTdProvinces(): Promise<TdProvince[]> {

    return apiClient.get<TdProvince[]>('/td-provinces');
  },

  async getTdProvinceById(id: string): Promise<TdProvince | null> {

    return apiClient.get<TdProvince>(`/td-provinces/${id}`);
  },

  async createTdProvince(data: Partial<TdProvince>): Promise<TdProvince> {

    return apiClient.post<TdProvince>('/td-provinces', data);
  },

  async updateTdProvince(id: string, data: Partial<TdProvince>): Promise<TdProvince> {

    return apiClient.put<TdProvince>(`/td-provinces/${id}`, data);
  },

  async deleteTdProvince(id: string): Promise<void> {

    return apiClient.delete(`/td-provinces/${id}`);
  },

  // TdCantons
  async getTdCantons(tdProvinceId?: string): Promise<TdCanton[]> {

    const endpoint = tdProvinceId ? `/td-provinces/${tdProvinceId}/td-cantons` : '/td-cantons';
    return apiClient.get<TdCanton[]>(endpoint);
  },

  async getTdCantonById(id: string): Promise<TdCanton | null> {

    return apiClient.get<TdCanton>(`/td-cantons/${id}`);
  },

  async createTdCanton(data: Partial<TdCanton>): Promise<TdCanton> {

    return apiClient.post<TdCanton>('/td-cantons', data);
  },

  async updateTdCanton(id: string, data: Partial<TdCanton>): Promise<TdCanton> {

    return apiClient.put<TdCanton>(`/td-cantons/${id}`, data);
  },

  async deleteTdCanton(id: string): Promise<void> {

    return apiClient.delete(`/td-cantons/${id}`);
  },

  // TdDistricts
  async getTdDistricts(tdCantonId?: string): Promise<TdDistrict[]> {

    const endpoint = tdCantonId ? `/td-cantons/${tdCantonId}/td-districts` : '/td-districts';
    return apiClient.get<TdDistrict[]>(endpoint);
  },

  async getTdDistrictById(id: string): Promise<TdDistrict | null> {

    return apiClient.get<TdDistrict>(`/td-districts/${id}`);
  },

  async createTdDistrict(data: Partial<TdDistrict>): Promise<TdDistrict> {

    return apiClient.post<TdDistrict>('/td-districts', data);
  },

  async updateTdDistrict(id: string, data: Partial<TdDistrict>): Promise<TdDistrict> {

    return apiClient.put<TdDistrict>(`/td-districts/${id}`, data);
  },

  async deleteTdDistrict(id: string): Promise<void> {

    return apiClient.delete(`/td-districts/${id}`);
  },
};