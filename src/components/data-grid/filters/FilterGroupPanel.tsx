'use client';

import { useTranslations } from 'next-intl';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FilterConditionRow } from './FilterConditionRow';
import { FilterJoinToggle } from './FilterJoinToggle';
import { createEmptyCondition } from './filter-utils';
import type { FilterCondition, FilterGroup, FilterableColumnDef } from './filter-types';

interface FilterGroupPanelProps {
  group: FilterGroup;
  columns: FilterableColumnDef[];
  onChange: (updated: FilterGroup) => void;
  onRemove: () => void;
  showRemove: boolean;
}

export function FilterGroupPanel({ group, columns, onChange, onRemove, showRemove }: FilterGroupPanelProps) {
  const t = useTranslations('common.filters');

  const handleConditionChange = (index: number, updated: FilterCondition) => {
    const conditions = [...group.conditions];
    conditions[index] = updated;
    onChange({ ...group, conditions });
  };

  const handleConditionRemove = (index: number) => {
    const conditions = group.conditions.filter((_, i) => i !== index);
    if (conditions.length === 0) {
      conditions.push(createEmptyCondition(columns[0]?.id));
    }
    onChange({ ...group, conditions });
  };

  const handleAddCondition = () => {
    onChange({
      ...group,
      conditions: [...group.conditions, createEmptyCondition(columns[0]?.id)],
    });
  };

  return (
    <div className="rounded-md border border-border p-3 space-y-2">
      <div className="flex items-center justify-between">
        <FilterJoinToggle
          value={group.joinOperator}
          onChange={(joinOperator) => onChange({ ...group, joinOperator })}
        />
        {showRemove && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onRemove}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      <div className="space-y-1.5">
        {group.conditions.map((condition, index) => (
          <FilterConditionRow
            key={condition.id}
            condition={condition}
            columns={columns}
            onChange={(updated) => handleConditionChange(index, updated)}
            onRemove={() => handleConditionRemove(index)}
          />
        ))}
      </div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-7 text-xs"
        onClick={handleAddCondition}
      >
        <Plus className="h-3.5 w-3.5 mr-1" />
        {t('addCondition')}
      </Button>
    </div>
  );
}