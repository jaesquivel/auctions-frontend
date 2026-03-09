import { formatTimestamp, formatDate } from '@/lib/formatters';

interface DateProps {
  value: string | null | undefined;
  dateOnly?: boolean;  // show date without time (default: false)
}

export function DateDisplay({ value, dateOnly = false }: DateProps) {
  const display = dateOnly ? formatDate(value) : formatTimestamp(value);
  return <p className="rounded-md border text-right max-w-50 bg-muted/50 px-3 py-1.5">{display}</p>;
}
