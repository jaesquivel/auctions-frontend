'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

interface FilterJoinToggleProps {
  value: 'and' | 'or';
  onChange: (value: 'and' | 'or') => void;
  labels?: { and: string; or: string };
}

export function FilterJoinToggle({ value, onChange, labels }: FilterJoinToggleProps) {
  const t = useTranslations('common.filters');

  const andLabel = labels?.and ?? t('and');
  const orLabel = labels?.or ?? t('or');

  return (
    <div className="inline-flex rounded-md border border-border">
      <Button
        type="button"
        variant={value === 'and' ? 'default' : 'ghost'}
        size="sm"
        className="h-6 rounded-r-none border-0 px-2 text-xs"
        onClick={() => onChange('and')}
      >
        {andLabel}
      </Button>
      <Button
        type="button"
        variant={value === 'or' ? 'default' : 'ghost'}
        size="sm"
        className="h-6 rounded-l-none border-0 px-2 text-xs"
        onClick={() => onChange('or')}
      >
        {orLabel}
      </Button>
    </div>
  );
}