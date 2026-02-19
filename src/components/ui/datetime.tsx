import { formatDate } from '@/lib/formatters';

interface DateTimeProps {
  value: string | null | undefined;
}

export function DateTime({ value }: DateTimeProps) {
  return <p className="rounded-md flex items-center justify-end max-w-50 bg-muted/90 px-3 h-9 text-sm">{formatDate(value)}</p>;
}
