'use client';

import { FieldDisplay, type FieldMode } from '@/components/ui/field';
import { FieldWrapper } from '@/components/ui/field-wrapper';
import { Input } from '@/components/ui/input';

interface StringFieldProps {
  value: string | null | undefined;
  onChange?: (value: string) => void;
  mode?: FieldMode;
  label?: string;
  labelPosition?: 'top' | 'left';
  placeholder?: string;
  className?: string;
}

export function StringField({ value, onChange, mode = 'edit', label, labelPosition, placeholder, className }: StringFieldProps) {
  const field = mode === 'readonly' || mode === 'computed'
    ? <FieldDisplay textAlign="left">{value || '-'}</FieldDisplay>
    : (
      <Input
        type="text"
        value={value ?? ''}
        onChange={(e) => (onChange ?? (() => {}))(e.target.value)}
        placeholder={placeholder}
        disabled={mode === 'disabled'}
        className={className}
      />
    );

  return <FieldWrapper label={label} labelPosition={labelPosition} className={className}>{field}</FieldWrapper>;
}
