'use client';

import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';
import { subscribeApiStatus, getApiAvailable } from '@/lib/api-status';

export function ApiUnavailableOverlay() {
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    // Get initial state
    setIsAvailable(getApiAvailable());

    // Subscribe to changes
    const unsubscribe = subscribeApiStatus(setIsAvailable);
    return unsubscribe;
  }, []);

  if (isAvailable) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 p-8 rounded-lg bg-card border border-border shadow-lg max-w-md text-center">
        <WifiOff className="h-12 w-12 text-destructive" />
        <div>
          <h2 className="text-xl font-semibold mb-2">Servidor no disponible</h2>
          <p className="text-muted-foreground">
            No se puede conectar con el servidor. Por favor, verifique su conexión e intente nuevamente.
          </p>
        </div>
      </div>
    </div>
  );
}