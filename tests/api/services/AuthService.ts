import { IAuthApiClient } from '../clients/AuthApiClient';
import { IUser } from '../models/User';

/**
 * Authentication Service Interface
 * Defines high-level authentication operations
 */
export interface IAuthService {
  /**
   * Authenticate user and return user data
   * @param email - User email
   * @param password - User password
   * @returns Promise with user data
   */
  authenticate(email: string, password: string): Promise<IUser>;

  /**
   * Register new user
   * @param userData - User registration data
   * @returns Promise with created user
   */
  registerUser(userData: unknown): Promise<IUser>;
}

/**
 * Authentication Service
 * Provides high-level authentication operations
 */
export class AuthService implements IAuthService {
  private readonly apiClient: IAuthApiClient;

  /**
   * Constructor
   * @param apiClient - Authentication API client
   */
  constructor(apiClient: IAuthApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * Authenticate user and return user data
   * @param email - User email
   * @param password - User password
   * @returns Promise with user data
   */
  async authenticate(email: string, password: string): Promise<IUser> {
    // Implementation to be added
    throw new Error('Method not implemented.');
  }

  /**
   * Register new user
   * @param userData - User registration data
   * @returns Promise with created user
   */
  async registerUser(userData: unknown): Promise<IUser> {
    // Implementation to be added
    throw new Error('Method not implemented.');
  }
}
