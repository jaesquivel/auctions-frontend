type Listener = () => void;

export interface ApiLogEntry {
  timestamp: string;
  method: string;
  url: string;
  status: number | null;
  durationMs: number;
  requestBody?: string;
  responseBody?: string;
  token?: string;
  error?: string;
}

const IS_DEV = process.env.NODE_ENV !== 'production';
const LOG_TOKENS = process.env.NEXT_PUBLIC_LOG_TOKENS === 'true';
const MAX_ENTRIES = 200;
let entries: ApiLogEntry[] = [];
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((fn) => fn());
}

export const apiLog = {
  add(entry: ApiLogEntry) {
    if (!IS_DEV) return;
    entries = [entry, ...entries].slice(0, MAX_ENTRIES);
    notify();
  },

  getEntries(): ApiLogEntry[] {
    return entries;
  },

  clear() {
    entries = [];
    notify();
  },

  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  format(entry: ApiLogEntry): string {
    const { timestamp, method, url, status, durationMs, requestBody, responseBody, token, error } = entry;
    const lines: string[] = [];
    lines.push(`[${timestamp}] ${method} ${url} → ${status ?? 'ERR'} (${durationMs}ms)`);
    if (token && LOG_TOKENS) lines.push(`  🔑 ${token}`);
    if (requestBody) lines.push(`  ← ${requestBody}`);
    if (responseBody) lines.push(`  → ${responseBody.length > 500 ? responseBody.slice(0, 500) + '…' : responseBody}`);
    if (error) lines.push(`  ✗ ${error}`);
    return lines.join('\n');
  },
};