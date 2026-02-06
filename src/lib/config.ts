/**
 * Application configuration
 *
 * Controls whether API calls use mock data or the real backend.
 * Each service can be configured independently.
 */

export const config = {
  /**
   * Per-service mock API configuration.
   * Set to false to use real backend for that specific service.
   */
  useMock: {
    properties: true,
    edicts: true,
    tags: false,
    vehicles: true,
    assets: true,
    bulletins: false,
    territorial: false,
    rawEdicts: false,
    rawAssets: false,
  },

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