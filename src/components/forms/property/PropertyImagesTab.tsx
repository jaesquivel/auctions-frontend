'use client';

import { useTranslations } from 'next-intl';
import type { Property } from '@/types';

interface PropertyImagesTabProps {
  property?: Property | null;
}

export function PropertyImagesTab({ property }: PropertyImagesTabProps) {
  const t = useTranslations('properties.form');
  const images = property?.images ?? [];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {images.length === 0 && (
        <p className="text-sm text-muted-foreground py-4 col-span-full">{t('noImages')}</p>
      )}
      {images.map((image) => (
        <div key={image.id} className="rounded-md border overflow-hidden">
          {image.thumbnailUrl ? (
            <img
              src={image.thumbnailUrl}
              alt={image.name}
              className="w-full h-32 object-cover"
            />
          ) : (
            <div className="w-full h-32 bg-muted flex items-center justify-center text-xs text-muted-foreground">
              {image.mimeType}
            </div>
          )}
          <p className="px-2 py-1 text-xs truncate text-muted-foreground">{image.name}</p>
        </div>
      ))}
    </div>
  );
}
