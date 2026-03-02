// Simple global state for API availability
type Listener = (available: boolean) => void;

let isApiAvailable = true;
const listeners = new Set<Listener>();

export function setApiAvailable(available: boolean) {
  if (isApiAvailable !== available) {
    isApiAvailable = available;
    listeners.forEach((listener) => listener(available));
  }
}

export function getApiAvailable() {
  return isApiAvailable;
}

export function subscribeApiStatus(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}