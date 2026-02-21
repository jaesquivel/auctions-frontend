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
      <p className="text-sm text-muted-foreground">{t('rnpPlanUpdated')}: {formatDate(property?.rnpPlanUpdated)}</p>
      <div
        className="prose prose-lg dark:prose-invert max-w-none rounded-md border p-4 overflow-auto min-h-16"
        dangerouslySetInnerHTML={{ __html: property?.rnpPlan ?? '' }}
      />
    </div>
  );
}
