'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useAuth } from '@clerk/nextjs';
import { meService, type UserMe } from '@/services/me';

interface PermissionsContextValue {
  me: UserMe | null;
  isLoading: boolean;
  can: (permission: string) => boolean;
  refresh: () => Promise<void>;
}

const PermissionsContext = createContext<PermissionsContextValue>({
  me: null,
  isLoading: true,
  can: () => false,
  refresh: async () => {},
});

export function PermissionsProvider({ children }: { children: ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();
  const [me, setMe] = useState<UserMe | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      const data = await meService.getMe();
      setMe(data);
    } catch (error) {
      console.error('Failed to fetch user permissions:', error);
      setMe(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn) {
      fetchMe();
    } else {
      setMe(null);
      setIsLoading(false);
    }
  }, [isSignedIn, isLoaded, fetchMe]);

  const can = useCallback(
    (permission: string): boolean => me?.permissions[permission] ?? false,
    [me],
  );

  return (
    <PermissionsContext.Provider value={{ me, isLoading, can, refresh: fetchMe }}>
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissions() {
  return useContext(PermissionsContext);
}
