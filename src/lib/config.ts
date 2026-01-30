/**
 * Application configuration
 *
 * Controls whether API calls use mock data or the real backend.
 * Set USE_MOCK_API to false to use the real backend API.
 */

export const config = {
  /**
   * When true, all API calls return mock data.
   * When false, all API calls go to the real backend.
   */
  USE_MOCK_API: true,

  /**
   * Backend API base URL
   */
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',

  /**
   * Request timeout in milliseconds
   */
  API_TIMEOUT: 30000,
} as const;

export type Config = typeof config;