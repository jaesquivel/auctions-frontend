'use client';

import { FieldDisplay, type FieldMode } from '@/components/ui/field';
import { FieldWrapper } from '@/components/ui/field-wrapper';
import { NumericInput } from '@/components/ui/numeric-input';
import { formatPercent } from '@/lib/formatters';

interface PercentFieldProps {
  value: number | string | null | undefined;
  onChange?: (value: string) => void;
  mode?: FieldMode;
  label?: string;
  labelPosition?: 'top' | 'left';
  decimals?: number;
  className?: string;
}

function formatValue(value: number | string | null | undefined, decimals: number): string {
  if (value === null || value === undefined || value === '') return '-';
  const num = Number(value);
  return isNaN(num) ? '-' : formatPercent(num, decimals);
}

export function PercentField({ value, onChange, mode = 'edit', label, labelPosition, decimals = 0, className }: PercentFieldProps) {
  const field = mode === 'readonly' || mode === 'computed'
    ? <FieldDisplay>{formatValue(value, decimals)}</FieldDisplay>
    : (
      <NumericInput
        value={value != null ? String(value) : ''}
        onChange={onChange ?? (() => {})}
        percent
        decimals={decimals}
        disabled={mode === 'disabled'}
        className={className}
      />
    );

  return <FieldWrapper label={label} labelPosition={labelPosition}>{field}</FieldWrapper>;
}
