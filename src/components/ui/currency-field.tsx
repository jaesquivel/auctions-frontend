'use client';

import { FieldDisplay, type FieldMode } from '@/components/ui/field';
import { FieldWrapper } from '@/components/ui/field-wrapper';
import { NumericInput } from '@/components/ui/numeric-input';
import { formatCurrency } from '@/lib/formatters';

interface CurrencyFieldProps {
  value: number | string | null | undefined;
  onChange?: (value: string) => void;
  currency: string;
  mode?: FieldMode;
  label?: string;
  labelPosition?: 'top' | 'left';
  className?: string;
}

function formatValue(value: number | string | null | undefined, currency: string): string {
  if (value === null || value === undefined || value === '') return '-';
  const num = Number(value);
  return isNaN(num) ? '-' : formatCurrency(num, currency);
}

export function CurrencyField({ value, onChange, currency, mode = 'edit', label, labelPosition, className }: CurrencyFieldProps) {
  const field = mode === 'readonly' || mode === 'computed'
    ? <FieldDisplay>{formatValue(value, currency)}</FieldDisplay>
    : (
      <NumericInput
        value={value != null ? String(value) : ''}
        onChange={onChange ?? (() => {})}
        currency={currency}
        disabled={mode === 'disabled'}
        className={className}
      />
    );

  return <FieldWrapper label={label} labelPosition={labelPosition}>{field}</FieldWrapper>;
}
