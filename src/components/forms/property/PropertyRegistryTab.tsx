'use client';

import { useTranslations } from 'next-intl';
import { formatDate } from '@/lib/formatters';
import type { Property } from '@/types';

interface PropertyRegistryTabProps {
  property?: Property | null;
}

export function PropertyRegistryTab({ property }: PropertyRegistryTabProps) {
  const t = useTranslations('properties.form');

  return (
    <div className="space-y-3">
      {property?.rnpCertUpdated && (
        <p className="text-xs text-muted-foreground">{t('rnpCertUpdated')}: {formatDate(property.rnpCertUpdated)}</p>
      )}
      {property?.rnpCert ? (
        <div
          className="prose prose-sm dark:prose-invert max-w-none rounded-md border p-4 overflow-auto"
          dangerouslySetInnerHTML={{ __html: property.rnpCert }}
        />
      ) : (
        <p className="text-sm text-muted-foreground">{t('noData')}</p>
      )}
    </div>
  );
}
