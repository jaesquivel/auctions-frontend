import { formatDate, formatDateOnly } from '@/lib/formatters';

interface DateProps {
  value: string | null | undefined;
  dateOnly?: boolean;  // show date without time (default: false)
}

export function DateDisplay({ value, dateOnly = false }: DateProps) {
  const display = dateOnly ? formatDateOnly(value) : formatDate(value);
  return <p className="rounded-md flex items-center justify-end max-w-50 bg-muted/90 px-3 h-9 text-sm">{display}</p>;
}
