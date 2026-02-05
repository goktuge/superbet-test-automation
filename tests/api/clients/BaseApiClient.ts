/**
 * Base API Client Interface
 * All API clients should implement this interface
 */
export interface IBaseApiClient {
  /**
   * Get base URL for API requests
   * @returns Base URL string
   */
  getBaseUrl(): string;

  /**
   * Set authentication token
   * @param token - Authentication token
   */
  setAuthToken(token: string): void;

  /**
   * Get default headers
   * @returns Headers object
   */
  getDefaultHeaders(): Record<string, string>;
}

/**
 * Base API Client Abstract Class
 * Provides common functionality for all API clients
 */
export abstract class BaseApiClient implements IBaseApiClient {
  protected baseUrl: string;
  protected authToken?: string;
  protected defaultHeaders: Record<string, string>;

  /**
   * Constructor
   * @param baseUrl - Base URL for API
   */
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Get base URL
   * @returns Base URL string
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Set authentication token
   * @param token - Authentication token
   */
  setAuthToken(token: string): void {
    this.authToken = token;
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Get default headers
   * @returns Headers object
   */
  getDefaultHeaders(): Record<string, string> {
    return { ...this.defaultHeaders };
  }
}
