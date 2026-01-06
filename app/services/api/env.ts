/**
 * env.ts
 * Environment configuration for API
 */

const API_BASE_URL = __DEV__
  ? "https://api-dev.example.com/v1"
  : "https://api.example.com/v1"

// Developer override for testing
let developerOverrideBaseUrl: string | null = null

export const apiConfig = {
  get baseUrl(): string {
    return developerOverrideBaseUrl || API_BASE_URL
  },

  setBaseUrl(url: string): void {
    developerOverrideBaseUrl = url
  },

  resetBaseUrl(): void {
    developerOverrideBaseUrl = null
  },

  get timeout(): number {
    return 30000 // 30 seconds
  },
}

export default apiConfig
