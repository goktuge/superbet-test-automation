import * as path from 'path';

import * as dotenv from 'dotenv';

/**
 * Configuration Manager
 * Implements Singleton Pattern for configuration management
 */
export class ConfigManager {
  private static instance: ConfigManager;
  private config: Record<string, string> = {};

  /**
   * Private constructor for Singleton
   */
  private constructor() {
    this.loadConfig();
  }

  /**
   * Get singleton instance
   * @returns ConfigManager instance
   */
  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  /**
   * Load configuration from environment file
   */
  private loadConfig(): void {
    const env = process.env.ENV || 'local';
    const envPath = path.resolve(__dirname, `environments/${env}.env`);
    dotenv.config({ path: envPath });

    this.config = {
      baseUrl: process.env.BASE_URL || 'https://superbet.ro',
      env: env,
      headless: process.env.HEADLESS || 'true',
      retryCount: process.env.RETRY_COUNT || '2',
      timeout: process.env.TIMEOUT || '60000',
    };
  }

  /**
   * Get configuration value
   * @param key - Configuration key
   * @returns Configuration value
   */
  get(key: string): string {
    return this.config[key] || '';
  }

  /**
   * Get base URL
   * @returns Base URL
   */
  getBaseUrl(): string {
    return this.config.baseUrl;
  }

  /**
   * Get environment
   * @returns Environment name
   */
  getEnv(): string {
    return this.config.env;
  }

  /**
   * Check if headless mode is enabled
   * @returns True if headless
   */
  isHeadless(): boolean {
    return this.config.headless === 'true';
  }

  /**
   * Get retry count
   * @returns Retry count
   */
  getRetryCount(): number {
    return parseInt(this.config.retryCount, 10);
  }

  /**
   * Get timeout
   * @returns Timeout in milliseconds
   */
  getTimeout(): number {
    return parseInt(this.config.timeout, 10);
  }
}
