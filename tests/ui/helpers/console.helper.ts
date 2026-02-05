import { Page } from '@playwright/test';

/**
 * Console helper utilities
 * Captures and handles browser console logs
 */
export class ConsoleHelper {
  private static logs: Array<{ type: string; message: string; timestamp: number }> = [];

  /**
   * Capture console logs
   * @param page - Playwright page object
   */
  static captureConsoleLogs(page: Page): void {
    page.on('console', (msg) => {
      const type = msg.type();
      const text = msg.text();
      this.logs.push({
        type,
        message: text,
        timestamp: Date.now(),
      });
      console.log(`[Browser ${type}] ${text}`);
    });
  }

  /**
   * Get captured console logs
   * @returns Array of console log entries
   */
  static getLogs(): Array<{ type: string; message: string; timestamp: number }> {
    return [...this.logs];
  }

  /**
   * Clear captured logs
   */
  static clearLogs(): void {
    this.logs = [];
  }

  /**
   * Get logs by type
   * @param type - Log type (log, error, warning, etc.)
   * @returns Filtered logs
   */
  static getLogsByType(type: string): Array<{ type: string; message: string; timestamp: number }> {
    return this.logs.filter((log) => log.type === type);
  }

  /**
   * Check for console errors
   * @returns True if errors found
   */
  static hasErrors(): boolean {
    return this.logs.some((log) => log.type === 'error');
  }

  /**
   * Get console errors
   * @returns Array of error logs
   */
  static getErrors(): Array<{ type: string; message: string; timestamp: number }> {
    return this.getLogsByType('error');
  }
}
