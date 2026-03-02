'use client';

import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { TagBadge } from '@/components/ui/tag-badge';
import { NO_VALUE_OPERATORS } from './filter-types';
import type { ColumnFilterType, FilterOperator, TagOption } from './filter-types';

interface FilterValueInputProps {
  filterType: ColumnFilterType;
  operator: FilterOperator;
  value: string | number | boolean;
  onChange: (value: string | number | boolean) => void;
  tagOptions?: TagOption[];
}

export function FilterValueInput({ filterType, operator, value, onChange, tagOptions }: FilterValueInputProps) {
  const t = useTranslations('common.filters');

  if (NO_VALUE_OPERATORS.includes(operator)) {
    return null;
  }

  if (filterType === 'tagId') {
    const selectedIds = value ? String(value).split(',').filter(Boolean) : [];
    const selected = (tagOptions ?? []).filter((tag) => selectedIds.includes(tag.id));

    const toggle = (id: string) => {
      const next = selectedIds.includes(id)
        ? selectedIds.filter((s) => s !== id)
        : [...selectedIds, id];
      onChange(next.join(','));
    };

    return (
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex gap-1 flex-wrap min-h-7 w-full items-center rounded-md border border-input bg-transparent px-2 py-1 text-xs cursor-pointer hover:bg-accent/50 transition-colors overflow-hidden"
          >
            {selected.length > 0 ? (
              selected.map((tag) => (
                <TagBadge
                  key={tag.id}
                  name={tag.name}
                  color={tag.color}
                  onRemove={() => toggle(tag.id)}
                />
              ))
            ) : (
              <span className="text-muted-foreground">{t('selectTags')}</span>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-56 p-0" onWheel={(e) => e.stopPropagation()}>
          <div className="space-y-1 p-2 max-h-60 overflow-y-auto">
            {(tagOptions ?? []).map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggle(tag.id)}
                className={`flex items-center w-full rounded-md px-2 py-1.5 text-sm transition-colors ${
                  selectedIds.includes(tag.id) ? 'bg-accent' : 'hover:bg-accent/50'
                }`}
              >
                <TagBadge name={tag.name} color={tag.color} />
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  const inputType = filterType === 'number' ? 'number' : filterType === 'date' ? 'date' : filterType === 'datetime' ? 'datetime-local' : 'text';

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