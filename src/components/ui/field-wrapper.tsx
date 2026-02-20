import type { ReactNode } from 'react';

interface FieldWrapperProps {
  label?: string;
  labelPosition?: 'top' | 'left';
  children: ReactNode;
  className?: string;
}

export function FieldWrapper({ label, labelPosition = 'top', children, className }: FieldWrapperProps) {
  if (!label) {
    return <>{children}</>;
  }

  if (labelPosition === 'left') {
    return (
      <div className={`flex items-center gap-3 ${className || ''}`}>
        <label className="text-sm font-medium whitespace-nowrap">{label}</label>
        {children}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className || ''}`}>
      <label className="block text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}
