/**
 * Retry helper utilities
 * Provides retry logic for flaky operations
 */

/**
 * Retry a function with exponential backoff
 * @param fn - Function to retry
 * @param maxRetries - Maximum number of retries
 * @param delay - Initial delay in milliseconds
 * @returns Promise with function result
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries) {
        const backoffDelay = delay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, backoffDelay));
      }
    }
  }

  throw lastError || new Error('Retry failed');
}

/**
 * Retry a function with fixed delay
 * @param fn - Function to retry
 * @param maxRetries - Maximum number of retries
 * @param delay - Delay between retries in milliseconds
 * @returns Promise with function result
 */
export async function retryWithFixedDelay<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('Retry failed');
}
