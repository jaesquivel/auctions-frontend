import { formatCurrency, formatDecimal, formatPercent } from '@/lib/formatters';

interface NumericProps {
  value: number | string | null | undefined;
  className?: string;
  currency?: string;    // e.g. 'CRC', 'USD' — formats as currency with ISO prefix
  percent?: boolean;    // formats as percentage
  decimals?: number;    // decimal places (default: 2)
}

export function Numeric({ value, className, currency, percent, decimals = 2 }: NumericProps) {
  let display: string;

  if (value === null || value === undefined || value === '') {
    display = '-';
  } else {
    const num = typeof value === 'string' ? Number(value) : value;

    if (isNaN(num)) {
      display = '-';
    } else if (currency) {
      display = formatCurrency(num, currency);
    } else if (percent) {
      display = formatPercent(num, decimals);
    } else {
      display = formatDecimal(num, decimals);
    }
  }

  return <p className={`rounded-md border text-right max-w-50 bg-muted/50 px-3 h-9 py-1 text-sm ${className || ''}`}>{display}</p>;
}
