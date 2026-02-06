'use client';

import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { NO_VALUE_OPERATORS, RANGE_OPERATORS } from './filter-types';
import type { ColumnFilterType, FilterOperator } from './filter-types';

interface FilterValueInputProps {
  filterType: ColumnFilterType;
  operator: FilterOperator;
  value: string | number | boolean;
  valueTo?: string | number;
  onChange: (value: string | number | boolean, valueTo?: string | number) => void;
}

export function FilterValueInput({ filterType, operator, value, valueTo, onChange }: FilterValueInputProps) {
  const t = useTranslations('common.filters');

  if (NO_VALUE_OPERATORS.includes(operator)) {
    return null;
  }

  const isRange = RANGE_OPERATORS.includes(operator);
  const inputType = filterType === 'number' ? 'number' : filterType === 'date' ? 'date' : 'text';

  if (isRange) {
    return (
      <div className="flex items-center gap-1">
        <Input
          type={inputType}
          value={value as string | number}
          onChange={(e) => onChange(inputType === 'number' ? Number(e.target.value) : e.target.value, valueTo)}
          placeholder={t('from')}
          className="h-7 w-28 text-xs"
        />
        <Input
          type={inputType}
          value={(valueTo ?? '') as string | number}
          onChange={(e) => onChange(value, inputType === 'number' ? Number(e.target.value) : e.target.value)}
          placeholder={t('to')}
          className="h-7 w-28 text-xs"
        />
      </div>
    );
  }

  return (
    <Input
      type={inputType}
      value={value as string | number}
      onChange={(e) => onChange(inputType === 'number' ? Number(e.target.value) : e.target.value)}
      placeholder={t('enterValue')}
      className="h-7 w-40 text-xs"
    />
  );
}