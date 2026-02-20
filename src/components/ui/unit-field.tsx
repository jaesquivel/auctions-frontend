'use client';

import { FieldDisplay, type FieldMode } from '@/components/ui/field';
import { FieldWrapper } from '@/components/ui/field-wrapper';
import { NumericInput } from '@/components/ui/numeric-input';
import { formatDecimal } from '@/lib/formatters';

interface UnitFieldProps {
  value: number | string | null | undefined;
  onChange?: (value: string) => void;
  mode?: FieldMode;
  label?: string;
  labelPosition?: 'top' | 'left';
  unit: string;                       // e.g. 'm²', 'km', 'ha', 'kg'
  unitPosition?: 'before' | 'after';  // default: 'after'
  decimals?: number;
  className?: string;
}

function formatValue(value: number | string | null | undefined, decimals: number): string {
  if (value === null || value === undefined || value === '') return '-';
  const num = Number(value);
  return isNaN(num) ? '-' : formatDecimal(num, decimals);
}

export function UnitField({
  value,
  onChange,
  mode = 'edit',
  label,
  labelPosition,
  unit,
  unitPosition = 'after',
  decimals = 2,
  className,
}: UnitFieldProps) {
  const isReadOnly = mode === 'readonly' || mode === 'computed';

  if (isReadOnly) {
    const formatted = formatValue(value, decimals);
    const display = formatted === '-'
      ? '-'
      : unitPosition === 'before'
        ? `${unit} ${formatted}`
        : `${formatted} ${unit}`;
    return (
      <FieldWrapper label={label} labelPosition={labelPosition}>
        <FieldDisplay>{display}</FieldDisplay>
      </FieldWrapper>
    );
  }

  const addonBase = 'h-9 flex items-center px-3 bg-muted border border-input text-sm text-muted-foreground shrink-0';

  return (
    <FieldWrapper label={label} labelPosition={labelPosition}>
      <div className="flex max-w-50">
        {unitPosition === 'before' && (
          <span className={`${addonBase} border-r-0 rounded-l-md`}>{unit}</span>
        )}
        <NumericInput
          value={value != null ? String(value) : ''}
          onChange={onChange ?? (() => {})}
          decimals={decimals}
          disabled={mode === 'disabled'}
          className={
            unitPosition === 'before'
              ? `rounded-l-none border-l-0 ${className || ''}`
              : `rounded-r-none border-r-0 ${className || ''}`
          }
        />
        {unitPosition === 'after' && (
          <span className={`${addonBase} border-l-0 rounded-r-md`}>{unit}</span>
        )}
      </div>
    </FieldWrapper>
  );
}
