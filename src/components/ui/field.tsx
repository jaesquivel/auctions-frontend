import type { ReactNode } from 'react';

export type FieldMode = 'edit' | 'readonly' | 'disabled' | 'computed';

interface FieldDisplayProps {
  children: ReactNode;
  mode?: 'readonly' | 'computed';   // readonly and computed look identical
  textAlign?: 'left' | 'right';     // default: right (numeric/date); left for string/text
  multiline?: boolean;               // omits h-9 fixed height; uses py-2 (for text fields)
  className?: string;
}

export function FieldDisplay({ children, textAlign = 'right', multiline, className }: FieldDisplayProps) {
  const base = 'rounded-md bg-muted/30 px-3 text-sm';

  if (multiline) {
    return (
      <p className={`${base} py-2 ${className || ''}`}>
        {children}
      </p>
    );
  }

  const align = textAlign === 'left' ? 'justify-start' : 'justify-end max-w-50';
  return (
    <p className={`${base} flex items-center h-9 overflow-hidden whitespace-nowrap ${align} ${className || ''}`}>
      {children}
    </p>
  );
}

