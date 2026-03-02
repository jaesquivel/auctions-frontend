'use client';

import * as React from 'react';
import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { formatDate, formatDateOnly } from '@/lib/formatters';

interface DateInputProps {
  value: string;           // ISO string (e.g. "2026-01-22T10:20:00Z") or empty
  onChange: (value: string) => void;  // called with ISO string
  className?: string;
  disabled?: boolean;
  dateOnly?: boolean;      // date without time picker (default: false)
}

// Convert ISO string to datetime-local input value (YYYY-MM-DDTHH:mm)
function toInputValue(iso: string, dateOnly: boolean): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  if (dateOnly) return `${year}-${month}-${day}`;
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function DateInput({ value, onChange, className, disabled, dateOnly = false }: DateInputProps) {
  const [focused, setFocused] = useState(false);

  const formatDisplay = useCallback((iso: string): string => {
    return dateOnly ? formatDateOnly(iso) : formatDate(iso);
  }, [dateOnly]);

  const handleFocus = useCallback(() => {
    setFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setFocused(false);
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (!raw) {
      onChange('');
      return;
    }
    // Convert datetime-local / date value back to ISO string
    const date = new Date(raw);
    if (!isNaN(date.getTime())) {
      onChange(date.toISOString());
    }
  }, [onChange]);

  return (
    <Input
      type={focused ? (dateOnly ? 'date' : 'datetime-local') : 'text'}
      className={`text-right max-w-50 ${className || ''}`}
      value={focused ? toInputValue(value, dateOnly) : formatDisplay(value)}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      disabled={disabled}
    />
  );
}
