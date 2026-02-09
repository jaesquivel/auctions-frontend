'use client';

import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OPERATORS_BY_TYPE } from './filter-types';
import { FilterValueInput } from './FilterValueInput';
import type { FilterCondition, FilterableColumnDef, FilterOperator } from './filter-types';

interface FilterConditionRowProps {
  condition: FilterCondition;
  columns: FilterableColumnDef[];
  onChange: (updated: FilterCondition) => void;
  onRemove: () => void;
}

export function FilterConditionRow({ condition, columns, onChange, onRemove }: FilterConditionRowProps) {
  const t = useTranslations('common.filters');

  const selectedColumn = columns.find((c) => c.id === condition.field);
  const filterType = selectedColumn?.filterType ?? 'text';
  const operators = OPERATORS_BY_TYPE[filterType];

  const handleFieldChange = (field: string) => {
    const col = columns.find((c) => c.id === field);
    const type = col?.filterType ?? 'text';
    const firstOp = OPERATORS_BY_TYPE[type][0];
    onChange({ ...condition, field, operator: firstOp, value: '' });
  };

  const handleOperatorChange = (operator: string) => {
    onChange({ ...condition, operator: operator as FilterOperator, value: '' });
  };

  const handleValueChange = (value: string | number | boolean) => {
    onChange({ ...condition, value });
  };

  return (
    <div className="flex items-start gap-1.5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5 flex-1 min-w-0">
        <Select value={condition.field || undefined} onValueChange={handleFieldChange}>
          <SelectTrigger className="h-7 text-xs min-w-0">
            <SelectValue placeholder={t('selectColumn')} />
          </SelectTrigger>
          <SelectContent>
            {columns.map((col) => (
              <SelectItem key={col.id} value={col.id}>
                {col.header}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={condition.field ? condition.operator : undefined}
          onValueChange={handleOperatorChange}
          disabled={!condition.field}
        >
          <SelectTrigger className="h-7 text-xs min-w-0">
            <SelectValue placeholder={t('selectOperator')} />
          </SelectTrigger>
          <SelectContent>
            {operators.map((op) => (
              <SelectItem key={op} value={op}>
                {t(`operators.${op}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {condition.field && (
          <FilterValueInput
            filterType={filterType}
            operator={condition.operator}
            value={condition.value}
            onChange={handleValueChange}
          />
        )}
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7 shrink-0"
        onClick={onRemove}
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}