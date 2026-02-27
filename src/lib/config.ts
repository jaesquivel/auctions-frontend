/**
 * Application configuration
 *
 */

export const config = {
  /**
   * API port (uses the same scheme + hostname as the frontend)
   */
  API_PORT: process.env.NEXT_PUBLIC_API_PORT || '8080',

  /**
   * API base path appended after scheme://hostname:port
   */
  API_BASE_PATH: process.env.NEXT_PUBLIC_API_BASE_PATH || '/api/v1',

  /**
   * Backend API base URL (derived at runtime from browser location)
   */
  get API_BASE_URL(): string {
    if (typeof window !== 'undefined') {
      const { protocol, hostname } = window.location;
      return `${protocol}//${hostname}:${this.API_PORT}${this.API_BASE_PATH}`;
    }
    return `http://localhost:${this.API_PORT}${this.API_BASE_PATH}`;
  },

  /**
   * Request timeout in milliseconds
   */
  API_TIMEOUT: 30000,
};

export type Config = typeof config;