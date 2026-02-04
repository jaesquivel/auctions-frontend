'use client';

import { useUser } from '@clerk/nextjs';

export type UserRole = 'ADMIN' | 'MANAGER' | 'USER';

interface UseUserRoleReturn {
  role: UserRole;
  isAdmin: boolean;
  isManager: boolean;
  canManageTags: boolean;
  isLoading: boolean;
}

export function useUserRole(): UseUserRoleReturn {
  const { user, isLoaded } = useUser();

  const role = (user?.publicMetadata?.role as UserRole) || 'USER';
  const isAdmin = role === 'ADMIN';
  const isManager = role === 'MANAGER';
  const canManageTags = isAdmin || isManager;

  return {
    role,
    isAdmin,
    isManager,
    canManageTags,
    isLoading: !isLoaded,
  };
}