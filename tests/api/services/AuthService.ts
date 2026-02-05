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
   * @param _email - User email
   * @param _password - User password
   * @returns Promise with user data
   */
  async authenticate(_email: string, _password: string): Promise<IUser> {
    await Promise.resolve();
    throw new Error('Method not implemented.');
  }

  /**
   * Register new user
   * @param _userData - User registration data
   * @returns Promise with created user
   */
  async registerUser(_userData: unknown): Promise<IUser> {
    await Promise.resolve();
    throw new Error('Method not implemented.');
  }
}
