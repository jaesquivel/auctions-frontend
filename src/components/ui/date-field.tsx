'use client';

import { FieldDisplay, type FieldMode } from '@/components/ui/field';
import { FieldWrapper } from '@/components/ui/field-wrapper';
import { DateInput } from '@/components/ui/date-input';
import { formatDate, formatDateOnly } from '@/lib/formatters';

interface DateFieldProps {
  value: string | null | undefined;
  onChange?: (value: string) => void;
  mode?: FieldMode;
  label?: string;
  labelPosition?: 'top' | 'left';
  dateOnly?: boolean;
  className?: string;
}

export function DateField({ value, onChange, mode = 'edit', label, labelPosition, dateOnly, className }: DateFieldProps) {
  const field = mode === 'readonly' || mode === 'computed'
    ? <FieldDisplay>{dateOnly ? formatDateOnly(value) : formatDate(value)}</FieldDisplay>
    : (
      <DateInput
        value={value ?? ''}
        onChange={onChange ?? (() => {})}
        dateOnly={dateOnly}
        disabled={mode === 'disabled'}
        className={className}
      />
    );

  return <FieldWrapper label={label} labelPosition={labelPosition}>{field}</FieldWrapper>;
}
