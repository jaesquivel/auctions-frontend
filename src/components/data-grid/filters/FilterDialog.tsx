'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { FilterConditionRow } from './FilterConditionRow';
import { FilterGroupPanel } from './FilterGroupPanel';
import { FilterJoinToggle } from './FilterJoinToggle';
import { useFilterState } from './useFilterState';
import { createEmptyCondition } from './filter-utils';
import type { FilterState, FilterableColumnDef } from './filter-types';

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  columns: FilterableColumnDef[];
  initialState: FilterState | undefined;
  onApply: (state: FilterState) => void;
  mode: 'simple' | 'advanced';
}

export function FilterDialog({ open, onOpenChange, columns, initialState, onApply, mode }: FilterDialogProps) {
  const t = useTranslations('common.filters');
  const { state, setJoinOperator, addGroup, removeGroup, updateGroup, clearAll, reset } = useFilterState(initialState);

  useEffect(() => {
    if (open) {
      reset(initialState);
    }
  }, [open, initialState, reset]);

  const handleApply = () => {
    onApply(state);
    onOpenChange(false);
  };

  const handleClear = () => {
    clearAll();
    onApply({ groups: [], joinOperator: 'and' });
    onOpenChange(false);
  };

  const defaultField = columns[0]?.id;

  const footer = (
    <div className="flex items-center justify-end gap-2">
      <Button type="button" variant="outline" size="sm" onClick={handleClear}>
        {t('clearAll')}
      </Button>
      <Button type="button" size="sm" onClick={handleApply}>
        {t('apply')}
      </Button>
    </div>
  );

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={t('title')}
      size={mode === 'advanced' ? 'xl' : 'lg'}
      footer={footer}
    >
      {mode === 'simple' ? (
        <div className="space-y-3">
          <div className="flex items-center justify-end">
            <FilterJoinToggle
              value={state.groups[0]?.joinOperator ?? 'and'}
              onChange={(op) => {
                const group = state.groups[0];
                if (group) updateGroup(group.id, { ...group, joinOperator: op });
              }}
            />
          </div>

          <div className="space-y-1.5">
            {state.groups[0]?.conditions.map((condition, index) => (
              <FilterConditionRow
                key={condition.id}
                condition={condition}
                columns={columns}
                onChange={(updated) => {
                  const group = state.groups[0];
                  const conditions = [...group.conditions];
                  conditions[index] = updated;
                  updateGroup(group.id, { ...group, conditions });
                }}
                onRemove={() => {
                  const group = state.groups[0];
                  const conditions = group.conditions.filter((_, i) => i !== index);
                  if (conditions.length === 0) {
                    conditions.push(createEmptyCondition(defaultField));
                  }
                  updateGroup(group.id, { ...group, conditions });
                }}
              />
            ))}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => {
              const group = state.groups[0];
              updateGroup(group.id, {
                ...group,
                conditions: [...group.conditions, createEmptyCondition(defaultField)],
              });
            }}
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            {t('addCondition')}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-end">
            <FilterJoinToggle value={state.joinOperator} onChange={setJoinOperator} />
          </div>

          <div className="space-y-3">
            {state.groups.map((group) => (
              <FilterGroupPanel
                key={group.id}
                group={group}
                columns={columns}
                onChange={(updated) => updateGroup(group.id, updated)}
                onRemove={() => removeGroup(group.id)}
                showRemove={state.groups.length > 1}
              />
            ))}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => addGroup(defaultField)}
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            {t('addGroup')}
          </Button>
        </div>
      )}
    </Modal>
  );
}