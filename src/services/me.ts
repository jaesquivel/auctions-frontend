import { apiClient } from '@/lib/api-client';

export interface UserMe {
  id: string;
  email: string;
  roles: string[];
  permissions: Record<string, boolean>;
}

export const meService = {
  async getMe(): Promise<UserMe> {
    return apiClient.get<UserMe>('/me');
  },
};
