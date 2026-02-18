'use client';

import { useTranslations } from 'next-intl';
import { formatDate } from '@/lib/formatters';
import type { Property } from '@/types';

interface PropertyRegistryPlanTabProps {
  property?: Property | null;
}

export function PropertyRegistryPlanTab({ property }: PropertyRegistryPlanTabProps) {
  const t = useTranslations('properties.form');

  return (
    <div className="space-y-3">
      {property?.rnpPlanUpdated && (
        <p className="text-xs text-muted-foreground">{t('rnpPlanUpdated')}: {formatDate(property.rnpPlanUpdated)}</p>
      )}
      {property?.rnpPlan ? (
        <div
          className="prose dark:prose-invert max-w-none rounded-md border p-4 overflow-auto"
          dangerouslySetInnerHTML={{ __html: property.rnpPlan }}
        />
      ) : (
        <p className="text-sm text-muted-foreground">{t('noData')}</p>
      )}
    </div>
  );
}
