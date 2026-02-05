import { faker } from '@faker-js/faker';

/**
 * Base Builder class for test data generation
 * Uses Builder Pattern with Faker.js
 */
export abstract class TestDataBuilder<T> {
  protected data: Partial<T> = {};

  /**
   * Build the final test data object
   * @returns Complete test data object
   */
  abstract build(): T;

  /**
   * Reset builder to initial state
   * @returns Builder instance for chaining
   */
  reset(): this {
    this.data = {};
    return this;
  }

  /**
   * Set a property value
   * @param key - Property key
   * @param value - Property value
   * @returns Builder instance for chaining
   */
  protected set<K extends keyof T>(key: K, value: T[K]): this {
    this.data[key] = value;
    return this;
  }

  /**
   * Get a property value
   * @param key - Property key
   * @returns Property value or undefined
   */
  protected get<K extends keyof T>(key: K): T[K] | undefined {
    return this.data[key];
  }
}

/**
 * User test data builder
 */
export interface UserTestData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
}

export class UserTestDataBuilder extends TestDataBuilder<UserTestData> {
  /**
   * Set email
   * @param email - Email address
   * @returns Builder instance
   */
  withEmail(email?: string): this {
    return this.set('email', email || faker.internet.email());
  }

  /**
   * Set password
   * @param password - Password
   * @returns Builder instance
   */
  withPassword(password?: string): this {
    return this.set('password', password || faker.internet.password({ length: 12 }));
  }

  /**
   * Set first name
   * @param firstName - First name
   * @returns Builder instance
   */
  withFirstName(firstName?: string): this {
    return this.set('firstName', firstName || faker.person.firstName());
  }

  /**
   * Set last name
   * @param lastName - Last name
   * @returns Builder instance
   */
  withLastName(lastName?: string): this {
    return this.set('lastName', lastName || faker.person.lastName());
  }

  /**
   * Set username
   * @param username - Username
   * @returns Builder instance
   */
  withUsername(username?: string): this {
    return this.set('username', username || faker.internet.userName());
  }

  /**
   * Build complete user test data
   * @returns User test data object
   */
  build(): UserTestData {
    return {
      email: this.get('email') || faker.internet.email(),
      password: this.get('password') || faker.internet.password({ length: 12 }),
      firstName: this.get('firstName') || faker.person.firstName(),
      lastName: this.get('lastName') || faker.person.lastName(),
      username: this.get('username') || faker.internet.userName(),
    };
  }
}
