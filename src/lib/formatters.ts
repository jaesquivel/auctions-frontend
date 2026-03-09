// Global formatting locale — change this to update separators across the app.
// ',' for thousands, '.' for decimals (en-US convention)
const NUMBER_LOCALE = 'en-US';
const TIME_ZONE = '-6';

export function formatCurrency(value: number | null | undefined, currency?: string): string {
  if (value === null || value === undefined) return '-';

  const formatted = new Intl.NumberFormat(NUMBER_LOCALE, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

  return currency ? `${currency} ${formatted}` : formatted;
}

export function formatTimestamp(dateString: string | null | undefined): string {
  if (!dateString) return '-';

  const date = new Date(dateString);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '-';

  const date = new Date(dateString);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return '-';

  return new Intl.NumberFormat(NUMBER_LOCALE, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDecimal(value: number | null | undefined, decimals: number): string {
  if (value === null || value === undefined) return '-';

  return new Intl.NumberFormat(NUMBER_LOCALE, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPercent(value: number | null | undefined, decimals = 0): string {
  if (value === null || value === undefined) return '-';

  return formatDecimal(value, decimals) + '%';
}

export function formatArea(value: number | null | undefined): string {
  if (value === null || value === undefined) return '-';
  return `${formatNumber(value)} m²`;
}

export function formatRatio(value: number | null | undefined): string {
  return formatPercent(value, 0);
}
