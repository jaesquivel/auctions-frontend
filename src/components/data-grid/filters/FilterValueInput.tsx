'use client';

import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { NO_VALUE_OPERATORS } from './filter-types';
import type { ColumnFilterType, FilterOperator } from './filter-types';

interface FilterValueInputProps {
  filterType: ColumnFilterType;
  operator: FilterOperator;
  value: string | number | boolean;
  onChange: (value: string | number | boolean) => void;
}

export function FilterValueInput({ filterType, operator, value, onChange }: FilterValueInputProps) {
  const t = useTranslations('common.filters');

  if (NO_VALUE_OPERATORS.includes(operator)) {
    return null;
  }

  const inputType = filterType === 'number' ? 'number' : filterType === 'date' ? 'date' : 'text';

  return (
    <Input
      type={inputType}
      value={value as string | number}
      onChange={(e) => onChange(inputType === 'number' ? Number(e.target.value) : e.target.value)}
      placeholder={t('enterValue')}
      className="h-7 text-xs"
    />
  );
}