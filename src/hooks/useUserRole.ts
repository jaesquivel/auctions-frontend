'use client';

import { useUser } from '@clerk/nextjs';

export type UserRole = 'ADMIN' | 'USER';

interface UseUserRoleReturn {
  role: UserRole;
  isAdmin: boolean;
  isLoading: boolean;
}

export function useUserRole(): UseUserRoleReturn {
  const { user, isLoaded } = useUser();

  const role = (user?.publicMetadata?.role as UserRole) || 'USER';
  const isAdmin = role === 'ADMIN';

  return {
    role,
    isAdmin,
    isLoading: !isLoaded,
  };
}