import { config } from './config';
import { showErrorToast, showNetworkErrorToast } from './toast';
import { setApiAvailable } from './api-status';
import { apiLog } from './api-log';

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message?: string
  ) {
    super(message || `API Error: ${status} ${statusText}`);
    this.name = 'ApiError';
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  /** If true, suppress error toast notification */
  silent?: boolean;
}

interface ClerkInstance {
  loaded?: boolean;
  session?: { getToken: () => Promise<string | null> };
}

function waitForClerk(timeoutMs = 5000): Promise<ClerkInstance | null> {
  const win = window as unknown as { Clerk?: ClerkInstance };
  if (win.Clerk?.loaded) return Promise.resolve(win.Clerk);

  return new Promise((resolve) => {
    const start = Date.now();
    const check = setInterval(() => {
      if (win.Clerk?.loaded) {
        clearInterval(check);
        resolve(win.Clerk);
      } else if (Date.now() - start > timeoutMs) {
        clearInterval(check);
        resolve(win.Clerk ?? null);
      }
    }, 50);
  });
}

async function getAuthToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  try {
    const clerk = await waitForClerk();
    if (!clerk?.session) return null;

    const token = await clerk.session.getToken();
    return token;
  } catch (error) {
    // Session expired or not found — redirect to sign-in
    const isSessionError =
      error instanceof Error &&
      (error.message?.includes('Session not found') || error.message?.includes('404'));

    if (isSessionError) {
      window.location.href = '/sign-in';
    }

    return null;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, headers: customHeaders, silent, ...restOptions } = options;

  const token = await getAuthToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const url = `${config.API_BASE_URL}${endpoint}`;
  const method = restOptions.method || 'GET';
  const startTime = Date.now();
  const requestBodyStr = body ? JSON.stringify(body) : undefined;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.API_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...restOptions,
      headers,
      body: requestBodyStr,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // API is reachable
    setApiAvailable(true);

    if (!response.ok) {
      const errorBody = await response.text();
      apiLog.add({ timestamp: new Date().toISOString(), method, url, status: response.status, durationMs: Date.now() - startTime, requestBody: requestBodyStr, responseBody: errorBody, token: token ?? undefined });
      const error = new ApiError(response.status, response.statusText, errorBody);

      if (!silent) {
        showErrorToast(response.status, errorBody);
      }

      throw error;
    }

    // Handle empty responses
    const text = await response.text();
    apiLog.add({ timestamp: new Date().toISOString(), method, url, status: response.status, durationMs: Date.now() - startTime, requestBody: requestBodyStr, responseBody: text || undefined, token: token ?? undefined });
    if (!text) return undefined as T;

    return JSON.parse(text) as T;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) throw error;

    if (error instanceof Error && error.name === 'AbortError') {
      // Timeout - API may be unavailable
      setApiAvailable(false);
      apiLog.add({ timestamp: new Date().toISOString(), method, url, status: null, durationMs: Date.now() - startTime, requestBody: requestBodyStr, token: token ?? undefined, error: 'Request timed out' });
      const timeoutError = new ApiError(408, 'Request Timeout', 'Request timed out');
      if (!silent) {
        showErrorToast(408);
      }
      throw timeoutError;
    }

    // Network error - API is unavailable
    setApiAvailable(false);
    apiLog.add({ timestamp: new Date().toISOString(), method, url, status: null, durationMs: Date.now() - startTime, requestBody: requestBodyStr, token: token ?? undefined, error: error instanceof Error ? error.message : 'Network error' });
    if (!silent && error instanceof Error) {
      showNetworkErrorToast();
    }

    throw error;
  }
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'POST', body }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'PUT', body }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'PATCH', body }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};