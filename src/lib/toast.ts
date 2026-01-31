import { toast } from 'sonner';
import en from '@/messages/en.json';
import es from '@/messages/es.json';

type Messages = typeof en;

const messages: Record<string, Messages> = { en, es };

// Store for current locale - will be set by the app
let currentLocale = 'es';

export function setToastLocale(locale: string) {
  currentLocale = locale;
}

function t(key: keyof Messages['errors'], params?: Record<string, string | number>): string {
  const msg = messages[currentLocale]?.errors?.[key] || messages['es'].errors[key];
  if (!params) return msg;

  return Object.entries(params).reduce(
    (acc, [k, v]) => acc.replace(`{${k}}`, String(v)),
    msg
  );
}

export function getErrorMessage(status: number, body?: string): string {
  // Try to parse error message from response body
  if (body) {
    try {
      const parsed = JSON.parse(body);
      if (parsed.message) return parsed.message;
      if (parsed.error) return parsed.error;
    } catch {
      // Body is not JSON, use it directly if short enough
      if (body.length < 200) return body;
    }
  }

  // Default messages based on status code
  switch (status) {
    case 400:
      return t('badRequest');
    case 401:
      return t('unauthorized');
    case 403:
      return t('forbidden');
    case 404:
      return t('notFound');
    case 408:
      return t('timeout');
    case 409:
      return t('conflict');
    case 422:
      return t('validationError');
    case 429:
      return t('tooManyRequests');
    case 500:
      return t('serverError');
    case 502:
      return t('badGateway');
    case 503:
      return t('serviceUnavailable');
    default:
      return t('defaultError', { status });
  }
}

export function showErrorToast(status: number, body?: string) {
  toast.error(getErrorMessage(status, body));
}

export function showNetworkErrorToast() {
  toast.error(t('networkError'));
}