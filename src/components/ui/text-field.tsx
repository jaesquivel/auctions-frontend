'use client';

import { FieldDisplay, type FieldMode } from '@/components/ui/field-display';
import { FieldWrapper } from '@/components/ui/field-wrapper';
import { Textarea } from '@/components/ui/textarea';

interface TextFieldProps {
  value: string | null | undefined;
  onChange?: (value: string) => void;
  mode?: FieldMode;
  label?: string;
  labelPosition?: 'top' | 'left';
  placeholder?: string;
  rows?: number;
  className?: string;
}

export function TextField({ value, onChange, mode = 'edit', label, labelPosition, placeholder, rows = 4, className }: TextFieldProps) {
  const field = mode === 'readonly' || mode === 'computed'
    ? <FieldDisplay textAlign="left" multiline className={`whitespace-pre-wrap ${className}`} >{value || '-'}</FieldDisplay>
    : (
      <Textarea
        value={value ?? ''}
        onChange={(e) => (onChange ?? (() => {}))(e.target.value)}
        placeholder={placeholder}
        disabled={mode === 'disabled'}
        rows={rows}
        className={className}
      />
    );

  return <FieldWrapper label={label} labelPosition={labelPosition}>{field}</FieldWrapper>;
}
