import { formatTimestamp } from '@/lib/formatters';

interface DateTimeProps {
  value: string | null | undefined;
}

export function DateTime({ value }: DateTimeProps) {
  return <p className="rounded-md border text-right max-w-50 bg-muted/50 px-3 py-1.5">{formatTimestamp(value)}</p>;
}
