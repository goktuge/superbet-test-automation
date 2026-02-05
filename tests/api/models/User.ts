/**
 * User Model Interface
 * Represents user data structure
 */
export interface IUser {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User Model Class
 * Represents a user entity
 */
export class User implements IUser {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;

  /**
   * Constructor
   * @param data - User data
   */
  constructor(data: Partial<IUser>) {
    this.id = data.id || '';
    this.email = data.email || '';
    this.username = data.username || '';
    this.firstName = data.firstName || '';
    this.lastName = data.lastName || '';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}
