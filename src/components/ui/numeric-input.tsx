'use client';

import * as React from 'react';
import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { formatCurrency, formatCoordinate } from '@/lib/formatters';

interface NumericInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
  currency?: string;
  decimals?: number;
}

export function NumericInput({ value, onChange, className, disabled, currency, decimals }: NumericInputProps) {
  const [focused, setFocused] = useState(false);

  const formatDisplay = useCallback((raw: string): string => {
    if (!raw) return '';
    const num = Number(raw);
    if (isNaN(num)) return raw;
    if (decimals != null) return num.toFixed(decimals);
    return formatCurrency(num, currency);
  }, [currency, decimals]);

  const handleFocus = useCallback(() => {
    setFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setFocused(false);
    if (value) {
      const num = Number(value);
      if (!isNaN(num)) {
        onChange(num.toString());
      }
    }
  }, [value, onChange]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Allow empty, digits, decimal point, and minus
    if (raw === '' || /^-?\d*\.?\d*$/.test(raw)) {
      onChange(raw);
    }
  }, [onChange]);

  return (
    <Input
      type="text"
      inputMode="decimal"
      className={`text-right max-w-[200px] ${className || ''}`}
      value={focused ? value : formatDisplay(value)}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      disabled={disabled}
    />
  );
}
