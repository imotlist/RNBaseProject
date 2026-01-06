/**
 * ApiService.ts
 * Enhanced API service with authentication, 401 handling, and offline checks
 */

import { ApiResponse, ApisauceInstance, create } from "apisauce"
import { Platform } from "react-native"
import NetInfo from "@react-native-community/netinfo"
import AsyncStorage from "@react-native-async-storage/async-storage"
import apiConfig from "./env"
import { GeneralApiProblem, getGeneralApiProblem } from "./apiProblem"
import type { ApiConfig } from "./types"

const STORAGE_KEYS = {
  ACCESS_TOKEN: "@tallygreen_access_token",
  REFRESH_TOKEN: "@tallygreen_refresh_token",
}

/**
 * Enhanced API configuration
 */
export const API_CONFIG: ApiConfig = {
  url: apiConfig.baseUrl,
  timeout: apiConfig.timeout,
}

/**
 * Request options for API calls
 */
export interface RequestOptions {
  /**
   * Whether to require authentication
   */
  requireAuth?: boolean
  /**
   * Whether to check internet connection
   */
  checkConnection?: boolean
  /**
   * Additional headers
   */
  headers?: Record<string, string>
  /**
   * Multipart form data
   */
  isMultipart?: boolean
}

/**
 * API response wrapper
 */
export type ApiResult<T> = { kind: "ok"; data: T } | GeneralApiProblem

/**
 * Enhanced API Service class
 */
export class ApiService {
  private apisauce: ApisauceInstance
  private config: ApiConfig
  private navigation: any = null

  constructor(config: ApiConfig = API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    this.setupMonitor()
  }

  /**
   * Set up request/response monitoring
   */
  private setupMonitor() {
    this.apisauce.addMonitor((response) => {
      // Handle 401 Unauthorized
      if (response.status === 401) {
        this.handleUnauthorized()
      }

      // Log in development
      if (__DEV__) {
        console.log(`[API] ${response.config?.method?.toUpperCase()} ${response.config?.url}`, {
          status: response.status,
          ok: response.ok,
          data: response.data,
        })
      }
    })

    // Request interceptor to add auth token
    this.apisauce.addRequestTransform((request) => {
      this.addAuthToken(request)
    })
  }

  /**
   * Add authentication token to request
   */
  private async addAuthToken(request: any) {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
      if (token) {
        request.headers["Authorization"] = `Bearer ${token}`
      }
    } catch (error) {
      console.error("[API] Error adding auth token:", error)
    }
  }

  /**
   * Handle 401 Unauthorized response
   */
  private handleUnauthorized() {
    // Clear stored tokens
    AsyncStorage.multiRemove([STORAGE_KEYS.ACCESS_TOKEN, STORAGE_KEYS.REFRESH_TOKEN])

    // Navigate to login
    if (this.navigation) {
      this.navigation.reset({
        index: 0,
        routes: [{ name: "Auth" }],
      })
    }
  }

  /**
   * Set navigation reference for redirects
   */
  setNavigation(navigation: any) {
    this.navigation = navigation
  }

  /**
   * Check internet connection before request
   */
  private async checkConnection(): Promise<boolean> {
    const state = await NetInfo.fetch()
    return state.isConnected ?? false
  }

  /**
   * Set authentication token
   */
  async setAuthToken(token: string): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token)
    this.apisauce.setHeader("Authorization", `Bearer ${token}`)
  }

  /**
   * Clear authentication token
   */
  async clearAuthToken(): Promise<void> {
    await AsyncStorage.multiRemove([STORAGE_KEYS.ACCESS_TOKEN, STORAGE_KEYS.REFRESH_TOKEN])
    this.apisauce.deleteHeader("Authorization")
  }

  /**
   * Get current access token
   */
  async getAccessToken(): Promise<string | null> {
    return AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
  }

  /**
   * Set base URL
   */
  setBaseURL(url: string): void {
    this.config.url = url
    this.apisauce.setBaseURL(url)
  }

  /**
   * GET request
   */
  async get<T>(
    url: string,
    params?: Record<string, any>,
    options: RequestOptions = {},
  ): Promise<ApiResult<T>> {
    return this.makeRequest<T>(() => this.apisauce.get(url, params, this.getRequestOptions(options)))
  }

  /**
   * POST request
   */
  async post<T>(
    url: string,
    data?: any,
    options: RequestOptions = {},
  ): Promise<ApiResult<T>> {
    return this.makeRequest<T>(() => this.apisauce.post(url, data, this.getRequestOptions(options)))
  }

  /**
   * PUT request
   */
  async put<T>(
    url: string,
    data?: any,
    options: RequestOptions = {},
  ): Promise<ApiResult<T>> {
    return this.makeRequest<T>(() => this.apisauce.put(url, data, this.getRequestOptions(options)))
  }

  /**
   * PATCH request
   */
  async patch<T>(
    url: string,
    data?: any,
    options: RequestOptions = {},
  ): Promise<ApiResult<T>> {
    return this.makeRequest<T>(() =>
      this.apisauce.patch(url, data, this.getRequestOptions(options)),
    )
  }

  /**
   * DELETE request
   */
  async delete<T>(url: string, options: RequestOptions = {}): Promise<ApiResult<T>> {
    return this.makeRequest<T>(() => this.apisauce.delete(url, this.getRequestOptions(options)))
  }

  /**
   * Upload file (multipart)
   */
  async upload<T>(
    url: string,
    data: FormData,
    options: RequestOptions = { isMultipart: true },
    onUploadProgress?: (progress: number) => void,
  ): Promise<ApiResult<T>> {
    return this.makeRequest<T>(() =>
      this.apisauce.post(url, data, {
        ...this.getRequestOptions(options),
        onUploadProgress: (progress) => {
          if (onUploadProgress && progress.total) {
            const percent = (progress.loaded * 100) / progress.total
            onUploadProgress(Math.round(percent))
          }
        },
      }),
    )
  }

  /**
   * Download file
   */
  async download(
    url: string,
    options: RequestOptions = {},
  ): Promise<ApiResponse<any>> {
    return this.apisauce.get(url, {}, { ...this.getRequestOptions(options), responseType: "arraybuffer" })
  }

  /**
   * Get request options with headers
   */
  private getRequestOptions(options: RequestOptions): any {
    const headers: Record<string, string> = { ...options.headers }

    if (options.isMultipart) {
      headers["Content-Type"] = "multipart/form-data"
    }

    return {
      headers,
    }
  }

  /**
   * Make request with error handling
   */
  private async makeRequest<T>(
    requestFn: () => Promise<ApiResponse<any>>,
  ): Promise<ApiResult<T>> {
    try {
      // Check connection if enabled
      const state = await NetInfo.fetch()
      if (!state.isConnected && !state.isInternetReachable) {
        return { kind: "cannot-connect" }
      }

      // Make request
      const response = await requestFn()

      // Check for errors
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      // Return data
      return { kind: "ok", data: response.data as T }
    } catch (error) {
      if (__DEV__) {
        console.error("[API] Request error:", error)
      }
      return { kind: "unknown" }
    }
  }
}

// Singleton instance
export const apiService = new ApiService()

export default apiService
