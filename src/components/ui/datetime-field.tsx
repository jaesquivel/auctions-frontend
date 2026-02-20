'use client';

import { FieldDisplay, type FieldMode } from '@/components/ui/field';
import { FieldWrapper } from '@/components/ui/field-wrapper';
import { DateTimeInput } from '@/components/ui/datetime-input';
import { formatDate } from '@/lib/formatters';

interface DateTimeFieldProps {
  value: string | null | undefined;
  onChange?: (value: string) => void;
  mode?: FieldMode;
  label?: string;
  labelPosition?: 'top' | 'left';
  className?: string;
}

export function DateTimeField({ value, onChange, mode = 'edit', label, labelPosition, className }: DateTimeFieldProps) {
  const field = mode === 'readonly' || mode === 'computed'
    ? <FieldDisplay>{formatDate(value)}</FieldDisplay>
    : (
      <DateTimeInput
        value={value ?? ''}
        onChange={onChange ?? (() => {})}
        disabled={mode === 'disabled'}
        className={className}
      />
    );

  return <FieldWrapper label={label} labelPosition={labelPosition}>{field}</FieldWrapper>;
}
