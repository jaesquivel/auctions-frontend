// Global formatting locale — change this to update separators across the app.
// ',' for thousands, '.' for decimals (en-US convention)
const NUMBER_LOCALE = 'en-US';

export function formatCurrency(value: number | null | undefined, currency?: string): string {
  if (value === null || value === undefined) return '-';

  const formatted = new Intl.NumberFormat(NUMBER_LOCALE, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

  return currency ? `${currency} ${formatted}` : formatted;
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '-';

  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return '-';

  return new Intl.NumberFormat(NUMBER_LOCALE, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatArea(value: number | null | undefined): string {
  if (value === null || value === undefined) return '-';
  return `${formatNumber(value)} m²`;
}

export function formatCoordinate(value: number | null | undefined): string {
  if (value === null || value === undefined) return '-';
  return value.toFixed(8);
}

export function formatRatio(value: number | null | undefined): string {
  if (value === null || value === undefined) return '-';

  const formatted = new Intl.NumberFormat(NUMBER_LOCALE, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

  return `${formatted}%`;
}
