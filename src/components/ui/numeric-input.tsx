'use client';

import * as React from 'react';
import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { formatCurrency, formatDecimal, formatPercent } from '@/lib/formatters';

interface NumericInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
  currency?: string;    // e.g. 'CRC', 'USD' — formats as currency with ISO prefix
  percent?: boolean;    // formats as percentage
  decimals?: number;    // decimal places (default: 2)
}

export function NumericInput({ value, onChange, className, disabled, currency, percent, decimals = 2 }: NumericInputProps) {
  const [focused, setFocused] = useState(false);

  const formatDisplay = useCallback((raw: string): string => {
    if (!raw) return '';
    const num = Number(raw);
    if (isNaN(num)) {
      return raw;
    } else if (currency) {
      return formatCurrency(num, currency);
    } else if (percent) {
      return formatPercent(num, decimals);
    } else {
      return formatDecimal(num, decimals);
    }
    
  }, [currency, percent, decimals]);

  const handleFocus = useCallback(() => {
    setFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setFocused(false);
    if (value) {
      const num = Number(value);
      if (!isNaN(num)) {
        const rounded = parseFloat(num.toFixed(decimals));
        onChange(rounded.toString());
      }
    }
  }, [value, onChange, decimals]);

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
      className={`text-right max-w-50 ${className || ''}`}
      value={focused ? value : formatDisplay(value)}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      disabled={disabled}
    />
  );
}
