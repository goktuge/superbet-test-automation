import { BaseApiClient } from './BaseApiClient';

/**
 * Authentication API Client Interface
 * Defines methods for authentication operations
 */
export interface IAuthApiClient {
  /**
   * Login user
   * @param email - User email
   * @param password - User password
   * @returns Promise with authentication response
   */
  login(email: string, password: string): Promise<unknown>;

  /**
   * Register new user
   * @param userData - User registration data
   * @returns Promise with registration response
   */
  register(userData: unknown): Promise<unknown>;

  /**
   * Logout user
   * @returns Promise with logout response
   */
  logout(): Promise<unknown>;

  /**
   * Refresh authentication token
   * @param refreshToken - Refresh token
   * @returns Promise with new token
   */
  refreshToken(refreshToken: string): Promise<unknown>;
}

/**
 * Authentication API Client
 * Handles all authentication-related API calls
 */
export class AuthApiClient extends BaseApiClient implements IAuthApiClient {
  /**
   * Constructor
   * @param baseUrl - Base URL for API
   */
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  /**
   * Login user
   * @param email - User email
   * @param password - User password
   * @returns Promise with authentication response
   */
  async login(email: string, password: string): Promise<unknown> {
    // Implementation to be added
    throw new Error('Method not implemented.');
  }

  /**
   * Register new user
   * @param userData - User registration data
   * @returns Promise with registration response
   */
  async register(userData: unknown): Promise<unknown> {
    // Implementation to be added
    throw new Error('Method not implemented.');
  }

  /**
   * Logout user
   * @returns Promise with logout response
   */
  async logout(): Promise<unknown> {
    // Implementation to be added
    throw new Error('Method not implemented.');
  }

  /**
   * Refresh authentication token
   * @param refreshToken - Refresh token
   * @returns Promise with new token
   */
  async refreshToken(refreshToken: string): Promise<unknown> {
    // Implementation to be added
    throw new Error('Method not implemented.');
  }
}
