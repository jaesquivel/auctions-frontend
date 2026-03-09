'use client';

import { useTranslations } from 'next-intl';
import { formatTimestamp } from '@/lib/formatters';
import type { Property } from '@/types';

interface PropertyRegistryTabProps {
  property?: Property | null;
}

export function PropertyRegistryTab({ property }: PropertyRegistryTabProps) {
  const t = useTranslations('properties.form');

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">{t('rnpCertUpdated')}: {formatTimestamp(property?.rnpCertUpdated)}</p>
      <div
        className="prose prose-lg dark:prose-invert max-w-none rounded-md border p-4 overflow-auto min-h-16"
        dangerouslySetInnerHTML={{ __html: property?.rnpCert ?? '' }}
      />
    </div>
  );
}
