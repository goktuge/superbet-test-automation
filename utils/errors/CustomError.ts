/**
 * Custom Error Classes
 * Provides meaningful error types for better error handling
 */

/**
 * Base custom error class
 */
export class CustomError extends Error {
  public readonly context?: Record<string, unknown>;

  /**
   * Constructor
   * @param message - Error message
   * @param context - Additional context
   */
  constructor(message: string, context?: Record<string, unknown>) {
    super(message);
    this.name = this.constructor.name;
    this.context = context;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Element not found error
 */
export class ElementNotFoundError extends CustomError {
  /**
   * Constructor
   * @param selector - Element selector
   * @param timeout - Timeout that was exceeded
   */
  constructor(selector: string, timeout?: number) {
    super(`Element not found: ${selector}`, { selector, timeout });
  }
}

/**
 * Navigation error
 */
export class NavigationError extends CustomError {
  /**
   * Constructor
   * @param url - URL that failed to load
   * @param reason - Failure reason
   */
  constructor(url: string, reason?: string) {
    super(`Navigation failed: ${url}`, { url, reason });
  }
}

/**
 * Test data error
 */
export class TestDataError extends CustomError {
  /**
   * Constructor
   * @param message - Error message
   * @param dataType - Type of test data
   */
  constructor(message: string, dataType?: string) {
    super(`Test data error: ${message}`, { dataType });
  }
}
